from rest_framework import serializers, viewsets
from rest_framework.fields import SerializerMethodField

from LemurAptana.LemurApp.api.book import BookSerializer
from LemurAptana.LemurApp.api.inmate import InmateSerializer
from LemurAptana.LemurApp.models import Order


class OrderSerializer(serializers.ModelSerializer):
  books = BookSerializer(many=True, read_only=True)
  inmate = InmateSerializer(many=False, read_only=True)
  warnings = SerializerMethodField()

  def get_warnings(self, order):
    return order.warnings()

  class Meta:
    model = Order
    fields = '__all__'


class OrderViewSet(viewsets.ModelViewSet):
  queryset = Order.objects.all()
  serializer_class = OrderSerializer

  def update(self, request, *args, **kwargs):
    sup = super(OrderViewSet, self).update(request, *args, **kwargs)
    # hax
    instance = self.get_object()
    if instance.status == 'SENT':
      request.session['order'] = None

    return sup
