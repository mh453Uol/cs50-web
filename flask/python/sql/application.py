from flask import Flask, render_template, request, redirect
from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

import os

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))
# {basedir}/db/flight.db
sqlite_db_file = os.path.join(basedir, 'db', 'flight.db')

engine = create_engine(f'sqlite:///{sqlite_db_file}')
db = scoped_session(sessionmaker(bind=engine))


@app.route("/")
def index():
    flights = db.execute("SELECT * FROM flights").fetchall()

    return render_template("index.html", flights=flights)


@app.route("/book", methods=["POST"])
def book():
    firstname = request.form.get("firstname")
    surname = request.form.get("surname")

    try:
        flight = int(request.form.get("flight"))
    except ValueError:
        return render_template("error.html", message="Invalid Flight Number")

    flight_exists = db.execute("""
        SELECT * FROM flights WHERE id = :id""",
                               {"id": flight}).rowcount

    if flight_exists == 0:
        return render_template("error.html", message="Invalid Flight Number")

    db.execute("""
        INSERT INTO passengers (firstname, surname, flight_id)
        VALUES (:firstname, :surname, :flight_id)""",
               {"firstname": firstname, "surname": surname, "flight_id": flight})

    db.commit()

    return redirect("/flights/{0}/passengers".format(flight))


@app.route("/flights")
def flights():
    f = db.execute("SELECT * FROM flights").fetchall()

    return render_template("flights.html", flights=f)

@app.route("/flights/<int:flight_id>/passengers")
def passengers(flight_id):
    passengers = db.execute("SELECT * FROM passengers WHERE flight_id = :id",
        {"id": flight_id}).fetchall()

    return render_template("passengers.html", passengers=passengers)
