from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
from django.http import Http404
from django.contrib.auth.decorators import login_required
from django.db.models import Q

from .models import User, Message, Conversation
from listings.models import Listing


def index(request):
    return render(request, "auctions/index.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return redirect("listings:index")
        else:
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


def logout_view(request):
    logout(request)
    return redirect("listings:index")


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return redirect("listings:index")
    else:
        return render(request, "auctions/register.html")

def profile(request, id):
    user = User.objects.filter(id=id, is_active=True).first()

    if not user:
        raise Http404()

    listings = list(
            Listing.objects.order_by('-updated_on').filter(is_deleted=False, created_by__id = id).prefetch_related(
                'listing_images'
            ).only(
                'id', 'title', 'description', 'price', 'is_free', 'is_biddable', 'updated_on', 'is_deleted'
            )
        )
    
    return render(request, 'auctions/profile.html', {
        "profile_user": user,
        "listings": listings
    })

@login_required
def message(request, recipient_id):

    conversation_established = Q(
        Q(recipient__id=request.user.id) | Q(recipient__id=recipient_id)
    )

    if request.method == 'GET':
        conversation = Conversation.objects.filter(conversation_established).only('id').first()

        if conversation:
            return redirect(to="conversation", conversation_id=conversation.id)
    
 
    if request.method == 'POST':
        message = request.POST.get("message", "")

        recipient_exists = User.objects.filter(id=recipient_id).exists()

        if not recipient_exists or message is "":
            return redirect(to="conversation")
            
        conversation = Conversation.objects.filter(conversation_established).only('id').first()

        if conversation:
            new_message = Message(message=message, created_by=request.user, updated_by=request.user, conversation=conversation)
            new_message.save()
        else:
            new_conversation = Conversation.objects.create(recipient_id=recipient_id, created_by=request.user, updated_by=request.user)
            new_conversation.save()
    
            new_message = Message(message=message, created_by=request.user, updated_by=request.user, conversation=new_conversation)
            new_message.save()

        return redirect(to="conversation", conversation_id=conversation.id)


    return redirect(to="messages")

@login_required
def conversation(request, conversation_id):
    # todo set conversation recipient_has_unread_messages to false

    conversation = Conversation.objects.select_related('recipient','created_by').filter(id=conversation_id)[0]
    messages = []

    if conversation:
        messages = list(Message.objects.order_by('created_on').prefetch_related('created_by').filter(conversation=conversation.id))

    recipient = conversation.get_recipient(request.user.id)

    return render(request, "auctions/conversation.html", {
        "conversation": conversation,
        "conversation_messages": messages,
        "recipient": recipient
    })


@login_required
def messages(request):
    user_id = request.user.id

    # Get all conversations user is apart of 
    conversations = list(
        Conversation.objects.order_by('created_on').select_related('created_by', 'recipient').filter(
            Q(Q(recipient__id=user_id) | Q(created_by__id=user_id))
        )
    )

    return render(request, "auctions/conversations.html", {
        "conversations": conversations,
    })