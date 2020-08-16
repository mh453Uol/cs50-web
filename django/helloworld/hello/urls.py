from django.urls import path
from . import views

urlpatterns = [
    # anything which matches "/" load the index function
    path("", views.index, name="index"),
    path("<str:name>", views.name, name="queryparams")
]
