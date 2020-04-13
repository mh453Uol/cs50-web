from flask import Flask, render_template, request
from models import *
import os
import jsons

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)


@app.route("/")
def index():
    flights = Flight.query.all()
    print(flights)

    model = { "flights": [] }

    for flight in flights:
        model.get("flights").append(flight.__dict__)
    
    print(model)
