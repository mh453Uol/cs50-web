from django.urls import path, include

from . import views

app_name = "listings"


urlpatterns = [
    path("search/", views.index, name="index"),
    path("<int:id>/bid", views.bid, name="bid"),
    path("create", views.create, name="create"),
    path("<int:id>/wishlist/add", views.add_to_wishlist, name="add-to-wishlist"),
    path("<int:id>/wishlist/remove", views.remove_wishlist, name="remove-wishlist"),
    path("wishlist", views.wishlist, name="wishlist"),
    path("categories", views.categories, name="categories"),
    path("<int:id>", views.detail, name="detail"),
]