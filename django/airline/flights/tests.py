from django.test import TestCase, Client
from .models import Airport, Flight

# Create your tests here.
class FlightTestCase(TestCase):

    def setUp(self):

        a1 = Airport.objects.create(code="AAA", city="City A")
        a2 = Airport.objects.create(code="BBB", city="City B")

        Flight.objects.create(origin=a1, destination=a2, duration=100)
        Flight.objects.create(origin=a2, destination=a1, duration=200)
        Flight.objects.create(origin=a1, destination=a2, duration=-100)
        Flight.objects.create(origin=a1, destination=a1, duration=100)

    def test_departures_count(self):
        a = Airport.objects.get(code="AAA")
        self.assertEqual(a.departures.count(), 3)

    def test_valid_flight(self):
        a1 = Airport.objects.get(code="AAA")
        a2 = Airport.objects.get(code="BBB")

        f1 = Flight.objects.get(origin=a1, destination=a2, duration=100)
        self.assertTrue(f1.is_valid_flight())

        f2 = Flight.objects.get(origin=a1, destination=a2, duration=-100)
        self.assertFalse(f2.is_valid_flight())

    # testing view handlers
    def test_index(self):
        c = Client()
        response = c.get("/flights/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.context["flights"].count(), 4)
    


