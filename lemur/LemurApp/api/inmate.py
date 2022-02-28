from rest_framework import serializers, viewsets

from ..models import Inmate


class InmateSerializer(serializers.ModelSerializer):
  class Meta:
    model = Inmate
    fields = '__all__'


class InmateViewSet(viewsets.ModelViewSet):
  queryset = Inmate.objects.all()
  serializer_class = InmateSerializer
