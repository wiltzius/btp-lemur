from server.LemurApp.models.settings_store import LemurSettingsStore
from rest_framework import serializers
from rest_framework import viewsets


class SettingsStoreSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = LemurSettingsStore
        fields = ('settingName', 'settingValue')


class SettingsStoreViewSet(viewsets.ModelViewSet):
    queryset = LemurSettingsStore.objects.all()
    serializer_class = SettingsStoreSerializer
