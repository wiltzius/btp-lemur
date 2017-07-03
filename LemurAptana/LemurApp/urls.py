from . import generic_views
from django.conf.urls import *

# Lemur-specific views
urlpatterns = patterns(
  'LemurAptana.LemurApp.views',
  url(r'^$', 'inmate.inmate_search', name='index'),
  url(r'^inmate/search/$', 'inmate.inmate_search', name='inmate-search'),
  url(r'^inmate/search/(?P<pk>\d+)/$', 'inmate.inmate_search', name='inmate-detail'),
  url(r'^inmate/add/searched/$', 'inmate.inmate_add_searched', name='inmate-add-searched'),
  url(r'^inmate_search_proxy/(?P<pk>\d+)/$', 'inmate.inmate_search_proxy', name='inmate-search-proxy'),
  url(r'^order/build/$', 'order.order_build', name='order-build'),
  url(r'^order/create/(?P<inmate_pk>\d+)/$', 'order.order_create', name='order-create'),
  # url(r'^order/addbook/ASIN/$', 'order_add_book_asin', name='order-add-book-ASIN'),
  url(r'^order/addbook/ISBN/$', 'order.order_add_book_isbn', name='order-add-book-ISBN'),
  url(r'^order/addbook/custom/$', 'order.order_add_book_custom', name='order-add-book-custom'),
  url(r'^order/removebook/(?P<book_pk>\d+)/$',
      'order.order_remove_book', name='order-book-remove'),
  url(r'^order/sendout/$', 'order.order_send_out', name='order-send-out'),
  url(r'^order/unset/$', 'order.order_unset', name='order-unset'),
  url(r'^order/set/(?P<order_pk>\d+)/$', 'order.order_set', name='order-set'),
  url(r'^order/reopen/(?P<order_pk>\d+)/$', 'order.order_reopen', name='order-reopen'),
)

# Generic views
urlpatterns += patterns(
  '',
  url(r'^inmate/add/$', generic_views.InmateCreate.as_view(), name="inmate-add"),
  url(r'^inmate/edit/(?P<pk>\d+)/$', generic_views.InmateUpdate.as_view(), name="inmate-edit"),
  url(r'^order/list/$', generic_views.OrderList.as_view(), name="order-list"),
  url(r'^order/cleanup/$', generic_views.OrderCleanupList.as_view(), name='order-cleanup'),
  url(r'^order/detail/(?P<pk>\d+)/$', generic_views.OrderDetail.as_view(), name="order-detail"),
)
