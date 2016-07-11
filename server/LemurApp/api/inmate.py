import django_filters
from rest_framework import filters
from rest_framework import serializers
from rest_framework import viewsets

from server.LemurApp.models.inmate import Inmate


class InmateSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Inmate
        fields = ('pk', 'inmate_id', 'inmate_doc_id', 'first_name', 'last_name', 'creation_date', 'facility')


class InmateFilter(filters.FilterSet):
    first_name = django_filters.CharFilter(name='first_name', lookup_expr='icontains')

    class Meta:
        model = Inmate
        fields = {
            'inmate_id': ['exact'],
            # 'first_name': ['icontains'],
            'last_name': ['icontains']
        }


class InmateViewSet(viewsets.ModelViewSet):
    queryset = Inmate.objects.all()
    serializer_class = InmateSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_class = InmateFilter
