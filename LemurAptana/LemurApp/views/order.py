import logging

from django.http import HttpResponseBadRequest, HttpResponse, Http404, JsonResponse
from django.shortcuts import get_object_or_404

from LemurAptana.LemurApp.api.order import OrderSerializer
from LemurAptana.LemurApp.lib import isbn, google_books
from LemurAptana.LemurApp.lib.google_books import booktuple
from LemurAptana.LemurApp.models import Order, Book


# def order_add_book_isbn(request):
#   """Same as order_add_book_asin except it does additional ISBN format checking"""
#   if isbn.isValid(isbn.isbn_strip(request.POST['ISBN'])):
#     # try:
#     book = Book.get_book(isbn.isbn_strip(request.POST['ISBN']))
#     if not book:
#       raise Http404('No book with that ISBN found')
#     order_add_book(request, book)
#     return JsonResponse({})
#   else:
#     # this ASIN isn't well-formatted, so return 400-bad-request error message
#     return HttpResponseBadRequest()
#
#
# def order_add_book(request, book):
#   """Add the book to the current session order
#      Saves the book to do so"""
#   try:
#     # now add this book to the current order and save it
#     book.order = request.session['order']
#     book.save()
#   except KeyError:
#     # there is no current order
#     print("Tried to add a book to current order, but there isn't a current order")
#     raise KeyError


def order_book_search(request):
  returnDict = {}

  # construct Google power search
  # TODO this needs to be updated to not use power search terms anymore
  power = []
  if request.GET.get('author', False):
    power += ['inauthor:' + request.GET['author']]
  if request.GET.get('title', False):
    power += ['intitle:' + request.GET['title']]
  if not power:
    # If we wanted to do something special for searching with all fields empty we could here,
    # but for now just let Google return whatever
    pass

  # Do the power search
  try:
    page = int(request.GET.get('page', '1'))
  except ValueError:
    # if for some reason 'page' is a GET parameter but not a valid number, just default to 1
    page = 1
  search_result = google_books.search(q=power, page=page)

  if search_result.pages:
    returnDict['books'] = []
    returnDict['books'] = search_result.books
    returnDict['totalPages'] = search_result.pages
    if search_result.pages > 1:
      returnDict['pagination'] = True
    returnDict['currPage'] = page
    returnDict['nextPage'] = page + 1
    returnDict['prevPage'] = page - 1
  else:
    # There weren't any results from our Google query
    returnDict['errors'] = [
      "No books matching the title/author you entered were found, try double-checking your spelling."]
    if request.GET.get('author') and request.GET.get('title'):
      # If the user entered both an author and a title, create a new dummy book result to use instead of real
      # results with the entered form data
      returnDict['errors'] += [
        "If you're certain the title and author you entered are correct, you can manually add the book below."]
      # noinspection PyProtectedMember
      book = booktuple(title=request.GET['title'], author=request.GET['author'], isbn='')
      returnDict['books'] = [book]
      returnDict['custom_book'] = True
    else:
      # If we're missing the author or title prompt the user to enter both before we try making a dummy book
      returnDict['errors'] += [
        "If you enter both a title and an author in the search form you can manually enter the book."]
  if 'books' in returnDict:
    returnDict['books'] = [b._asdict() for b in returnDict['books']]
  return JsonResponse(returnDict)


def order_unset(request):
  """Unset the current order in session and redirect to the list of open
     orders where another can be selected."""
  request.session['order'] = None
  return HttpResponse('ok')


def order_set(request, order_pk):
  """Select the given order and set it as the current order in session, then
     redirect to the order_build page."""
  request.session['order'] = get_object_or_404(Order, pk=order_pk)
  return JsonResponse(OrderSerializer(request.session['order']).data)


def order_reopen(request, order_pk):
  """Resets the status of the given order to open and sets this order to current."""
  order = get_object_or_404(Order, pk=order_pk)
  order.status = 'OPEN'
  order.date_closed = None
  order.save()
  return order_set(request, order_pk)


def order_current(request):
  if request.session.get('order'):
    return JsonResponse(OrderSerializer(request.session['order']).data)
  else:
    return JsonResponse({})
