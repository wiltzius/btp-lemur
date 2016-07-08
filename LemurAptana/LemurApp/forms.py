from django import forms
from models import inmate, InmateIDField, Order
from LemurAptana.LemurApp.models.Book import Book


class InmateForm(forms.ModelForm):
    inmate_id = forms.CharField(required=False)     # TODO I don't like this hack at all, it should be specified within the InmateIDField or Inmate model somehow

    class Meta:
        model = inmate
        fields = '__all__'


class BookForm(forms.ModelForm):

    class Meta:
        model = Book
        fields = '__all__'


class SendOutForm(forms.ModelForm):

    class Meta:
        model = Order
        fields = ['sender']
