from django.shortcuts import render
import datetime
# Create your views here.


def index(request):
    now = datetime.datetime.now()
    isnewyearday = False

    if now.day == 1 and now.month == 1:
        isnewyearday = True

    return render(request, "newyear/index.html", {"isnewyearday": isnewyearday})
