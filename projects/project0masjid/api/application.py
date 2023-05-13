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
    raise RuntimeError("AIRMYPRAYER_API environment param not set")

if not os.getenv("AIRMYPRAYER_API_V2"):
    raise RuntimeError("AIRMYPRAYER_API_V2 environment param not set")

if not os.getenv("AIRMYPRAYER_V2_API_KEY"):
    raise RuntimeError("AIRMYPRAYER_V2_API_KEY environment param not set")

base_api_url = os.getenv("AIRMYPRAYER_API")
base_api_url_v2 = os.getenv("AIRMYPRAYER_API_V2")
v2_api_key = os.getenv("AIRMYPRAYER_V2_API_KEY")

# /api/v1/<tenant>/prayers/daily?date=<iso-8601>
@app.route("/api/v1/<tenant>/prayers/daily", methods=["GET"])
def daily(tenant):
    date = request.args.get("date")

    if date is None:
        date = datetime.now()
    else:
        date = dateutil.parser.parse(date)

    response = get_daily_prayers(tenant, date.day, date.strftime('%B'))

    if not response.ok:
        return {
            "code": f"{response.status_code}",
            "message": f"{response.text}"
        }

    return response.json()

# /api/v1/prayers/jamaat
@app.route("/api/v1/<tenant>/prayers/jamaat", methods=["GET"])
def jamaat(tenant):
    response = get_jamaat_times(tenant)

    if not response.ok:
        return {
            "code": f"{response.status_code}",
            "message": f"{response.text}"
        }

    return response.json()

# /api/v1/stream/<tenant>
# Make a HEAD Request to https://audio.airmyprayer.co.uk/ayl-<tenant>
# if we get 404 that means the stream is ended
@app.route("/api/v1/<tenant>/stream", methods=["GET"])
def stream(tenant):
    url = f"https://audio.airmyprayer.co.uk/ayl-{tenant}"

    response = requests.head(url=url)

    data = {
        "isLive": response.ok,
        "audioStreamUrl": url
    }

    return data


# Make backend api request to <api>/<tenant>/prayer<tenant>?handler=getprayertimesdaily
# Body: { date: str, month: str, establishid: str }
def get_daily_prayers(tenant, day, month):
    url = api_url(tenant, "getprayertimesdaily")

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    # https://docs.python.org/3/library/datetime.html#strftime-strptime-behavior

    body = {
        "date": f"{day}",
        "month": f"{month}",
        "establishid": tenant
    }

    response = requests.post(url=url, headers=headers, json=body)

    return response


# <api>/<tenant>/prayer<tenant>?handler=getprayertimesjamaat
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
    url = f"{base_api_url}/{tenant}/prayer{tenant}?handler={handler}"

    return url

## TODO: Make as blue print
############################### V2 API ###############################

# /api/v2/prayers//daily?date=<iso-8601>
@app.route("/api/v2/<tenant>/prayers/daily", methods=["GET"])
def daily_v2(tenant):
    date = request.args.get("date")

    if date is None:
        date = datetime.now()
    else:
        date = dateutil.parser.parse(date)

    url = f"{base_api_url_v2}/PrayerTimesDaily/jamaat"

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Apikey": f"{v2_api_key}",
    }

    textualMonth = date.strftime("%B")

    params = {
        "date": f"{date.day}",
        "month": f"{textualMonth.lower()}",
        "establishid": tenant
    }

    response = requests.get(url=url, headers=headers, params=params)

    if not response.ok:
        return {
            "code": f"{response.status_code}",
            "message": f"{response.text}"
        }

    return response.json()

# /api/v2/prayers/jamaat
@app.route("/api/v2/<tenant>/prayers/jamaat", methods=["GET"])
def jamaat_v2(tenant):
    url = f"{base_api_url_v2}/PrayerTimesJamaat/jamaat"

    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Apikey": f"{v2_api_key}",
    }

    params = {
        "establishid": tenant
    }

    response = requests.get(url=url, headers=headers, params=params)

    if not response.ok:
        return {
            "code": f"{response.status_code}",
            "message": f"{response.text}"
        }

    return response.json()
