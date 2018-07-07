from rest_framework import routers

from LemurAptana.LemurApp.api.book import BookViewSet, BookCreateISBN
from LemurAptana.LemurApp.api.csv import InmateCSVViewSet
from LemurAptana.LemurApp.api.facility import FacilityViewSet
from LemurAptana.LemurApp.api.inmate import InmateViewSet
from LemurAptana.LemurApp.api.order import OrderViewSet

router = routers.DefaultRouter()
router.register(r'inmates', InmateViewSet)
router.register(r'inmates_csv', InmateCSVViewSet)
router.register(r'facilities', FacilityViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'books', BookViewSet)
router.register(r'book_create_isbn', BookCreateISBN)
