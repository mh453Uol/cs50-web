from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import Http404
from django.contrib.auth.decorators import login_required

from .models import User
from listings.models import Listing


def index(request):
    return render(request, "auctions/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return redirect("listings:index")
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return redirect("listings:index")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return redirect("listings:index")
    else:
        return render(request, "auctions/register.html")

def profile(request, id):
    user = User.objects.filter(id=id, is_active=True).first()

    if not user:
        raise Http404()

    listings = list(
            Listing.objects.order_by('-updated_on').filter(is_deleted=False, created_by__id = id).prefetch_related(
                'listing_images'
            ).only(
                'id', 'title', 'description', 'price', 'is_free', 'is_biddable', 'updated_on', 'is_deleted'
            )
        )
    
    return render(request, 'auctions/profile.html', {
        "profile_user": user,
        "listings": listings
    })

@login_required
def messages(request):
   recipent = request.GET.get('recipent', None)
   listing = request.GET.get('listing', None)

   User = User.objects.filter(id=recipent, is_active=False).only('id', 'first_name', 'last_name')


    

