import os
import requests
import dateutil.parser

from flask import Flask, request
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)

# enable any origin to access the api https://flask-cors.readthedocs.io/en/3.0.7/
cors = CORS(app)

if not os.getenv("AIRMYPRAYER_API"):
    raise RuntimeError("AIRMYPRAYER Api Url Not Set")

base_api_url = os.getenv("AIRMYPRAYER_API")

# /api/v1/<tenant>/prayers/daily?date=<iso-8601>
@app.route("/api/v1/<tenant>/prayers/daily", methods=["GET"])
def daily(tenant):
    date = request.args.get("date")

    if date is None:
        date = datetime.now()
    else:
        date = dateutil.parser.parse(date)

    response = get_daily_prayers(tenant, date)

    if not response.ok:
        return {
            "code": f"{response}.status_code",
            "message": f"{response}.text"
        }

    return response.json()

# /api/v1/prayers/jamaat
@app.route("/api/v1/<tenant>/prayers/jamaat", methods=["GET"])
def jamaat(tenant):
    response = get_jamaat_times(tenant)

    if not response.ok:
        return {
            "code": f"{response}.status_code",
            "message": f"{response}.text"
        }

    return response.json()

# /api/v1/stream/<tenant>
# Make a HEAD Request to https://audio.airmyprayer.co.uk/ayl-<tenant>
# if we get 404 that means the stream is ended
@app.route("/api/v1/<tenant>/stream", methods=["GET"])
def stream(tenant):
    url = f"https://audio.airmyprayer.co.uk/ayl-{tenant}"

    response = requests.head(url = url)

    data = {
        "isLive": response.ok,
        "audioStreamUrl": url
    }

    return data
    

# Make backend api request to 
# https://prayertimes.airmyprayer.co.uk/<tenant>/prayer<tenant>?handler=getprayertimesdaily
# Body: { date: str, month: str, establishid: str }
def get_daily_prayers(tenant, date):
    url = api_url(tenant, "getprayertimesdaily")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    #https://docs.python.org/3/library/datetime.html#strftime-strptime-behavior

    body = {
        "date": f"{date.day}",
        "month": f"{date.strftime('%B')}",
        "establishid": tenant
    }

    response = requests.post(url=url, headers=headers, json=body)

    return response

# https://prayertimes.airmyprayer.co.uk/<tenant>/prayer<tenant>?handler=getprayertimesjamaat
# Body: { establishid : str }
def get_jamaat_times(tenant):
    url = api_url(tenant, "getprayertimesjamaat")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    body = {"establishid": tenant}

    response = requests.post(url=url, headers=headers, json=body)

    return response


def api_url(tenant, handler):
    print(f"{base_api_url}/{tenant}/prayer{tenant}?handler={handler}")
    return f"{base_api_url}/{tenant}/prayer{tenant}?handler={handler}"
