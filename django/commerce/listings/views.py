from django.shortcuts import render, redirect
from .forms import ListingSearch
from .models import University, Listing
from django.db.models import Q

def index(request):
    form = ListingSearch(request.GET)
    listings = []

    if form.is_valid():
        # load listings select listings where 
        #   listing.title is contains title, listing.description contains title
        data = form.cleaned_data
        sort_by = form.get_sort_order_field(data['sort_order'])
        name = data['title']
        universityId = data['university']

        listings = Listing.objects.order_by(sort_by).filter(
            Q(title__icontains=name) | Q(description__icontains=name), 
            is_deleted=False,
        )

        print(listings)
   
    return render(request, "listings/index.html", {
        "form": form,
        "listings": listings,
        "display_listings": len(listings) > 0
    })

def detail(request, id):
    return render(request, "listings/index.html", {
    })
