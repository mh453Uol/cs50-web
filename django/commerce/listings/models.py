from django.db import models
import datetime

class University(models.Model):
    name = models.CharField(max_length=256)
    
    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='university_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='university_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Category(models.Model):
    name = models.CharField(max_length=256)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='category_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='category_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name}"

class Listing(models.Model):
    title = models.CharField(max_length=256)
    description = models.CharField(max_length=1026)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    is_active = models.BooleanField(default=True)
    is_free = models.BooleanField(default=False)
    is_biddable = models.BooleanField(default=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='listings', null=True)
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='listings', null=True)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='listing_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='listing_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}"

class Watchlist(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE)

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='watchlist_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='watchlist_updated_by')
    is_deleted = models.BooleanField(default=False)

class Message(models.Model):
    message = models.CharField(max_length=1026)
    is_read = models.BooleanField(default=False)

    recipient = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='messages')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='comment_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='comment_updated_by')
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.message}"

class Bid(models.Model):
    bid = models.DecimalField(max_digits=6, decimal_places=2)
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='bids')

    created_on = models.DateTimeField(auto_now_add=True)
    updated_on = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='bid_created_by')
    updated_by = models.ForeignKey('auctions.User', on_delete=models.CASCADE, related_name='bid_updated_by')
    is_deleted = models.BooleanField(default=False)

    
    def __str__(self):
        return f"{self.bid}"

def get_image_filename(instance, filename):
    id = instance.listing.id
    now = datetime.datetime.now()
    extension = filename.split(".")[-1]
    return f'listing/{id}/{now}.{extension}'

class Images(models.Model):
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE, related_name='listing_images')
    # directory which holds the uploaded images
    image = models.ImageField(null=True, blank=True, upload_to=get_image_filename, verbose_name='Image')

    def __str__(self):
        return f"{self.image}"
