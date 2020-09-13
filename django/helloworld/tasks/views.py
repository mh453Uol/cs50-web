from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
import uuid

# Create your views here.
todos = [
    { "id": uuid.uuid4(), "name": "foo" },
    { "id": uuid.uuid4(), "name": "bar"},
    { "id": uuid.uuid4(), "name": "baz"}
]

def index(request):
    return render(request, "tasks/index.html", { 
        "tasks": todos
    });

@require_http_methods(["POST"])
def add_todo(request):
    form = request.POST.dict();

    todos.append(
        { "id": uuid.uuid4(), "name": form.get("todo") }
    )

    return redirect("tasks:index")

def edit_todo(request, id):
    todo = next((todo for todo in todos if todo['id'] == id), None)
    
    if request.method == 'GET':
        if todo is not None:
            return render(request, "tasks/edit.html", {"todo": todo})
        return redirect("tasks:index")

    if request.method == 'POST':
        if todo is not None:
            form = request.POST.dict();
            todo['name'] = form.get("todo")
        return redirect("tasks:index")


def delete_todo(request, id):
    todo = next((todo for todo in todos if todo['id'] == id), None)
    if todo is not None:
        return render(request, "tasks/delete.html", {"todo": todo})
    return redirect("tasks:index")