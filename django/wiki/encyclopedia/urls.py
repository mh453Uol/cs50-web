from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/create", views.create, name="create"),
    path("wiki/search", views.search, name="search"),
    path("wiki/edit/<str:wiki_title>", views.edit, name="edit"),
    path("wiki/random", views.random, name="random"),
    path("wiki/<str:wiki_title>", views.details, name="wiki_details"),
]
