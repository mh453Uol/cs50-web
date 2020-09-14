from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<str:wiki_title>", views.details, name="queryparams")
]
