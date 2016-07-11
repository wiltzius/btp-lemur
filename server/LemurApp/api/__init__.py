from rest_framework import routers

from server.LemurApp.api.facility import FacilityViewSet
from server.LemurApp.api.inmate import InmateViewSet
from server.LemurApp.api.order import OrderViewSet
from server.LemurApp.api.settings_store import SettingsStoreViewSet


def configure_router():
    router = routers.SimpleRouter()
    router.register(r'inmate', InmateViewSet)
    router.register(r'facility', FacilityViewSet)
    router.register(r'order', OrderViewSet)
    router.register(r'settings_store', SettingsStoreViewSet)
    return router
