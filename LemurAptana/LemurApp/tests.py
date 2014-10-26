"""
Basic tests for the Lemur app.
"""

from django.test import TestCase
from django.test.client import Client
from django.core.exceptions import ValidationError, ObjectDoesNotExist
import models
import datetime
import amazonproduct
import templatetags.lemur_extras as lemur_extras


class BasicLoadTest(TestCase):
    """Basic tests to ensure all top-level paths load correctly."""

    def setUp(self):
      self.c = Client()

    def url_test(self, url):
      response = self.c.get(url)
      self.assertEquals(response.status_code, 200)

    def test_inmate_search(self):
      self.url_test('/lemur/inmate/search/')

    def test_inmate_add(self):
      self.url_test('/lemur/inmate/add/')

    def test_order_list(self):
      self.url_test('/lemur/order/list/')

    def test_order_sendout(self):
      self.url_test('/lemur/order/sendout/')


class OrderTest(TestCase):

    @staticmethod
    def create_inmate():
        # create dummy inmate
        i = models.Inmate()
        i.first_name = "No"
        i.last_name = "Body"
        i.inmate_id = "A12345"
        i.facility = models.Facility.get_non_facility()
        i.address = "Boo"
        i.full_clean()
        i.save()
        return i

    @staticmethod
    def create_order_1():
        """ Create an inmate, one order for that inmate, and one book for that order
            Returns the order object.
        """
        i = OrderTest.create_inmate()
        # create dummy order 1
        o1 = models.Order()
        o1.inmate = i
        o1.save()
        o1.date_closed = datetime.datetime.now()
        o1.status = 'SENT'
        o1.save()
        # ...with 1 dummy book
        b1 = models.Book()
        b1.title = "dictionary"
        b1.order = o1
        b1.save()
        return o1

    @staticmethod
    def create_order_2(i):
        """Creates a dummy order for the given inmate with a single dictionary in it"""
        # create dummy order 2
        o2 = models.Order()
        o2.inmate = i
        o2.save()
        o2.status = 'SENT'
        o2.date_closed = datetime.datetime.now()
        o2.save()
        # ...with 1 dummy book
        b2 = models.Book()
        b2.title = "dictionary"
        b2.order = o2
        b2.full_clean()
        b2.save()
        return o2

    def test_order_warnings(self):
        """
        Tests that the proper warnings are returned for orders
        """

        o1 = OrderTest.create_order_1()

        # make sure there are no warnings now, one clean order
        self.assertEquals(len(o1.warnings()), 0)

        o2 = OrderTest.create_order_2(o1.inmate)

        # make sure there is a prior-order warning
        self.assertTrue("Patron received an order less than 3 months ago" in o2.warnings())

        # make sure there's a prior-book warning
        self.assertTrue(True in ["Patron already received" in warning for warning in o2.warnings()])
        self.assertFalse(True in ["blah blah blah this isn't a warning" in warning for warning in o2.warnings()])

        # make sure we haven't triggerd the same-book warning
        self.assertFalse(True in ["Two books in this" in warning for warning in o2.warnings()])

        # Add another book
        b3 = models.Book()
        b3.order = o2
        b3.title = "dictionary"
        b3.full_clean()
        b3.save()

        # ...and test if it triggers the same-book warning
        self.assertTrue(True in ["Two books in this" in warning for warning in o2.warnings()])


    def test_inmate_duplicate(self):
        #i = OrderTest.create_inmate()
        #self.assertRaises(ValidationError, OrderTest.create_inmate())
        pass

# Disabled for now as order cleanup is not expected to work
    def test_order_cleanup(self):
        """Tests that the order cleanup happens correctly"""
        # clean slate
        models.Order.objects.all().delete()
        models.Inmate.objects.all().delete()
        models.Book.objects.all().delete()

        # create an open order
        i = OrderTest.create_inmate()
        o1 = models.Order()
        o1.inmate = i
        o1.save()
        pk1 = o1.pk

        # create a second open order, this one with a book
        o2 = models.Order()
        o2.inmate = i
        o2.save()
        b1 = models.Book()
        b1.title = "dictionary"
        b1.order = o2
        b1.save()

        # ensure that the first two orders are open
        self.assertEquals(o1.status, 'OPEN')
        self.assertEquals(o2.status, 'OPEN')

        # create a third, sent order, ensure its closed
        o3 = OrderTest.create_order_2(i)
        self.assertEquals(o3.status, 'SENT')

        c = Client()
        response = c.get('/lemur/order/cleanup/')

        # now the open order o1 should be gone
        self.assertRaises(models.Order.DoesNotExist, models.Order.objects.get, pk=pk1)
        # now the open order o2 should be sent
        o2_again = models.Order.objects.get(pk=o2.pk)
        self.assertEquals(o2_again.status, 'SENT')
        # now the sent order o3 should be the same
        o3_again = models.Order.objects.get(pk=o3.pk)
        self.assertEquals(o3_again.status, 'SENT')

    def test_unicode_errors(self):
        """Makes sure that funny characters don't mess up the template system"""
        c = Client()
        response = c.get('/lemur/order/build/?whichForm=search&csrfmiddlewaretoken=3ff87b8c8ea9d6ae6f2797eaa30509f4&title=harry%20potter&page=3&author=rowling')
        # if this page loads fine then we're OK

    def test_unicode_errors_db(self):
        """Makes sure that funny characters from Amazon don't mess up the database"""
        order = OrderTest.create_order_1()
        book = models.Book.get_book('8478889019')
        book.order = order
        book.save()

    def test_creation_date(self):
        """Create an order, save it, change it, save it again and make sure it's creation date doesn't change"""
        order = OrderTest.create_order_1()
        date = order.date_opened
        order.status = 'OPEN'
        order.date_closed = None
        order.save()
        self.assertEquals(order.date_opened, date)

    def test_load_order(self):
        """Create an order then load it to ensure successful template processing."""
        order = OrderTest.create_order_1()
        c = Client()
        response = c.get('/lemur/order/set/' + str(order.id), follow=True)
        self.assertEquals(response.status_code, 200)

    def test_send_order(self):
        order = OrderTest.create_order_1()
        c = Client()
        response = c.get('/lemur/order/set/' + str(order.id), follow=True)
        self.assertEquals(response.status_code, 200)
        response = c.get('/lemur/order/sendout/', follow=True)
        self.assertEquals(response.status_code, 200)
        response = c.post('/lemur/order/sendout/', {'id_sender': 'tom'}, follow=True)
        self.assertEquals(response.status_code, 200)

    def test_book_search_pagination(self):
        """Ensure that loading different pages yields different results."""
        c = Client()
        #TODO implement a test
        pass

class InmateTest(TestCase):

    def test_inmate_edit_view(self):
        """Ensures the inmate editing page loads."""
        self.test_inmate_validation() # cheap way to get an inmate
        inmate = models.Inmate.objects.all()[0]
        c = Client()
        response = c.get('/lemur/inmate/edit/' + str(inmate.pk), follow=True)
        self.assertEquals(response.status_code, 200)

    def test_inmate_validation(self):
        """Makes sure that inmate objects raise errors if they're missing fields"""
        inmate = models.Inmate()
        inmate.first_name = "Test"
        inmate.last_name = "Test"
        inmate.facility = models.Facility.get_non_facility()
        inmate.address = "Nowhere"
        # make sure this can be saved just fine
        inmate.save()
        # now selectively delete things and make sure they make the test fail
        # check first name
        inmate.first_name = ""
        self.assertRaises(ValidationError, inmate.save)
        inmate.first_name = "Test"
        # check last name
        inmate.last_name = ""
        self.assertRaises(ValidationError, inmate.save)
        inmate.last_name = "Test"
        # check address
        inmate.address = ""
        self.assertRaises(ValidationError, inmate.save)
        inmate.address = "Nowhere"
        # make sure we can successfully save still
        inmate.save()

    def test_inmate_id_uniqueness(self):
        # create one inmate
        inmate = models.Inmate()
        inmate.first_name = "Test1"
        inmate.last_name = "Test1"
        inmate.inmate_id = "A12345"
        inmate.facility = models.Facility.get_non_facility()
        inmate.address = "Nowhere"
        inmate.save()

        # create a second inmate with the same ID but different case
        inmate2 = models.Inmate()
        inmate2.first_name = "Test1"
        inmate2.last_name = "Test1"
        inmate2.inmate_id = "a12345"
        inmate2.facility = models.Facility.get_non_facility()
        inmate2.address = "Nowhere"

        # should throw a uniqueness exception
        self.assertRaises(ValidationError, inmate2.save)

    def test_inmate_doc_link(self):
        """Makes sure that InmateDOC links render without errors even if the Inmate's ID is blank"""
        inmate = models.Inmate()
        inmate.first_name = "Hello"
        inmate.last_name = "World"
        inmate.facility = models.Facility.get_non_facility()
        inmate.address = "Boo"
        inmate.save()
        # make sure the following doesn't raise an exception
        doc_link = lemur_extras.inmate_doc_link(inmate.pk, "test text")

    def test_inmate_id_types(self):
        # set up basic inmate details
        inmate = models.Inmate()
        inmate.first_name = "Hella"
        inmate.last_name = "World"
        inmate.facility = models.Facility.get_non_facility()
        inmate.address = "Boo"
        # Assert 6 digits is Arizona
        inmate.inmate_id = "123456"
        inmate.save()
        self.assertEqual(inmate.inmate_type(), models.Inmate.InmateType.ARIZONA)
        # Assert 8 digits is Federal
        inmate.inmate_id = '12345678'
        inmate.save()
        self.assertEqual(inmate.inmate_type(), models.Inmate.InmateType.FEDERAL)
        # assert 5 digits doesn't work
        inmate.inmate_id = "12345"
        self.assertRaises(ValidationError, inmate.save)
        # assert 9 digits doesn't work
        inmate.inmate_id = "123456789"
        self.assertRaises(ValidationError, inmate.save)
        # assert 6 digits with a letter is Illinois
        inmate.inmate_id = "A2345"
        self.assertEqual(inmate.inmate_type(), models.Inmate.InmateType.ILLINOIS)
        # assert 6 digits with a letter in the wrong spot doesn't work
        inmate.inmate_id = "12345A"
        self.assertRaises(ValidationError, inmate.save)

