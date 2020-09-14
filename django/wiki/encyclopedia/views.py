from django.shortcuts import render, Http404

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def details(request, wiki_title):
    exists = util.get_entry(wiki_title)

    if exists is not None:
        return render(request, "encyclopedia/details.html", {
            "wiki": exists,
            "wiki_title": wiki_title
        })

    raise Http404()

