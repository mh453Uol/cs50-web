from django.urls import path

from . import views

app_name = "flights"

urlpatterns = [
    path("create", views.create, name="create-flight"),
    path("view/<int:id>", views.view, name="view-flight"),
    path("<int:id>/book", views.book, name="book-flight"),
    path("", views.index, name="index")
]