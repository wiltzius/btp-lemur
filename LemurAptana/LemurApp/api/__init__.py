from rest_framework import routers

from LemurAptana.LemurApp.api.book import BookViewSet
from LemurAptana.LemurApp.api.csv import BookCSVViewSet, FacilityCSVViewSet, OrderCSVViewSet, InmateCSVViewSet
from LemurAptana.LemurApp.api.facility import FacilityViewSet
from LemurAptana.LemurApp.api.inmate import InmateViewSet
from LemurAptana.LemurApp.api.order import OrderViewSet

router = routers.DefaultRouter()
router.register(r'inmates', InmateViewSet)
router.register(r'facilities', FacilityViewSet)
router.register(r'orders', OrderViewSet)

# data export routes
router.register(r'inmates_csv', InmateCSVViewSet)
router.register(r'books_csv', BookCSVViewSet)
router.register(r'facilities_csv', FacilityCSVViewSet)
router.register(r'orders_csv', OrderCSVViewSet)
