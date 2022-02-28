from rest_framework import serializers, viewsets

from ..models import Book


class BookSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = '__all__'


class BookViewSet(viewsets.ModelViewSet):
  queryset = Book.objects.all()
  serializer_class = BookSerializer
