from django.urls import path, include

from . import views

app_name = "listings"


urlpatterns = [
    path("", views.index, name="index"),
    path("<int:id>/bid", views.bid, name="bid"),
    path("create", views.create, name="create"),
    path("<int:id>", views.detail, name="detail"),
]