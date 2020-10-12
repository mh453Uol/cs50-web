from django import forms


class ListingSearch(forms.Form):
    RADIUS = (
        ('1', '1 mile'),
        ('2', '2 miles'),
        ('3', '3 miles'),
        ('5', '5 miles'),
        ('10', '10 miles'),
        ('15', '15 miles'),
        ('20', '20 miles'),
        ('25', '25 miles'),
    )

    DEFAULT_RADIUS = '1'

    SORT_ORDER = (
        ('1', 'Listed date'),
        ('2', 'Low to high'),
        ('3', 'High to low'),
    )

    DEFAULT_SORT_ORDER = '3'

    title = forms.CharField(min_length=2, required=True)
    latitude = forms.CharField(required=True)
    longitude = forms.CharField(required=True)
    radius = forms.TypedChoiceField(choices=RADIUS, coerce=str, empty_value=DEFAULT_RADIUS, initial=DEFAULT_RADIUS)
    sort_order = forms.TypedChoiceField(choices=SORT_ORDER, coerce=str, empty_value=DEFAULT_SORT_ORDER, initial=DEFAULT_SORT_ORDER)
    
    # if False we hide the radius, sort_order
    show_advance_filters = True