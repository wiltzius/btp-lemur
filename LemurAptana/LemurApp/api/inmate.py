from rest_framework import serializers, viewsets
from rest_framework.filters import SearchFilter

from LemurAptana.LemurApp.models import Inmate


class InmateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Inmate
    fields = ['id',
              'inmate_id',
              # 'inmate_doc_id',
              'first_name',
              'last_name',
              'full_name',
              'address',
              'facility',
              'creation_date',
              'warnings']


class InmateViewSet(viewsets.ModelViewSet):
  queryset = Inmate.objects.all()
  serializer_class = InmateSerializer
  filter_backends = (SearchFilter,)
  search_fields = ['first_name', 'last_name', 'inmate_id']
