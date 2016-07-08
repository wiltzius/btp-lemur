from LemurAptana.LemurApp.models.inmate import Inmate
from rest_framework import serializers
from rest_framework.generics import RetrieveUpdateAPIView


class InmateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inmate
        fields = ('url', 'username', 'email', 'groups')


class InmateViewSet(RetrieveUpdateAPIView):
    queryset = Inmate.objects.all()
    serializer_class = InmateSerializer
