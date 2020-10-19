from django import forms
from .models import University, Listing

def universities():
    unis = [('','Select a university')]
    unis += University.objects.values_list('id','name').order_by('name').filter(is_deleted=False)

    return unis
    
class ListingSearch(forms.Form):

    def __init__(self, *args, **kwargs):
        super(ListingSearch, self).__init__(*args, **kwargs)
        self.fields['university'] = forms.ChoiceField(choices=universities(), required=True)
        self.fields['university'].widget.attrs.update({'class':'form-control'})
    
    def get_sort_order_field(self, sort_order_id):
        if sort_order_id == '1':
            return '-created_on'
        elif sort_order_id == '2':
            return 'price'
        elif sort_order_id == '3':
            return '-price'
        else: 
            return 'created_on'

    SORT_ORDER = (
        ('1', 'Posted date'),
        ('2', 'Low to high'),
        ('3', 'High to low'),
    )

    DEFAULT_SORT_ORDER = '1'

    sort_order = forms.TypedChoiceField(choices=SORT_ORDER, coerce=str, empty_value=DEFAULT_SORT_ORDER, initial=DEFAULT_SORT_ORDER)
    
    title = forms.CharField(min_length=2, required=True, label="Title")
    
    # if False we hide the sort_order
    show_advance_filters = True

    title.widget.attrs.update({'class':'form-control', 'placeholder': 'Title, Author, Keyword or ISBN'})
    sort_order.widget.attrs.update({'class':'form-control'})

class AuctionForm(forms.Form):

    def __init__(self, starting_value, *args, **kwargs):
        super(AuctionForm, self).__init__(*args, **kwargs)
        
        if starting_value is not None and 'value' in starting_value:
            value = starting_value['value']

            self.fields['bid'] = forms.DecimalField(min_value=value, initial=value, decimal_places=2, required=True)
            self.fields['bid'].widget.attrs.update({'class':'form-control', 'placeholder': f'Place a bid greater than {value}'})

    bid = forms.DecimalField(decimal_places=2, required=True)
    highestBidId = forms.IntegerField(widget=forms.HiddenInput())


