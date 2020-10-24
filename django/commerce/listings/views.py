from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Q, Count, Max
from django.contrib.auth.decorators import login_required

from .forms import ListingSearch, AuctionForm, CreateListing
from .models import University, Listing, Bid, Images, Category
from decimal import Decimal


def get_bids_ordered_by_bid_value(listing_id):
    return list(
        Bid.objects.filter(listing__id=listing_id).order_by('-bid').only(
            'id', 'bid', 'created_on'
        )
    )

def get_highest_bid(listing_id):
    return Bid.objects.filter(listing__id=listing_id).order_by('-bid').only(
        'id', 'bid', 'created_on'
    ).first()

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

        listings = list(
            Listing.objects.order_by(sort_by).filter(
                Q(title__icontains=name) | Q(description__icontains=name),
                is_deleted=False,
                is_active=True,
                university__id=universityId
            ).only('id', 'title', 'description', 'price', 'is_free', 'is_biddable', 'updated_on')
        )

    return render(request, "listings/index.html", {
        "form": form,
        "listings": listings,
        "display_listings": form.is_valid()
    })


def detail(request, id):
    listing = Listing.objects.select_related('created_by').prefetch_related(
        'category', 'listing_images'
    ).get(id=id)

    bids = get_bids_ordered_by_bid_value(id)    
    highest_bid = None
    auction_form = None

    if len(bids) > 0:
        highest_bid = bids[0]
        # set the bid starting value here its the highest bid + 0.1
        auction_form = AuctionForm(starting_value={
                                   'value': highest_bid.bid + Decimal('0.1')}, initial={'highestBidId': highest_bid.id})
    else:
        # we dont have any bids so the starting value is the listing price + 0.1
        auction_form = AuctionForm(
            starting_value={'value': listing.price + Decimal('0.1')})

    print(listing.created_by)

    return render(request, "listings/detail.html", {
        "listing": listing,
        "bids": bids,
        "highestBid": highest_bid,
        "auctionForm": auction_form
    })


@login_required
def bid(request, id):

    if request.method == 'POST':
        form = AuctionForm(starting_value=None, data=request.POST)
        print(form.errors)

        if form.is_valid():
            data = form.cleaned_data
            seen_bid = data['highestBidId']
            placed_bid = data['bid']

            # 1. Get listing where id = listing.id, is_active is true and is_biddable (check we can make a bid on the listing)
            # 2. Get highest bid for the listing
            # 2.1 If the listing has a highest bid
            #   2.1.1 If the seen_bid is not the highest bid this means the user did not have the latest data - render message
            #   2.1.2 If the placed bid <= highest bid render error message
            # 2.2 If the listing does NOT have a bid (e.g listing are not guaranteed to have a bid)
            #   2.2.1 Check the placed bid is greater than the listing start price
            # 4. Create bid against listing

            listing = Listing.objects.filter(
                is_active=True, is_biddable=True, id=id).count()

            if listing != 1:
                messages.error(
                    request, 'You are unable to place a bid on this listing.')
                return redirect(to='listings:detail', id=id)

            highest_bid = get_highest_bid(id)

            if highest_bid is not None:
                if highest_bid.id != seen_bid and placed_bid <= highest_bid.bid:
                    messages.error(
                        request, f'Someone else placed a new bid of <b>£{highest_bid.bid}</b> since you last refreshed the page')
                    return redirect(to='listings:detail', id=id)

                if placed_bid <= highest_bid.bid:
                    messages.error(
                        request, f'Place place a bid greater than <b>£{highest_bid.bid}</b>')
                    return redirect(to='listings:detail', id=id)
            else:
                if placed_bid <= listing.price:
                    messages.error(
                        request, f'Place place a bid greater than listing start price <b>£{listing.bid}</b>')
                    return redirect(to='listings:detail', id=id)

            user = request.user

            bid = Bid.objects.create(
                bid=placed_bid, listing_id=id, created_by=user, updated_by=user)
            bid.save()

    return redirect(to='listings:detail', id=id)


@login_required
def create(request):

    if request.method == 'POST':
        form = CreateListing(request.POST)

        if form.is_valid():
            listing = form.save(commit=False)
            university = form.cleaned_data['university']
            category = form.cleaned_data['category']

            if university is not None:
                listing.university_id = university

            if category is not None:
                listing.category_id = category          

            listing.created_by=request.user
            listing.updated_by=request.user
            listing.save()
    
            files = request.FILES.getlist('images')

            Images.objects.bulk_create(
                [Images(listing=listing, image=image) for image in files]   
            )
            
        return redirect('listings:detail', id = listing.id)
    else:
        return render(request, 'listings/create.html', {
            'form': CreateListing(),
        })