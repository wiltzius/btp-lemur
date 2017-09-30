from rest_framework import serializers, viewsets

from LemurAptana.LemurApp.models import Order, Book


class BookSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = '__all__'
