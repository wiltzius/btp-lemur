from server.LemurApp.models.facility import Facility
from rest_framework_json_api import serializers
from rest_framework import viewsets


class FacilitySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Facility
        fields = ('pk', 'name', 'restrictsHardbacks', 'otherRestrictions')


class FacilityViewSet(viewsets.ModelViewSet):
    queryset = Facility.objects.all()
    serializer_class = FacilitySerializer
