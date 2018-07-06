from rest_framework_csv.renderers import CSVRenderer

from LemurAptana.LemurApp.api import InmateViewSet, OrderViewSet, BookViewSet, FacilityViewSet


class InmateCSVViewSet(InmateViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None


class OrderCSVViewSet(OrderViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None


class BookCSVViewSet(BookViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None


class FacilityCSVViewSet(FacilityViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None
