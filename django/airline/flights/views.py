from django.shortcuts import render, Http404, redirect, get_object_or_404
from django.db.models import Prefetch
from .models import *

# Create your views here.
def index(request):
    flights = Flight.objects.select_related('origin', 'destination').all()

    return render(request, 'flights/index.html', {
        'flights': flights
    })

def create(request):
    return render(request, 'flights/create.html')

def view(request, id):
    if id is None:
        return Http404()
    
    flight = Flight.objects.select_related('origin', 'destination').get(pk=id)
    
    return render(request, 'flights/view.html', {
        'flight': flight,
        'passengers': flight.passengers.all()
    })

def book(request, id):

    if request.method == "GET":
        flight = Flight.objects.get(pk=id)
        return render(request, 'flights/book.html', {
            'flight': flight,
            'passengers': Passenger.objects.exclude(flights=flight)
        })
    
    if request.method == "POST":
        passengerId = int(request.POST["passengerId"])

        flight = Flight.objects.get(pk=id)
        passenger = Passenger.objects.get(pk=passengerId)

        if (flight is not None and passenger is not None):
            passenger.flights.add(flight)
            return redirect('flights:index')
        else:
            return Http404()

