from server.LemurApp.api.book import BookSerializer
from server.LemurApp.models.order import Order
from rest_framework_json_api import serializers
from rest_framework import viewsets


class OrderSerializerWithBooks(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ('pk', 'status', 'inmate', 'date_opened', 'date_closed', 'sender', 'book_set')

    included_serializers = {
        'book_set': BookSerializer
    }


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializerWithBooks
