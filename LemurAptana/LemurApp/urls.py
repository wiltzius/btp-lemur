from rest_framework.documentation import include_docs_urls
from rest_framework.schemas import get_schema_view

from LemurAptana.LemurApp.api import router
from . import generic_views
from django.conf.urls import *

# Lemur-specific views
urlpatterns = patterns(
  'LemurAptana.LemurApp.views',
  url(r'^$', 'inmate.inmate_search', name='index'),
  # url(r'^inmate/search/$', 'inmate.inmate_search', name='inmate-search'),
  # url(r'^inmate/search/(?P<pk>\d+)/$', 'inmate.inmate_search', name='inmate-detail'),
  url(r'^inmate/add/searched/$', 'inmate.inmate_add_searched', name='inmate-add-searched'),
  url(r'^inmate_search_proxy/(?P<pk>\d+)/$', 'inmate.inmate_search_proxy', name='inmate-search-proxy'),
  url(r'^inmate/doc_autocomplete/$', 'inmate.inmate_doc_autocomplete', name='inmate-search-autocomplete'),
  url(r'^order/build/$', 'order.order_build', name='order-build'),
  url(r'^order/booksearch/$', 'order.order_book_search', name='order-booksearch'),
  url(r'^order/create/(?P<inmate_pk>\d+)/$', 'order.order_create', name='order-create'),
  url(r'^order/addbook/ISBN/$', 'order.order_add_book_isbn', name='order-add-book-ISBN'),
  url(r'^order/addbook/custom/$', 'order.order_add_book_custom', name='order-add-book-custom'),
  url(r'^order/removebook/(?P<book_pk>\d+)/$',
      'order.order_remove_book', name='order-book-remove'),
  url(r'^order/sendout/$', 'order.order_send_out', name='order-send-out'),
  url(r'^order/unset/$', 'order.order_unset', name='order-unset'),
  url(r'^order/set/(?P<order_pk>\d+)/$', 'order.order_set', name='order-set'),
  url(r'^order/reopen/(?P<order_pk>\d+)/$', 'order.order_reopen', name='order-reopen'),
  url(r'^order/current/$', 'order.order_current', name='order-current'),
)

# Generic views
urlpatterns += patterns(
  '',
  url(r'^inmate/add/$', generic_views.InmateCreate.as_view(), name="inmate-add"),
  url(r'^order/list/$', generic_views.OrderList.as_view(), name="order-oldlist"),
  url(r'^order/cleanup/$', generic_views.OrderCleanupList.as_view(), name='order-cleanup'),
  url(r'^order/detail/(?P<pk>\d+)/$', generic_views.OrderDetail.as_view(), name="order-detail"),
  url(r'^order/invoice/(?P<pk>\d+)/$', generic_views.OrderInvoice.as_view(), name="order-invoice"),
)

# API views
urlpatterns += [
  url(r'^api/', include(router.urls, namespace="lemurapi")),
  url(r'^schema/$', get_schema_view(title='BTP API')),
  url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
  url(r'^docs/', include_docs_urls(title='My API service'))
]

# default catch-all route
# TODO get rid of all the routes that used to search specific HTML pages
urlpatterns += patterns(
  'LemurAptana.LemurApp.views',
  url(r'^.*$', 'inmate.inmate_search', name='order-current'),
)
