from django import forms
from .models import University, Listing, Images, Category

def universities():
    unis = [('','Select a university')]
    unis += University.objects.values_list('id','name').order_by('name').filter(is_deleted=False)

    return unis

def categories():
    category = [('', 'Select a category')]
    category += Category.objects.values_list('id', 'name').order_by('name').filter(is_deleted=False)

    return category

def category_exists(category_id):
    count = Category.objects.filter(id=category_id).count()
    return count == 1

def university_exists(university_id):
    count = University.objects.filter(id=university_id).count()
    return count == 1

class ListingSearch(forms.Form):

    def __init__(self, *args, **kwargs):
        super(ListingSearch, self).__init__(*args, **kwargs)
        self.fields['university'] = forms.TypedChoiceField(choices=universities(), required=False, coerce=int, empty_value=None)
        self.fields['university'].widget.attrs.update({'class':'form-control'})

        self.fields['category'] = forms.TypedChoiceField(choices=categories(), required=False, coerce=int, empty_value=None)
        self.fields['category'].widget.attrs.update({'class':'form-control'})
    
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
    show_advance_filters = False

    title.widget.attrs.update({'class':'form-control', 'placeholder': 'Title or description'})
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


class CreateListing(forms.ModelForm):
    
    def __init__(self, *args, **kwargs):
        super(CreateListing, self).__init__(*args, **kwargs)
        self.fields['university'] = forms.TypedChoiceField(choices=universities(), required=True, coerce=int, empty_value=None)
        self.fields['university'].widget.attrs.update({'class':'form-control'})

        self.fields['category'] = forms.TypedChoiceField(choices=categories(), required=True, coerce=int, empty_value=None)
        self.fields['category'].widget.attrs.update({'class':'form-control'})

    title = forms.CharField(min_length=2, required=True, label="Title")
    description = forms.CharField(widget=forms.Textarea())
    price = forms.DecimalField(decimal_places=2, min_value=0, required=True)
    
    images = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)

    LISTING_TYPE = [('1','Buy it now'),('2','Auction'),('3','Freebie')]
    listing_type = forms.ChoiceField(choices=LISTING_TYPE, required=True)

    is_free = forms.BooleanField(widget=forms.HiddenInput(), required=False)
    is_biddable = forms.BooleanField(widget=forms.HiddenInput(), required=False)

    title.widget.attrs.update({'class':'form-control'})
    description.widget.attrs.update({'class':'form-control', 'rows': '2'})
    price.widget.attrs.update({'class':'form-control'})
    listing_type.widget.attrs.update({'class':'form-control'})
    images.widget.attrs.update({'class':'custom-file-input'})

    def clean_is_free(self): 
        data = self.cleaned_data['listing_type']
        return data is '3'

    def clean_is_biddable(self):
        data = self.cleaned_data['listing_type']
        return data is '2'

    class Meta:
        model = Listing
        fields = ('title', 'description', 'price', 'images', 'listing_type', 'is_biddable', 'is_free')




