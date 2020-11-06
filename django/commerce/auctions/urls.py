from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("<int:id>/profile", views.profile, name="profile"),
    path("messages/<int:recipient_id>/new", views.message, name="new-message"),
    path("messages/<int:conversation_id>", views.conversation, name="conversation"),
    path("messages", views.messages, name="messages"),
]
