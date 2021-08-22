import datetime

from django.db import models

from LemurAptana.LemurApp.lib import google_books


class Book(models.Model):
  """Books, which are either user-entered or pulled from Amazon"""
  # ISBN number. Going forward these are ISBN-13 strings, but historically they were ASINs (Amazon's superset of
  # ISBN) -- hence the weird ASIN name
  asin = models.CharField(max_length=13, verbose_name="ISBN", blank=True, null=True)
  title = models.CharField(max_length=250, verbose_name="Title")
  author = models.CharField(max_length=250, verbose_name="Author", blank=True)
  order = models.ForeignKey('Order', related_name="books", on_delete=models.CASCADE)
  creation_date = models.DateTimeField(default=datetime.datetime.now, editable=False, verbose_name="Creation date")

  def __str__(self):
    if self.author:
      return self.author + ' - ' + self.title
    else:
      return self.title

  def save(self, *args, **kwargs):
    """Override the normal save method to make sure we validate before
       saving into the database"""
    self.full_clean()  # validate the model
    super(Book, self).save(*args, **kwargs)  # Call the "real" save() method.

  class Meta:
    """Order the books in reverse creation date, so that in a list of books
       in the database the ones that were added most recently come first
       (particularly useful for listing books in an order with the most
       recently-added books first)"""
    ordering = ['-creation_date']

  @staticmethod
  def get_book(isnb_):
    """Factory method, looks up the book with the given ISBN and add returns a populated Book object

    Raises InvalidParameterValue (from the item_lookup call) if the ISBN isn't found
    """
    try:
      booktuple = google_books.search_isbn(isnb_)
      if not booktuple:
        return
      book = Book()
      book.title = booktuple.title
      book.author = booktuple.author
      book.asin = booktuple.isbn
      return book
    except Exception as e:
      # For debugging help we dump the exception to console should the search throw one, which it often does...
      print(e)
      raise
