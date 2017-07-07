#!/usr/bin/env python

# Preliminary Django settings import
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LemurAptana.settings')
import django

django.setup()

import datetime

from LemurAptana.LemurApp import models


def cleanup_orders():
  """Marks all crrently open orders as sent, unless they have no books in which case they're deleted."""
  for order in models.Order.objects.filter(status__exact='OPEN'):
    # Mark orders with books as sent
    if order.books.count():
      print('Cleaning up', order)
      order.status = 'SENT'
      order.date_closed = datetime.datetime.now()
      order.save()
    # Delete orders without books
    else:
      print('Deleting', order)
      order.delete()
      pass
  print('Done looking at open orders!')


if __name__ == '__main__':
  print('Executing order cleanup script')
  cleanup_orders()
