from rest_framework import serializers, viewsets
from rest_framework.fields import SerializerMethodField
import django_filters.rest_framework

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
  filter_backends = (django_filters.rest_framework.DjangoFilterBackend,)
  filter_fields = ('status', 'inmate')

  def update(self, request, *args, **kwargs):
    sup = super(OrderViewSet, self).update(request, *args, **kwargs)
    instance = self.get_object()
    if instance.status == 'SENT':
      print('removing from session')
      print(request.session.items())
      request.session['order'] = None
      print(request.session.items())

    return sup
