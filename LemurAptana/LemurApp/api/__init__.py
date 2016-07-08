from LemurAptana.LemurApp.api.inmate import InmateViewSet
from rest_framework import routers


def configure_router():
    router = routers.SimpleRouter()
    router.register(r'inmateadd', InmateViewSet)
    return router
