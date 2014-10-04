from django.conf.urls import *
from models import Inmate, Order
import forms
from views import OrderList, OrderDetail 

inmate_add = {'form_class': forms.InmateForm, 'template_name': 'LemurAptana/LemurApp/inmate_add.html'}
inmate_edit = {'form_class': forms.InmateForm, 'template_name': 'LemurAptana/LemurApp/inmate_edit.html'}
order_detail = {'queryset': Order.objects.all(), 'template_object_name': 'order' }
order_list = {'queryset': Order.objects.filter(status__exact='OPEN'), 'template_object_name': 'order'}  # generic view dictionary to show all open orders

# Lemur-specific views
urlpatterns = patterns('LemurAptana.LemurApp.views',
    url(r'^$', 'inmate_search', name='index'),
    url(r'^inmate/search/$', 'inmate_search', name='inmate-search'),
    url(r'^inmate/search/(?P<object_id>\d+)/$', 'inmate_search', name='inmate-detail'),
    url(r'^inmate/add/searched/$', 'inmate_add_searched', name='inmate-add-searched'),
    url(r'^order/build/$', 'order_build', name='order-build'),
    url(r'^order/create/(?P<inmate_pk>\d+)/$', 'order_create', name='order-create'),
    url(r'^order/addbook/ASIN/$', 'order_add_book_asin', name='order-add-book-ASIN'),
    url(r'^order/addbook/ISBN/$', 'order_add_book_isbn', name='order-add-book-ISBN'),
    url(r'^order/addbook/custom/$', 'order_add_book_custom', name='order-add-book-custom'),
    url(r'^order/removebook/(?P<book_pk>\d+)/$', 'order_remove_book', name='order-book-remove'),
    url(r'^order/sendout/$', 'order_send_out', name='order-send-out'),
    url(r'^order/unset/$', 'order_unset', name='order-unset'),
    url(r'^order/set/(?P<order_pk>\d+)/$', 'order_set', name='order-set'),
    url(r'^order/reopen/(?P<order_pk>\d+)/$', 'order_reopen', name='order-reopen'),
    #url(r'^order/cleanup/$', 'order_cleanup', name='order-cleanup')
)

# Generic views
urlpatterns += patterns('django.views.generic',
    url(r'^inmate/add/$', 'create_update.create_object', inmate_add, name="inmate-add"),
    url(r'^inmate/edit/(?P<object_id>\d+)/$', 'create_update.update_object', inmate_edit, name="inmate-edit"),
    url(r'^order/list/$', OrderList.as_view(), order_list, name="order-list"),
    url(r'^order/detail/(?P<object_id>\d+)/$', OrderDetail.as_view(), order_detail, name="order-detail"),
)
