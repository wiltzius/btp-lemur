import django_filters
from rest_framework import filters
from rest_framework import viewsets
from rest_framework_json_api import serializers

from server.LemurApp.api.facility import FacilitySerializer
from server.LemurApp.api.order import OrderSerializerWithBooks
from server.LemurApp.models.inmate import Inmate


class InmateSerializer(serializers.ModelSerializer):
    # facility = FacilitySerializer()
    order_set = OrderSerializerWithBooks(many=True)

    class Meta:
        model = Inmate
        fields = ('pk', 'inmate_id', 'inmate_doc_id', 'first_name', 'last_name', 'full_name', 'creation_date',
                  'facility', 'order_set')

    included_serializers = {
        'facility': FacilitySerializer,
        'order_set': OrderSerializerWithBooks
    }


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


