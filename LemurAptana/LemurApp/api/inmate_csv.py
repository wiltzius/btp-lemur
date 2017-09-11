from rest_framework_csv.renderers import CSVRenderer

from LemurAptana.LemurApp.api import InmateViewSet
from LemurAptana.LemurApp.api.facility import FacilitySerializer
from LemurAptana.LemurApp.api.inmate import InmateSerializer


class InmateCSVSerializer(InmateSerializer):
  facility = FacilitySerializer()


class InmateCSVViewSet(InmateViewSet):
  renderer_classes = (CSVRenderer,)
  pagination_class = None
  serializer_class = InmateCSVSerializer
