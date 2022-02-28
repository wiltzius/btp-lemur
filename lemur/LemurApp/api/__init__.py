from rest_framework import routers

from .book import BookViewSet
from .csv import BookCSVViewSet, FacilityCSVViewSet, OrderCSVViewSet, InmateCSVViewSet
from .facility import FacilityViewSet
from .inmate import InmateViewSet
from .order import OrderViewSet

router = routers.DefaultRouter()
router.register(r'inmates', InmateViewSet)
router.register(r'facilities', FacilityViewSet)
router.register(r'orders', OrderViewSet)

# data export routes
router.register(r'inmates_csv', InmateCSVViewSet)
router.register(r'books_csv', BookCSVViewSet)
router.register(r'facilities_csv', FacilityCSVViewSet)
router.register(r'orders_csv', OrderCSVViewSet)
