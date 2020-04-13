import os
from flask import Flask, render_template, redirect
from models import *

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


def update():
    flight = Flight.query.get(8)
    flight.duration = 0

    db.session.commit()

def main():
    #flights = Flight.query.all()

    # for flight in flights:
    #     print(f"{flight.origin} to {flight.destination}, {flight.duration} minutes")
    # print(Flight.query.count())
    # print(only_one())
    # print(Flight.query.get(8))

    flights = Flight.query.filter(
        Flight.origin != "Pakistan"
    ).all()

    for flight in flights:
        print(f"{flight.origin} to {flight.destination}, {flight.duration} minutes")

    update()

def only_one():
    return Flight.query.filter_by(origin="Peru").first()

if __name__ == "__main__":
    with app.app_context():
        main()
    
