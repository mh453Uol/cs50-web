from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=256)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='category_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='category_updated_by')
    is_deleted = models.BooleanField(default=False)

class Listing(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=1026)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    # directory which holds the uploaded images
    image_directory = models.CharField(max_length=256)
    is_active = models.BooleanField(default=True)
    is_free = models.BooleanField(default=False)
    is_biddable = models.BooleanField(default=False)
    category = models.ManyToManyField(Category, related_name='listings')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='listing_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='listing_updated_by')
    is_deleted = models.BooleanField(default=False)

class Watchlist(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='watchlist_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='watchlist_updated_by')
    is_deleted = models.BooleanField(default=False)

class Comment(models.Model):
    comment = models.CharField(max_length=1026)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='comments')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='comment_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='comment_updated_by')
    is_deleted = models.BooleanField(default=False)

class Bid(models.Model):
    bid = models.DecimalField(max_digits=6, decimal_places=2)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='bid_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='bid_updated_by')
    is_deleted = models.BooleanField(default=False)