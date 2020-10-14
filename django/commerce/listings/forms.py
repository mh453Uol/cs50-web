from django import forms
from .models import University


class ListingSearch(forms.Form):
    SORT_ORDER = (
        ('1', 'Listed date'),
        ('2', 'Low to high'),
        ('3', 'High to low'),
    )

    DEFAULT_SORT_ORDER = '3'

    sort_order = forms.TypedChoiceField(choices=SORT_ORDER, coerce=str, empty_value=DEFAULT_SORT_ORDER, initial=DEFAULT_SORT_ORDER)
    title = forms.CharField(min_length=2, required=True, label="Title")
    university = forms.ModelChoiceField(queryset=University.objects.order_by('name').filter(is_deleted=False))
    
    # if False we hide the sort_order
    show_advance_filters = True

    title.widget.attrs.update({'class':'form-control', 'placeholder': 'Title, Author, Keyword or ISBN'})
    university.widget.attrs.update({'class':'form-control'})
    sort_order.widget.attrs.update({'class':'form-control'})