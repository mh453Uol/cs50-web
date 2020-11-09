from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Q, Count, Max, Prefetch
from django.contrib.auth.decorators import login_required
from django.http import Http404

from .forms import ListingSearch, AuctionForm, CreateListing
from .models import University, Listing, Bid, Images, Category, Watchlist
from decimal import Decimal


def get_bids_ordered_by_bid_value(listing_id):
    return list(
        Bid.objects.filter(listing__id=listing_id).order_by('-bid').only(
            'id', 'bid', 'created_on', 'created_by__id'
        )
    )


def get_highest_bid(listing_id):
    return Bid.objects.filter(listing__id=listing_id).order_by('-bid').only(
        'id', 'bid', 'created_on'
    ).first()


def index(request):
    form = ListingSearch(request.GET)
    listings = []

    show_all_filters = request.GET.get('show_filters', None)

    if show_all_filters is not None:
        form.show_advance_filters = True

    if form.is_valid():
        # load listings select listings where
        #   listing.title is contains title, listing.description contains title
        data = form.cleaned_data
        sort_by = form.get_sort_order_field(data['sort_order'])
        name = data['title']
        universityId = data['university']
        categoryId = data['category']

        query = Q(
                    Q(title__icontains=name) | Q(description__icontains=name),
                    is_deleted=False,
                    is_active=True,
                )

        if universityId is not None:
            query.add(Q(university_id=universityId), Q.AND)

        if categoryId is not None:
            query.add(Q(category_id=categoryId), Q.AND)

        listings = list(
            Listing.objects.order_by(sort_by).filter(query).prefetch_related(
                'listing_images'
            ).only(
                'id', 'title', 'description', 'price', 'is_free', 'is_biddable', 'updated_on'
            )
        )

    return render(request, "listings/index.html", {
        "form": form,
        "listings": listings,
        "display_listings": form.is_valid()
    })


def detail(request, id):
    listing = Listing.objects.select_related('created_by').prefetch_related(
        'category', 'listing_images',
    ).get(id=id)

    bids = get_bids_ordered_by_bid_value(id)

    is_on_wishlist = False

    if request.user.is_authenticated:
        is_on_wishlist = Watchlist.objects.filter(
            listing__id=id, created_by=request.user, is_deleted=False).exists()

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

    return render(request, "listings/detail.html", {
        "listing": listing,
        "listings": [listing],
        "bids": bids,
        "highestBid": highest_bid,
        "on_wishlist": is_on_wishlist,
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
                is_active=True, is_biddable=True, id=id).only('id', 'price').first()

            if not listing:
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

            listing.created_by = request.user
            listing.updated_by = request.user
            listing.save()

            files = request.FILES.getlist('images')

            Images.objects.bulk_create(
                [Images(listing=listing, image=image) for image in files]
            )

        return redirect('listings:detail', id=listing.id)
    else:
        return render(request, 'listings/create.html', {
            'form': CreateListing(),
        })


@login_required
def add_to_wishlist(request, id):
    if request.method == 'POST':
        if Listing.objects.filter(pk=id, is_deleted=False).exists():
            wishlist = Watchlist.objects.create(
                listing_id=id, created_by=request.user, updated_by=request.user)
            wishlist.save()
        else:
            messages.error(request, f'Could add listing to wishlist')

    return redirect(to='listings:detail', id=id)


@login_required
def remove_wishlist(request, id):
    if request.method == 'POST':
        wishlist = Watchlist.objects.get(pk=id);
        if wishlist:
            wishlist.is_deleted = True
            wishlist.save()
        else:
            messages.error(request, f'Could not remove wishlist {id}')

    return redirect(to='listings:wishlist')


@login_required
def wishlist(request):
    wishlists = list(
        Watchlist.objects.order_by('-created_on').filter(is_deleted=False, created_by=request.user).select_related('listing').only(
            'listing__id', 'listing__title', 'created_on'
        )
    )

    return render(request, 'listings/wishlist.html', {
        'wishlists': wishlists
    })


def categories(request):

    categories = Category.objects.filter(is_deleted=False).order_by('name').only(
        'id', 'name'
    )

    return render(request, 'listings/categories.html', {
        'categories': categories
    })

@login_required
def close_bid(request, id):
    if request.method == 'POST':
        listing = Listing.objects.filter(id=id, created_by=request.user.id).only(
            'id','created_by'
        ).first()
    
        if not listing:
            messages.error(request, f'Could not find listing {id}')

        listing.is_active = False

        listing.save()
    
    return redirect(to='listings:detail', id=id)



    





    

