from django.shortcuts import render, Http404, redirect
from markdown2 import Markdown

from . import util

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
    wikis = util.list_entries();
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