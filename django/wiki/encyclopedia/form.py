from django import forms

class WikiForm(forms.Form):
    title = forms.CharField(
        min_length=2, 
        max_length=255,
        widget=forms.TextInput(attrs={
            'class': 'form-control',
            'placeholder': 'Wiki name e.g. HTML5'
        })
    )
    body = forms.CharField(
        min_length=10,
        max_length=5000,
        widget=forms.Textarea(attrs={
            'class': 'form-control',
            'rows': '10',
            'placeholder': "It's very easy to make some words **bold** and other words *italic* with Markdown. You can even [link to Google!](http://google.com)"
        })
    )