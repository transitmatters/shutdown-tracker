import json
import os
from chalice import Chalice, CORSConfig, ConvertToMiddleware
from datadog_lambda.wrapper import datadog_lambda_wrapper
import requests
from urllib.parse import urlencode

app = Chalice(app_name="shutdown-tracker")

localhost = "localhost:3000"
TM_CORS_HOST = os.environ.get("TM_CORS_HOST", localhost)

if TM_CORS_HOST != localhost:
    app.register_middleware(ConvertToMiddleware(datadog_lambda_wrapper))
    
cors_config = CORSConfig(allow_origin=f"http://{TM_CORS_HOST}", max_age=3600)


@app.route("/api/proxy/{route_path}", cors=cors_config)
def proxy(route_path):
    if (route_path is not None):
        data_dashboard_response = requests.get(
            f"https://dashboard-api.labs.transitmatters.org/{route_path}?{urlencode(app.current_request.query_params)}"
        )
        return json.dumps(data_dashboard_response.json(), indent=4, sort_keys=True, default=str)
    return None
