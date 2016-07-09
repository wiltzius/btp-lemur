import datetime

import amazonproduct
from server.LemurApp.models.order import Order
from django.conf import settings
from django.db import models


class Book(models.Model):
    """Books, which are either user-entered or pulled from Amazon"""
    # Amazon identifier; an ISBN if the book has an ISBN or an amazon-invented alphanumeric ID otherwise. The "ISBN"
    # verbose name is just so the users don't get confused.
    asin = models.CharField(max_length=13, verbose_name="ISBN", blank=True, null=True)
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
        api = amazonproduct.API(settings.AWS_KEY,
                                settings.AWS_SECRET_KEY,
                                locale='us',
                                associate_tag=settings.AWS_ASSOCIATE_TAG)

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