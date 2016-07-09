import datetime
import string

from LemurAptana.LemurApp.models.settings_store import LemurSettingsStore
from LemurAptana.LemurApp.models.facility import Facility
from django.core.exceptions import ValidationError
from django.db import models


class InmateIDField(models.CharField):
    """Special CharField for a InmateIDs, which will accept them in a variety of formats but clean and validate them"""

    NO_ID = None     # constant used to denote that this inmate doesn't have an ID and that's OK

    def validate(self, value, model_instance):
        """Validates and formats an inmate ID"""

        error_format_message = '''
            Inmate IDs must be a letter followed by 5 numbers (for Illinois DOC inmates) or 8 numbers (for Federal inmates) or 6 numbers (for Kentucky inmates)
            '''

        if value == '' or value is None:
            # no ID (for limited use only!) which is acceptable
            return self.NO_ID
        elif value[0] in string.digits:
            # federal ID
            if unicode(value).isnumeric() and len(value) == 8:
                return value
            # Kentucky state ID
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
    # in some cases the relevant DOC site stores inmate IDs in a different format, we cache this internally to make
    # lookups easier
    inmate_doc_id = models.CharField(max_length=250, verbose_name="Inmate DOC ID", blank=True, default="")
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
        return 'inmate-detail', [str(self.pk)]

    class InmateType:
        FEDERAL = 1
        ILLINOIS = 2
        KENTUCKY = 3

    @staticmethod
    def compute_inmate_type(inmate_id):
        if inmate_id is InmateIDField.NO_ID:
            return None
        if inmate_id[0] in string.digits:
            if len(inmate_id) == 8:
                return Inmate.InmateType.FEDERAL
            elif len(inmate_id) == 6:
                return Inmate.InmateType.KENTUCKY
            return Inmate.InmateType.FEDERAL
        elif inmate_id[0] in string.ascii_letters:
            return Inmate.InmateType.ILLINOIS

    def inmate_type(self):
        return self.compute_inmate_type(self.inmate_id)

    def inmate_id_formatted(self):
        if self.inmate_type() is None:
            return ""
        if self.inmate_type() is Inmate.InmateType.FEDERAL:
            # return "XXXXX-XXX" format used by the Federal Bureau of Prisons
            return self.inmate_id[0:5] + '-' + self.inmate_id[5:8]
        elif self.inmate_type() is Inmate.InmateType.ILLINOIS:
            # return "LETTER#####" format used by Illinois DOC
            return self.inmate_id.upper()
        elif self.inmate_type() is Inmate.InmateType.KENTUCKY:
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
        # if the inmate associated with this order has had an order within the order warning age, add a warning
        recent_orders = self.order_set.filter(status__exact='SENT').filter(date_closed__gte=(datetime.date.today() - datetime.timedelta(LemurSettingsStore.order_age_warning()*30))).order_by('-date_closed')
        if recent_orders.count():
            warnings += ["Patron received an order less than %s months ago (on %s)" %
                         (LemurSettingsStore.order_age_warning(), recent_orders[0].date_closed.strftime('%b %d, %Y'))]
        # return the full warning list
        return warnings

    def dictionaries(self):
        """Returns a list of the dictionaries the inmate has already received within the last 5 years"""
        # if the inmate has previously received a dictionary, note it
        five_years_ago = datetime.date.today() - datetime.timedelta(days=365*5)

        # TODO move this to be on the Book model
        # dictionaries = (Book.objects.filter(order__inmate=self)
        #                 .filter(order__status='SENT')
        #                 .filter(title__icontains='dictionary')
        #                 .filter(order__date_closed__gt=five_years_ago))
        dictionaries = []
        return dictionaries

    def clean(self):
        """Ensures that the inmate model is consistent.

        Makes sure that either a facility is selected or the "other" facility is selected and an address is filled in"""
        # we need the initial check for facility_id because if it wasn't filled in we'll get an exception trying to
        # reference the self.facility object
        if self.facility_id and (self.facility == Facility.get_non_facility()):
            if not self.address:
                raise ValidationError('Address: If the facility is not listed you must provide an address')
        else:
            # If the facility is a normal one then ignore the address field
            self.address = ''