import django_filters
from drf_queryfields import QueryFieldsMixin
from rest_framework import serializers, viewsets
from rest_framework.filters import DjangoFilterBackend

from LemurAptana.LemurApp.api.facility import FacilitySerializer
from LemurAptana.LemurApp.models import Inmate, Facility


class InmateSerializer(serializers.ModelSerializer, QueryFieldsMixin):
  facility = FacilitySerializer(read_only=True)
  facility_id = serializers.PrimaryKeyRelatedField(queryset=Facility.objects.all(), source='facility')

  class Meta:
    model = Inmate
    fields = ['id',
              'inmate_id',
              'inmate_doc_id',
              'inmate_type',
              'inmate_id_formatted',
              'first_name',
              'last_name',
              'full_name',
              'address',
              'facility',
              'facility_id',
              # 'orders',
              'creation_date',
              'warnings']


class InmateSearchFilter(django_filters.FilterSet):
  class Meta:
    model = Inmate
    fields = {
      'first_name': ['icontains'],
      'last_name': ['icontains'],
      'inmate_id': ['iexact']
    }


class InmateViewSet(viewsets.ModelViewSet):
  queryset = Inmate.objects.all()
  serializer_class = InmateSerializer
  filter_backends = (DjangoFilterBackend,)
  filter_class = InmateSearchFilter
