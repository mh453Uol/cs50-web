from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from django import forms
import uuid

class NewTodoForm(forms.Form):
    name = forms.CharField(label="Todo", min_length=4)

def get_todos(request):
    if "todos" not in request.session:
        request.session["todos"] = []
    
    return request.session["todos"]

def index(request):
    if "todos" not in request.session:
        request.session["todos"] = []
    
    return render(request, "tasks/index.html", { 
        "tasks": request.session["todos"],
        "form": NewTodoForm()
    });

@require_http_methods(["POST"])
def add_todo(request):
    form = NewTodoForm(request.POST)

    if form.is_valid():
        request.session["todos"] += [{ "id": str(uuid.uuid4()), "name": form.cleaned_data["name"] }]
    else:
        return render(request, "tasks/index.html", { 
        "tasks": get_todos(request),
        "form": form
    })

    return redirect("tasks:index")

def edit_todo(request, id):
    todo = next((todo for todo in get_todos(request) if todo['id'] == str(id)), None)
    print(todo)
    if request.method == 'GET':
        form = NewTodoForm(todo)
    
        if todo is not None:
            return render(request, "tasks/edit.html", {
                "todo": todo,
                "form": form
            })
        return redirect("tasks:index")

    if request.method == 'POST':
        form = NewTodoForm(request.POST)
    
        if todo is not None and form.is_valid():
            todo['name'] = form.cleaned_data["name"]
            return redirect("tasks:index")
        else:
            return render(request, "tasks/edit.html", {
                "todo": todo,
                "form": form
            })


def delete_todo(request, id):
    todo = next((todo for todo in get_todos(request) if todo['id'] == str(id)), None)
    
    if request.method == 'GET':
        form = NewTodoForm(todo)
        
        if todo is not None:
            return render(request, "tasks/delete.html", {
                "todo": todo,
                "form": form
            })
        return redirect("tasks:index")
