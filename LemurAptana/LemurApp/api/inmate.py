from LemurAptana.LemurApp.models.inmate import Inmate
from rest_framework import serializers
from rest_framework import viewsets


class InmateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inmate
        fields = ('inmate_id', 'inmate_doc_id', 'first_name', 'last_name', 'creation_date', 'facility')


class InmateViewSet(viewsets.ModelViewSet):
    queryset = Inmate.objects.all()
    serializer_class = InmateSerializer
