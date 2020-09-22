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

        if q in lowercased:
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

            if util.has_entry(title) is False:
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


def edit(request, wiki_title):
    form = None

    exists = util.has_entry(wiki_title)
    wiki = { "title": "", "body": "" }
        
    if request.method == "GET":
        wiki["title"] = wiki_title
        wiki["body"] = util.get_entry(wiki_title)

        form = WikiForm(wiki)

        if exists is False:
            form.add_error(None, f"Wiki with title {wiki_title} does not exists")

    if request.method == "POST":
        form = WikiForm(request.POST)

        if form.is_valid():
            title = form.cleaned_data["title"]
            if title != wiki_title:
                # scenario in which you edit the title to another wiki title (two wikis having same name)
                if util.has_entry(title):
                    form.add_error(None, f"Wiki with title {title} already exist, try to consolidate the wikis together")
                else:
                    # scenarion where the title has changed we need to remove the old file and create it
                    util.remove_entry(wiki_title);
                    util.save_entry(title, form.cleaned_data["body"])
                    return redirect("wiki_details", wiki_title=title)
            else:
                util.save_entry(title, form.cleaned_data["body"])
                return redirect("wiki_details", wiki_title=title)

    return render(request, "encyclopedia/edit.html", {
        "form": form
    })