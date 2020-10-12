from django.shortcuts import render
from .forms import ListingSearch

def index(request):
    return render(request, "listings/index.html", {
        "form": ListingSearch()
    })
