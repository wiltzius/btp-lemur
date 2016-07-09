from LemurAptana.LemurApp.models.order import Order
from rest_framework import serializers
from rest_framework import viewsets


class OrderSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Order
        fields = ('pk', 'status', 'inmate', 'date_opened', 'date_closed', 'sender')


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
