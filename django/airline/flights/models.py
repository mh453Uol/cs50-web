from django.db import models

class Airport(models.Model):
    code = models.CharField(max_length=3)
    city = models.CharField(max_length=64)

    def __str__(self):
        return f"{self.code} {self.city}"


class Flight(models.Model):
    # related_names going from Aiport we can access origin using the departures name
    origin = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='departures')
    destination = models.ForeignKey(Airport, on_delete=models.CASCADE, related_name='arrivals')
    duration = models.IntegerField()

    def __str__(self):
        return f"{self.id} from {self.origin} to {self.destination}" 


class Passenger(models.Model):
    firstname = models.CharField(max_length=255)
    lastname = models.CharField(max_length=255)
    flights = models.ManyToManyField(Flight, blank=True, related_name="passengers")

    def __str__(self):
        return f"{self.firstname} {self.lastname}"

