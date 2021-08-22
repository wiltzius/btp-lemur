import datetime

from django.core.exceptions import ValidationError
from django.db import models

from LemurAptana.LemurApp.models import Book
from LemurAptana.LemurApp.models import Inmate
# relative import since this hasn't been declared in models/__init__.py yet
from .settings_store import LemurSettingsStore


class Order(models.Model):
  """Orders, which are collections of books"""

  ORDER_STATUS = (
    ('SENT', 'Sent'),
    ('OPEN', 'Open'),
    ('RETURNED', 'Returned')
  )

  # actual fields
  status = models.CharField(max_length=20, choices=ORDER_STATUS, default='OPEN', verbose_name="Order status")
  inmate = models.ForeignKey(Inmate, verbose_name="Inmate", related_name="orders", on_delete=models.CASCADE)
  date_opened = models.DateTimeField(default=datetime.datetime.now, editable=False, verbose_name="Date opened")
  date_closed = models.DateTimeField(blank=True, null=True, verbose_name="Date closed")
  sender = models.CharField(max_length=250, null=True, blank=True, verbose_name="Sender")
  notes = models.CharField(max_length=2048, blank=True, default='', null=False, verbose_name='Notes')

  # end fields

  def __str__(self):
    return 'Order #' + str(self.pk)

#   @models.permalink
  def get_absolute_url(self):
    return reverse('order-detail', args={'pk': self.pk})
#     return 'order-detail', (), {'pk': self.pk}

  def save(self, *args, **kwargs):
    """Override the normal save method to make sure we validate before
       saving into the database"""
    self.full_clean()  # validate the model
    super(Order, self).save(*args, **kwargs)  # Call the "real" save() method.

  def clean(self):
    """Ensures the order model is consistent by doing some basic sanity
       checks. Checks that open orders have no close date but closed orders
       do, and that closing dates are later than opening dates."""
    if self.status == 'OPEN':
      if self.date_closed:
        raise ValidationError('Open orders should not have closed dates!')
    elif self.status == 'SENT':
      if not self.date_closed:
        raise ValidationError('Sent orders need closed dates, and this order [%s] lacks one!' % self)
      else:
        # order is sent and has a closed date, so make sure the closed date is after the open date
        if self.date_closed < self.date_opened:
          raise ValidationError('Closed date for this order is before its open date!')

  def warnings(self):
    """ Return a list of text warnings associated with this order

    (e.g. if this inmate's recently received another similar order, etc. """
    try:
      warnings = list()
      # if the inmate associated with this order has had an order within the order warning age, add a warning
      recent_orders = (self.inmate.orders
                       .filter(status__exact='SENT')
                       .filter(date_closed__gte=(datetime.date.today() -
                                                 datetime.timedelta(LemurSettingsStore.order_age_warning() * 30)))
                       .exclude(pk=self.pk)
                       .order_by('-date_closed'))
      if recent_orders.count():
        warnings += ["Patron received an order less than %s months ago" % LemurSettingsStore.order_age_warning()]
      # if the inmate associated with this order has gotten a similar book before, add a warning
      for book in self.books.all():
        # That is to say: for all books, select those in a sent-out order that went to this inmate, and then
        # subselect the books with titles like the title of a book in this order
        similar_books = Book.objects.filter(order__status='SENT') \
          .filter(order__inmate=self.inmate) \
          .filter(title__icontains=book.title) \
          .exclude(order__pk=self.pk)
        if similar_books.count():
          warnings += ["Patron already received %s on %s" %
                       (similar_books[0].title, similar_books[0].order.date_closed.strftime("%b %d, %Y"))]
      # if the inmate's facility restricts hardbacks, add a warning
      if self.inmate.facility.restrictsHardbacks:
        warnings += ["Shipping to %s, which does not allow hardbacks!" % self.inmate.facility]
      # if the facility has any other restrictions, add those too
      if self.inmate.facility.otherRestrictions:
        warnings += ["%s restriction: %s" % (self.inmate.facility, self.inmate.facility.otherRestrictions)]
      # if there are two books of the same name in an order, warn
      duplicate_warning = False
      for book1 in self.books.all():
        for book2 in self.books.all():
          if (not book1 == book2) and book1.title == book2.title:
            duplicate_warning = True
      if duplicate_warning:
        warnings += ["Two books in this order have the same title"]
      return warnings
    except Exception as e:
      print(e)
      return []