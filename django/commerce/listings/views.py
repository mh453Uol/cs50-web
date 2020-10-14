from django.shortcuts import render
from .forms import ListingSearch
from .models import University

def index(request):
    form = ListingSearch()
    return render(request, "listings/index.html", {
        "form": form
    })
