from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
from icalendar import Calendar, Event
import json
import os
from chalice import BadRequestError, Chalice, CORSConfig, ConvertToMiddleware, Response
from datadog_lambda.wrapper import datadog_lambda_wrapper
import requests
from urllib.parse import urlencode
from chalicelib import s3

EASTERN_TIME = ZoneInfo("US/Eastern")

app = Chalice(app_name="shutdown-tracker")

localhost = "localhost:3000"
TM_CORS_HOST = os.environ.get("TM_CORS_HOST", localhost)

if TM_CORS_HOST != localhost:
    app.register_middleware(ConvertToMiddleware(datadog_lambda_wrapper))
    cors_config = CORSConfig(allow_origin=f"https://{TM_CORS_HOST}", max_age=3600)
else:
    cors_config = CORSConfig(allow_origin="*", max_age=3600)


@app.route("/api/aggregate/{method}", cors=cors_config)
def proxy(method):
    if method is not None:
        data_dashboard_response = requests.get(
            f"https://dashboard-api.labs.transitmatters.org/api/aggregate/{method}?{urlencode(app.current_request.query_params)}"
        )
        return json.dumps(data_dashboard_response.json(), indent=4, sort_keys=True, default=str)
    return None


@app.route("/calendar", cors=cors_config)
def calendar():
    # init the calendar
    cal = Calendar()
    cal.add("prodid", "-//MBTA Shutdown Calendar//transitmatters.org//")
    cal.add("version", "2.0")

    shutdowns_file = s3.download("shutdowns.json", compressed=False)
    shutdowns = json.loads(shutdowns_file)
    lines = set(shutdowns.keys())

    # Check is user has filtered by line
    if app.current_request.query_params is not None and app.current_request.query_params.get("line") is not None:
        user_lines = set(app.current_request.query_params.getlist("line"))
        if not user_lines <= lines:
            # NOTE: This relies on shutdown.json containing an empty array for a line when a shutdown is not planned
            raise BadRequestError("Unknown line, valid choices are: %s" % (", ".join(lines)))
        lines = lines & user_lines

    for line in lines:
        for shutdown in shutdowns[line]:
            event = Event()
            event_name = (
                f"MBTA {line.capitalize()} Line Shutdown | {shutdown['start_station']} - {shutdown['end_station']}"
            )
            event.add("name", event_name)
            event.add("summary", event_name)
            event.add(
                "description",
                f"The MBTA {line.capitalize()} Line will be shut down between {shutdown['start_station']} and {shutdown['end_station']}. During this time the MBTA plans to make repairs and improvements to the line, and hopefully improve service. Read more at {shutdown['alert']}",
            )

            # Handle dates (set end date to day after stop date to include the whole day in the event)
            start_date = datetime.strptime(shutdown["start_date"], "%Y-%m-%d").replace(tzinfo=EASTERN_TIME)
            stop_date = datetime.strptime(shutdown["stop_date"], "%Y-%m-%d").replace(tzinfo=EASTERN_TIME) + timedelta(
                days=1
            )
            event.add("dtstart", start_date.date())
            event.add("dtend", stop_date.date())

            event.add("color", line)

            cal.add_component(event)

    response = Response(body=cal.to_ical())
    response.headers["Content-Disposition"] = "attachment; filename=calendar.ics"
    response.headers["Content-Type"] = "text/calendar"
    return response
