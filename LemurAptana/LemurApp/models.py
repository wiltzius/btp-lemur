from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
import amazonproduct
import string
import datetime
import lib.isbn as isbn


class BannerMessage(models.Model):
    """Special model for the banner message. There should only ever be 1 record here, but we put it in the
    database to allow it to be easily edited trough the admin interface
    
    Therefore, access the banner message through the special "handle" field, set to 1 --
    
    message = BannerMessage.get(handle__exact=1)
    
    ... or better yet use the shortcut method BannerMessage.get_message() below.
     
    """
    message = models.CharField(max_length=250, unique=True)
    handle = models.IntegerField(unique=True, verbose_name="Handle (leave this as 1!)")   # this should be set to 1 for the banner message entry row
    
    def __unicode__(self):
        return self.message
    
    @staticmethod
    def get_message():
        return BannerMessage.objects.get(handle__exact=1)


class FacilityManager(models.Manager):
    def get_queryset(self):
        """We have complicated ordering requirements (all facilities alphabetically,
           followed by the "non-facility" facility) so this function returns the
           list we want in the order we want, as a normal queryset"""
        # get the normal queryset, then additionally select a true/false column `non-facility`, then order first by this then by the facility name
        return super(FacilityManager, self).get_queryset() \
                    .extra(select={'non-facility': 'id=1'}) \
                    .extra(order_by=['non-facility', 'name'])


class Facility(models.Model):
    """Inmate facilities (locations)"""
    
    name = models.CharField(max_length=250, unique=True)
    restrictsHardbacks = models.BooleanField(verbose_name="This facility restricts hardbacks", default=False)
    
    def __unicode__(self):
        return self.name
    
    class Meta:
        verbose_name_plural="Facilities"
        ordering = ['name']
    
    # Usethe Facility manager to provide custom ordering
    objects = FacilityManager()
    
    @staticmethod
    def get_non_facility():
        """We have a special facility record that means "facility not in list of normal facilities, enter an address manually
        This special record has a pk of 1; there should be a fixture that has the pk of 1 with this info in it"""
        return Facility.objects.get(pk=1)


class InmateIDField(models.CharField):
    """Special CharField for a InmateIDs, which will accept them in a variety of formats but clean and validate them"""
    
    NO_ID = None     # constant used to denote that this inmate doesn't have an ID and that's OK
    
    def validate(self, value, model_instance):
        """Validates and formats an inmate ID"""
        
        error_format_message = '''
            Inmate IDs must be a letter followed by 5 numbers (for Illinois DOC inmates) or 8 numbers (for Federal inmates) or 6 numbers (for Arizona inmates)
            '''

        if (value == '' or value is None):
            # no ID (for limited use only!) which is acceptable
            return self.NO_ID
        elif value[0] in string.digits:
            # federal ID
            if unicode(value).isnumeric() and len(value) == 8:
                return value
            # Arizona state ID
            elif unicode(value).isnumeric() and len(value) == 6:
                return value
            else:
                raise ValidationError(error_format_message)
        elif value[0] in string.ascii_letters:
            # Illinois state ID
            if unicode(value[1:]).isnumeric() and len(value[1:]) == 5:
                return value
            else:
                raise ValidationError(error_format_message)
        else:
            raise ValidationError(error_format_message)

    def clean(self, value, model_instance):
        """Cleans the Inmate ID by stripping out all spaces and dashes"""
        
        if value is not None:
            # strip the spaces and dashes
            value = string.replace(value, ' ', '')
            value = string.replace(value, '-', '')
            # make it all uppercase
            value = string.upper(value)
        # so we can have multiple values with no ID (i.e. null ID field)
        if value == '':
            value = None
        
        return models.CharField.clean(self, value, model_instance) 


class Inmate(models.Model):
    """
    Model for inmates themselves
    """
    
    # actual fields
    inmate_id = InmateIDField(max_length=250, verbose_name="Inmate ID", unique=True, null=True)
    first_name = models.CharField(max_length=250, verbose_name="First name")
    last_name = models.CharField(max_length=250, verbose_name="Last name")
    address = models.CharField(max_length=250, verbose_name="Address", blank=True, null=True)
    facility = models.ForeignKey(Facility)
    creation_date = models.DateTimeField(default=datetime.datetime.now, editable=False)
    # end fields 
    
    def __unicode__(self):
        if self.inmate_id is None:
            id = 'none'
        else:
            id = self.inmate_id
        return ' '.join((self.last_name + ',', self.first_name, '(ID#', id + ')'))
    
    def save(self, *args, **kwargs):
        """Override the normal save method to make sure we validate before
           saving into the database"""
        self.full_clean()                         # validate the model
        super(Inmate, self).save(*args, **kwargs) # Call the "real" save() method.
    
    @models.permalink
    def get_absolute_url(self):
        return ('inmate-detail', [str(self.pk)])
    
    class InmateType:
        FEDERAL = 1
        ILLINOIS = 2
        ARIZONA = 3
    
    def inmate_type(self):
        if self.inmate_id is InmateIDField.NO_ID:
            return None
        if self.inmate_id[0] in string.digits:
            if len(self.inmate_id) == 8:
                return self.InmateType.FEDERAL
            elif len(self.inmate_id) == 6:
                return self.InmateType.ARIZONA
            return self.InmateType.federal
        elif self.inmate_id[0] in string.ascii_letters:
            return self.InmateType.ILLINOIS
        
    def inmate_id_formatted(self):
        if self.inmate_type() is None:
            return ""
        if self.inmate_type() is Inmate.InmateType.FEDERAL:
            return self.inmate_id[0:5] + '-' + self.inmate_id[5:8]  # return "XXXXX-XXX" format used by the Federal Bureau of Prisons
        elif self.inmate_type() is Inmate.InmateType.ILLINOIS:
            return self.inmate_id.upper()                           # return "LETTER#####" format used by Illinois DOC
        elif self.inmate_type() is Inmate.InmateType.ARIZONA:
            return self.inmate_id

    def full_name(self):
        return self.first_name + ' ' + self.last_name
    
    def full_name_last(self):
        return self.last_name + ', ' + self.first_name
    
    def warnings(self):
        """Returns a list of warnings to be displayed on the inmate's record on the search page"""
        warnings = list()
        # if the inmate's facility restricts hardbacks, add a warning
        if self.facility.restrictsHardbacks:
            warnings += ["Patron's facility restricts hardbacks!"]
        # if the inmate associated with this order has had an order within 3 months (3*30 days), add a warning
        recent_orders = self.order_set.filter(status__exact='SENT').filter(date_closed__gte=(datetime.date.today() - datetime.timedelta(3*30))).order_by('-date_closed')
        if recent_orders.count():
            warnings += ["Patron received an order less than 3 months ago (on %s)" % recent_orders[0].date_closed.strftime('%b %d, %Y')]
        # return the full warning list
        return warnings
    
    def dictionaries(self):
        """Returns a list of the dictionaries the inmate has already received"""
        # if the inmate has previously received a dictionary, note it
        dictionaries = Book.objects.filter(order__inmate=self) \
                                   .filter(order__status='SENT') \
                                   .filter(title__icontains='dictionary')
        return dictionaries


    def clean(self):
        """Ensures that the inmate model is consistent
           Makes sure that either a facility is selected or the "other" facility is selected and an address is filled in"""
        if self.facility_id and (self.facility == Facility.get_non_facility()): # we need the initial check for facility_id because if it wasn't filled in we'll get an exception trying to reference the self.facility object
            if not self.address:
                raise ValidationError('Address: If the facility is not listed you must provide an address')
        else:
            # If the facility is a normal one then ignore the address field
            self.address = ''
        
  
class Order(models.Model):
    """Orders, which are collections of books"""

    ORDER_STATUS = (
        ('SENT', 'Sent'),
        ('OPEN', 'Open')
    )

    # actual fields
    status = models.CharField(max_length=6, choices=ORDER_STATUS, default='OPEN', verbose_name="Order status")
    inmate = models.ForeignKey(Inmate, verbose_name="Inmate")
    date_opened = models.DateTimeField(default=datetime.datetime.now, editable=False, verbose_name="Date opened")
    date_closed = models.DateTimeField(blank=True, null=True, verbose_name="Date closed")
    sender = models.CharField(max_length=250, null=True, blank=True, verbose_name="Sender")
    # end fields

    def __unicode__(self):
        return 'Order #' + str(self.pk)

    @models.permalink
    def get_absolute_url(self):
        return ('order-detail', (), {'object_id': self.pk})

    def save(self, *args, **kwargs):
        """Override the normal save method to make sure we validate before
           saving into the database"""
        self.full_clean()                        # validate the model
        super(Order, self).save(*args, **kwargs) # Call the "real" save() method.
    
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
        """Return a list of text warnings associated with this order (e.g. if
           this inmate's recently received another similar order, etc."""
        warnings = list()
        # if the inmate associated with this order has had an order within 3 months (3*30 days), add a warning
        recent_orders = self.inmate.order_set \
                                .filter(status__exact='SENT') \
                                .filter(date_closed__gte=(datetime.date.today() - datetime.timedelta(3*30))) \
                                .exclude(pk=self.pk) \
                                .order_by('-date_closed')
        if recent_orders.count():
            warnings += ["Patron received an order less than 3 months ago"]
        # if the inmate associated with this order has gotten a similar book before, add a warning
        for book in self.book_set.all():
            similar_books = Book.objects.filter(order__status='SENT') \
                                        .filter(order__inmate=self.inmate) \
                                        .filter(title__icontains=book.title) \
                                        .exclude(order__pk=self.pk)      # That is to say: for all books, select those in a sent-out order that went to this inmate, and then subselect the books with titles like the title of a book in this order
            if similar_books.count():
                warnings += ["Patron already received %s on %s" % (similar_books[0].title, similar_books[0].order.date_closed.strftime("%b %d, %Y"))]
        # if the inmate's facility restricts hardbacks, add a warning
        if self.inmate.facility.restrictsHardbacks:
            warnings += ["Shipping to %s, which does not allow hardbacks!" % self.inmate.facility]
        duplicate_warning = False
        for book1 in self.book_set.all():
            for book2 in self.book_set.all():
                if (not book1 == book2) and book1.title == book2.title:
                    duplicate_warning = True
        if duplicate_warning:
            warnings += ["Two books in this order have the same title"]                    
        return warnings


class Book(models.Model):
    """Books, which are either user-entered or pulled from Amazon"""
    asin = models.CharField(max_length=13, verbose_name="ISBN", blank=True, null=True)    # Amazon identifier; an ISBN if the book has an ISBN or an amazon-invented alphanumeric ID otherwise. The "ISBN" verbose name is just so the users don't get confused.
    title = models.CharField(max_length=250, verbose_name="Title")
    author = models.CharField(max_length=250, verbose_name="Author", blank=True)
    order = models.ForeignKey(Order)
    creation_date = models.DateTimeField(default=datetime.datetime.now, editable=False, verbose_name="Creation date")
    
    def __unicode__(self):
        if self.author:
            return self.author + ' - ' + self.title
        else:
            return self.title
    
    def save(self, *args, **kwargs):
        """Override the normal save method to make sure we validate before
           saving into the database"""
        self.full_clean()                        # validate the model
        super(Book, self).save(*args, **kwargs) # Call the "real" save() method.
    
    class Meta:
        """Order the books in reverse creation date, so that in a list of books
           in the database the ones that were added most recently come first 
           (particularly useful for listing books in an order with the most
           recently-added books first)"""
        ordering = ['-creation_date']

    @staticmethod
    def get_book(ASIN):
        """Factory method, looks up the book with the given ASIN and add returns a
        populated Book object
        Raises InvalidParameterValue (from the item_lookup call) if the ISBN isn't found
        """
        
        # Set up the Amazon API
        api = amazonproduct.API(settings.AWS_KEY, settings.AWS_SECRET_KEY, locale='us', associate_tag=settings.AWS_ASSOCIATE_TAG)
        
        # Do the Amazon lookup. This throw an exception if the ASIN isn't found.
        try:
            node = api.item_lookup(ASIN, IdType='ISBN', SearchIndex='Books')
            # Parse out the results
            xmlBook = node.Items.Item
            book = Book()
            book.title = xmlBook.ItemAttributes.Title.text
            book.author = xmlBook.ItemAttributes.Author.text
            book.asin = xmlBook.ASIN.text
            return book
        except Exception, e:
            # For debugging help we dump the exception to console should the search throw one, which it often does...
            print e
            raise

