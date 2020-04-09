class Passenger:
    flight_id = None
    
    def __init__(self, name):
        self.name = name

class Flight:
    counter = 1

    def __init__(self, origin: str, destination: str, duration: int):
        self.id = Flight.counter

        Flight.counter += 1
        self.origin = origin
        self.destination = destination
        self.duration = duration
        self.passengers = []


    def print_info(self):
        print(self.origin)
        print(self.destination)
        print(f"{self.duration/60}")

        for passenger in self.passengers:
            print(f"Name: {passenger.name}, Id: {passenger.flight_id}")

        print("____________________________________")
    def delay(self, amount):
        self.duration += amount
    
    def add_passenger(self, p: Passenger):
        self.passengers.append(p)
        p.flight_id = self.id

# 
def main():
    f = Flight(origin='London Heathrow', destination='Islamabad', duration=60*7.5)
    
    f.add_passenger(Passenger(name="Majid"))
    f.add_passenger(Passenger(name="Adam"))

    f2 = Flight(origin='London Heathrow', destination='Qatar', duration=60*3.5)

    f.print_info()

    f2.delay(65)
    f2.print_info()



if __name__ == '__main__':
    main()
