from rest_framework_csv.renderers import CSVRenderer, serializers

from .book import BookViewSet
from .facility import FacilityViewSet
from .inmate import InmateViewSet
from .order import OrderViewSet
from ..models import Order


class InmateCSVViewSet(InmateViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None


class OrderSerializerCSV(serializers.ModelSerializer):
  class Meta:
    model = Order
    fields = '__all__'


class OrderCSVViewSet(OrderViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None
  serializer_class = OrderSerializerCSV


class BookCSVViewSet(BookViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None


class FacilityCSVViewSet(FacilityViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None
