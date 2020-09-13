from django.urls import path

from . import views

app_name = "tasks"

urlpatterns = [
    path("", views.index, name="index"),
    path("add/todo", views.add_todo, name="add_todo"),
    path("edit/todo/<uuid:id>", views.edit_todo, name="edit_todo"),
    path("delete/todo/<uuid:id>", views.delete_todo, name="delete_todo")

] 