from server.LemurApp.api.facility import FacilityViewSet
from server.LemurApp.api.inmate import InmateViewSet
from server.LemurApp.api.order import OrderViewSet
from rest_framework import routers


def configure_router():
    router = routers.SimpleRouter()
    router.register(r'inmate', InmateViewSet)
    router.register(r'facility', FacilityViewSet)
    router.register(r'order', OrderViewSet)
    return router
