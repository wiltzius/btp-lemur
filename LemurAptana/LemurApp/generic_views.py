from datetime import datetime

from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
from django.views.generic.list import ListView

from LemurAptana.LemurApp import forms
from LemurAptana.LemurApp.models import Inmate, Order
from LemurAptana.LemurApp.views.order import order_unset


class OrderList(ListView):
  model = Order
  context_object_name = 'order_list'
  queryset = Order.objects.filter(status__exact='OPEN')


class OrderDetail(DetailView):
  model = Order

  def render_to_response(self, context, **response_kwargs):
    print(context)
    return super(OrderDetail, self).render_to_response(context, **response_kwargs)


class OrderInvoice(DetailView):
  model = Order
  template_name = 'LemurApp/invoice.html'


class InmateCreate(CreateView):
  form_class = forms.InmateForm
  template_name = 'LemurApp/inmate_add.html'
  model = Inmate


class OrderCleanupList(OrderList):
  def get(self, request):
    """Marks all currently open orders as sent, unless they have no books in which case they're deleted."""
    for order in Order.objects.filter(status__exact='OPEN'):
      # Mark orders with books as sent
      if order.books.count():
        order.status = 'SENT'
        order.date_closed = datetime.now()
        order.save()
      # Delete orders without books
      else:
        order.delete()
    # Unset the current order
    order_unset(request)
    return super(OrderCleanupList, self).get(request)

  def get_context_data(self, **kwargs):
    # Call the base implementation first to get a context
    context = super(OrderCleanupList, self).get_context_data(**kwargs)
    context['cleaned'] = True
    return context
