from rest_framework import routers

from LemurAptana.LemurApp.api.facility import FacilityViewSet
from LemurAptana.LemurApp.api.inmate import InmateViewSet

router = routers.DefaultRouter()
router.register(r'inmates', InmateViewSet)
router.register(r'facilities', FacilityViewSet)
