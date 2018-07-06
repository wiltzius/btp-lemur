from rest_framework_csv.renderers import CSVRenderer, serializers

from LemurAptana.LemurApp.api.book import BookViewSet
from LemurAptana.LemurApp.api.facility import FacilityViewSet
from LemurAptana.LemurApp.api.inmate import InmateViewSet
from LemurAptana.LemurApp.api.order import OrderViewSet
from LemurAptana.LemurApp.models import Order


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
