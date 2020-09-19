from django.shortcuts import render, Http404, redirect
from django.http import request

from markdown2 import Markdown

from . import util
from .form import WikiForm

markdown = Markdown()


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def details(request, wiki_title):
    exists = util.get_entry(wiki_title)

    if exists is not None:
        return render(request, "encyclopedia/details.html", {
            "wiki": markdown.convert(exists),
            "wiki_title": wiki_title
        })

    raise Http404()


def search(request):
    q = request.GET.get("q").lower()
    wikis = util.list_entries()
    like = []

    lowercased = ""

    for wiki in wikis:
        lowercased = str(wiki).casefold()
        if q == lowercased:
            return redirect("wiki_details", q)

        if q.lower() in str(wiki).casefold():
            like.append(wiki)

    return render(request, "encyclopedia/search-results.html", {
        "query": q,
        "entries": like
    })


def create(request):
    form = None
    
    if request.method == "POST":
        print(request.POST)

        form = WikiForm(request.POST)

        if form.is_valid():
            
            title = form.cleaned_data["title"]

            if util.get_entry(title) is not None:
                form.add_error("title", f"Wiki with title {title} already exists")
            else:
                # add document to disk
                util.save_entry(title,form.cleaned_data["body"])
                return redirect("wiki_details", wiki_title=title)
    else:
        form = WikiForm()

    return render(request, "encyclopedia/create.html", {
        "form": form
    })
