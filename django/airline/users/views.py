from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
def index(request):
    if not request.user.is_authenticated:
        return redirect('auth:login')

    return render(request, 'users/index.html')

def login_view(request):
    if request.method == "GET":
        return render(request, "users/login.html")
    
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return redirect('auth:index')
    
        return render(request, "users/login.html", {
            "message": "Invalid username or password"
        })
    
    
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        
    return redirect('auth:login')
