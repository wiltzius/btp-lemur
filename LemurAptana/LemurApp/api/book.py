from rest_framework import serializers, viewsets
from rest_framework.mixins import CreateModelMixin

from LemurAptana.LemurApp.lib import isbn
from LemurAptana.LemurApp.models import Book, Order


class BookSerializer(serializers.ModelSerializer):
  order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order', write_only=True)

  class Meta:
    model = Book
    fields = ['id', 'asin', 'title', 'author', 'order_id', 'creation_date']


class BookViewSet(viewsets.ModelViewSet):
  queryset = Book.objects.all()
  serializer_class = BookSerializer


class BookISBNSerializer(serializers.Serializer):
  asin = serializers.CharField()
  order_id = serializers.PrimaryKeyRelatedField(queryset=Order.objects.all(), source='order')

  class Meta:
    fields = ['asin', 'order_id']

  def create(self, validated_data):
    # todo raise validation error if the isbn is malformed -- ideally push into the asin field somehow
    book = Book.get_book(isbn.isbn_strip(validated_data['asin']))
    book.order = validated_data['order']
    book.save()
    return book


class BookCreateISBN(CreateModelMixin, viewsets.GenericViewSet):
  queryset = Book.objects.all()
  serializer_class = BookISBNSerializer
