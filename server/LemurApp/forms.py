from django import forms
from models.inmate import Inmate
from models.order import Order
from server.LemurApp.models.book import Book


class InmateForm(forms.ModelForm):
    # TODO I don't like this hack at all, it should be specified within the InmateIDField or Inmate model somehow
    inmate_id = forms.CharField(required=False)

    class Meta:
        model = Inmate
        fields = '__all__'


class BookForm(forms.ModelForm):

    class Meta:
        model = Book
        fields = '__all__'


class SendOutForm(forms.ModelForm):

    class Meta:
        model = Order
        fields = ['sender']
