from datetime import datetime
from icalendar import Calendar, Event, vCalAddress
import json
import os
from chalice import Chalice, CORSConfig, ConvertToMiddleware, Response
from datadog_lambda.wrapper import datadog_lambda_wrapper
import requests
from urllib.parse import urlencode

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
    if (method is not None):
        data_dashboard_response = requests.get(
            f"https://dashboard-api.labs.transitmatters.org/api/aggregate/{method}?{urlencode(app.current_request.query_params)}"
        )
        return json.dumps(data_dashboard_response.json(), indent=4, sort_keys=True, default=str)
    return None

@app.route("/calendar", cors=cors_config)
def calendar():
    # init the calendar
    cal = Calendar()
    cal.add('prodid', '-//MBTA Shutdown Calendar//transitmatters.org//')
    cal.add('version', '2.0')

    # get the shutdowns
    with open("../src/constants/shutdowns.json", "r") as f:
        shutdowns = json.load(f)
        lines = shutdowns.keys()
        for line in lines:
            for shutdown in shutdowns[line]:
                event = Event()
                event_name = f"MBTA {line} Line Shutdown {shutdown['start_station']} - {shutdown['end_station']}"
                event.add('name', event_name)
                event.add('summary', event_name)
                event.add('description', f"The MBTA {line} Line will be shut down between {shutdown['start_station']} and {shutdown['end_station']}. During this time the MBTa plans to make repairs and improvements to the line.")
                event.add('dtstart', datetime.strptime(shutdown['start_date'], "%Y-%m-%d").date())
                event.add('dtend', datetime.strptime(shutdown['stop_date'], "%Y-%m-%d").date())

                cal.add_component(event)

    response = Response(body=cal.to_ical())
    response.headers["Content-Disposition"] = "attachment; filename=calendar.ics"
    return response
