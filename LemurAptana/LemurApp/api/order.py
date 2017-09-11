from rest_framework import serializers, viewsets

from LemurAptana.LemurApp.models import Order


class OrderSerializer(serializers.ModelSerializer):
  class Meta:
    model = Order
    fields = '__all__'


class OrderViewSet(viewsets.ModelViewSet):
  queryset = Order.objects.all()
  serializer_class = OrderSerializer
