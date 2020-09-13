from django.shortcuts import render
from django.views.decorators.http import require_http_methods

# Create your views here.
todos = ["foo", "bar", "baz"];

def index(request):
    return render(request, "tasks/index.html", { 
        "tasks": todos
    });

@require_http_methods(["POST"])
def add_todo(request):
    return request