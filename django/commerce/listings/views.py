from django.shortcuts import render, redirect
from .forms import ListingSearch, AuctionForm
from .models import University, Listing, Bid
from django.db.models import Q, Count
from decimal import Decimal

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
            university__id=universityId
        )

        print(listings)
   
    return render(request, "listings/index.html", {
        "form": form,
        "listings": listings,
        "display_listings": len(listings) > 0
    })

def detail(request, id):
    listing = Listing.objects.select_related('created_by').prefetch_related('category').get(id=id)
    bids = list(
        Bid.objects.order_by('-created_on').filter(listing__id=id).only('id', 'bid', 'created_on')
    )
    highestBid = None
    auctionForm = None

    if len(bids) > 0:
        # get the highest bid
        highestBid = bids[0]
        # set the bid starting value here its the highest bid + 0.1
        auctionForm = AuctionForm(starting_value={'value': highestBid.bid + Decimal('0.1')}, initial={'highestBidId': highestBid.id})
    else:
        # we dont have any bids so the starting value is the listing price + 0.1
        auctionForm = AuctionForm(starting_value={'value': listing.price + Decimal('0.1')})

    print(listing.created_by)
    print(bids)

    return render(request, "listings/detail.html", {
        "listing": listing,
        "bids": bids,
        "highestBid": highestBid,
        "auctionForm": auctionForm
    })


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
            # 3. If the seen_bid is not the highest bid this means the user did not have the latest data - render message
            # 4. Create bid against listing
            listing = Listing.objects.filter(is_active=True, is_biddable=True, id=id).count()

            if listing != 1:
                message = "You are unable to place a bid on this listing."
                return redirect(to='listings:detail', id=id)
            
            highest_bid = Bid.objects.order_by('-created_on').filter(listing__id=id).only('id', 'bid').first()

            print(listing, highest_bid)

            if placed_bid <= highest_bid.bid:
                message = f"Place place a bid greater than £{highest_bid.bid}"
                return redirect(to='listings:detail', id=id)

            if highest_bid.id != seen_bid:
                message = f"Someone else placed a new bid of £{highest_bid.bid} since you last refreshed the page"
                return redirect(to='listings:detail', id=id)

            
    return redirect(to='listings:detail', id=id)
