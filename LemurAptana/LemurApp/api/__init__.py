from LemurAptana.LemurApp.api.facility import FacilityViewSet
from LemurAptana.LemurApp.api.inmate import InmateViewSet
from LemurAptana.LemurApp.api.order import OrderViewSet
from rest_framework import routers


def configure_router():
    router = routers.SimpleRouter()
    router.register(r'inmate', InmateViewSet)
    router.register(r'facility', FacilityViewSet)
    router.register(r'order', OrderViewSet)
    return router
