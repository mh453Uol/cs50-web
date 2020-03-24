import os
import random

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

basedir = os.path.abspath(os.path.dirname(__file__))
# {basedir}/db/flight.db
sqlite_db_file = os.path.join(basedir, 'db', 'flight.db')

engine = create_engine(f'sqlite:///{sqlite_db_file}')
db = scoped_session(sessionmaker(bind=engine))


def main():

    passengers()

    # Inserting
    origin = "Pakistan"
    destination = "UK"
    duration = random.randint(1, 10000)

    #:origin, :destination are placeholders

    db.execute("""INSERT INTO flights (origin, destination, duration_in_minutes)
        VALUES (:origin, :destination, :duration)""",
               {"origin": origin, "destination": destination, "duration": duration})

    # send sql to db
    db.commit()

    flights = db.execute(
        "SELECT origin, destination, duration_in_minutes FROM flights").fetchall()

    for flight in flights:
        print(
            f"{flight.origin} to {flight.destination}, {flight.duration_in_minutes} minutes.")

def passengers():

    flights = db.execute("SELECT id, origin, destination, duration_in_minutes FROM flights").fetchall()

    for flight in flights:
        print(f"Flight {flight.id}: {flight.origin} to {flight.destination}, {flight.duration_in_minutes}")
    
    flight_id = int(input("\nFlight ID:"))
    
    selected_flight = db.execute(f"SELECT origin, destination, duration_in_minutes FROM flights WHERE id = :id", 
        {"id": flight_id}).fetchone()

    if selected_flight is None:
        print(f"\nCould not find flight {flight_id}")
    
    passengers = db.execute("""
        SELECT id, firstname, surname FROM passengers
        WHERE flight_id = :flight_id""", {"flight_id": flight_id}).fetchall()

    for passenger in passengers:
        print(f"{passenger.id}, {passenger.firstname}, {passenger.surname}")

    quit()


if __name__ == "__main__":
    main()
