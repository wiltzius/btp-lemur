from rest_framework import serializers, viewsets

from LemurAptana.LemurApp.api.lib.pagination import LargeResultsSetPagination
from LemurAptana.LemurApp.models import Facility


class FacilitySerializer(serializers.ModelSerializer):
  class Meta:
    model = Facility
    fields = '__all__'


class FacilityViewSet(viewsets.ModelViewSet):
  queryset = Facility.objects.all()
  serializer_class = FacilitySerializer
  pagination_class = LargeResultsSetPagination
