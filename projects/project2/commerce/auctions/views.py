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
        first_name = request.POST["first_name"]
        last_name = request.POST["last_name"]
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
            user = User.objects.create_user(
                username = email,
                email = email,
                password = password,
                first_name = first_name,
                last_name = last_name
            )
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Email already taken."
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
            Listing.objects.order_by('-updated_on').filter(is_deleted=False, created_by_id = id).prefetch_related(
                'listing_images'
            ).only(
                'id', 'title', 'description', 'price', 'is_free', 'is_biddable', 'updated_on', 'created_by', 'is_deleted'
            )
        )
    
    return render(request, 'auctions/profile.html', {
        "profile_user": user,
        "listings": listings
    })


def conversation_established_query(recipient_1, recipient_2):
    return Q(
        Q(Q(recipient_1_id=recipient_1) & Q(recipient_2_id=recipient_2)) | Q(Q(recipient_1_id=recipient_2) & Q(recipient_2_id=recipient_1))   
    )

@login_required
def message(request, recipient_id):

    conversation_established = conversation_established_query(request.user.id, recipient_id)

    if request.method == 'GET':
        conversation = Conversation.objects.filter(conversation_established).only('id').first()

        recipient = User.objects.only('first_name', 'last_name').get(id=recipient_id)

        if conversation:
            return redirect(to="conversation", conversation_id=conversation.id)
        else:
            return render(request, "auctions/conversation.html", {
                    "conversation": conversation,
                    "recipient": recipient
                })

    if request.method == 'POST':
        message = request.POST.get("message", "")

        recipient_exists = User.objects.filter(id=recipient_id).exists()

        if not recipient_exists or message is "":
            return redirect(to="conversation")
            
        conversation = Conversation.objects.filter(conversation_established).only('id').first()

        if conversation:
            new_message = Message(recipient_id=recipient_id, message=message, created_by=request.user, updated_by=request.user, conversation=conversation)
            new_message.save()

            conversation.set_recipient_unread_messages(request.user.id)
            conversation.save()
        else:
            conversation = Conversation.objects.create(recipient_1_id=recipient_id, recipient_2_id=request.user.id, created_by=request.user, updated_by=request.user)
            conversation.set_recipient_unread_messages(request.user.id)
            conversation.save()
    
            new_message = Message(recipient_id=recipient_id, message=message, created_by=request.user, updated_by=request.user, conversation=conversation)
            new_message.save()

        return redirect(to="conversation", conversation_id=conversation.id)


    return redirect(to="messages")

@login_required
def conversation(request, conversation_id):
    
    has_access = Q(Q(recipient_1_id=request.user.id) | Q(recipient_2_id = request.user.id))

    conversation = Conversation.objects.select_related('recipient_1','recipient_2').only(
        'id', 'recipient_1_unread_messages', 'recipient_1_id', 'recipient_1__first_name', 'recipient_1__last_name',
        'recipient_2_unread_messages', 'recipient_2_id', 'recipient_2__first_name', 'recipient_2__last_name',
    ).get(Q(id = conversation_id) & Q(has_access))

    messages = []

    if conversation:
        messages = list(
            Message.objects.order_by('created_on').prefetch_related('created_by').filter(conversation=conversation.id)
        )

    # if the recipient has unread_messages set it to false since they are reading the messages now
    if conversation.user_has_unread_messages(request.user.id) is True:
        conversation.read_messages(request.user.id)
        conversation.save()

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
        Conversation.objects.order_by('created_on').select_related('recipient_1', 'recipient_2').filter(
            Q(Q(recipient_1_id=user_id) | Q(recipient_2_id=user_id))
        )
    )

    return render(request, "auctions/conversations.html", {
        "conversations": conversations
    })