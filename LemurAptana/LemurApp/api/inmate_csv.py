from rest_framework_csv.renderers import CSVRenderer

from LemurAptana.LemurApp.api import InmateViewSet


class InmateCSVViewSet(InmateViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None
