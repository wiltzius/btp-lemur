from rest_framework import serializers, viewsets

from LemurAptana.LemurApp.models import Facility


class FacilitySerializer(serializers.ModelSerializer):
  class Meta:
    model = Facility
    # fields = ('url', 'name', 'restrictsHardbacks', 'order', 'address', 'creation_date')
    fields = '__all__'


class FacilityViewSet(viewsets.ModelViewSet):
  queryset = Facility.objects.all()
  serializer_class = FacilitySerializer