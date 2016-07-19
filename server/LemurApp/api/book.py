from server.LemurApp.models.book import Book
from rest_framework_json_api import serializers
from rest_framework import viewsets


class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ('pk', 'asin', 'title', 'author', 'order', 'creation_date')


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
