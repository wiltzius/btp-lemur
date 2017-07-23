import json
from datetime import datetime

import logging
from django.core.urlresolvers import reverse
from django.http import HttpResponseBadRequest, HttpResponse, Http404
from django.shortcuts import redirect, get_object_or_404, render_to_response
from django.template import RequestContext
from django.template.loader import render_to_string

from LemurAptana.LemurApp import forms
from LemurAptana.LemurApp.lib import isbn, google_books
from LemurAptana.LemurApp.lib.google_books import booktuple
from LemurAptana.LemurApp.models import Inmate, Order, Book


def order_create(request, inmate_pk):
  """Create a new order for the given inmate"""
  try:
    # look at the request to find the current inmate
    inmate = Inmate.objects.get(pk=inmate_pk)
    # create a new order object for this inmate
    order = Order()
    order.inmate = inmate
    order.status = 'OPEN'
    order.save()
    # save this order in the session
    request.session['order'] = order
    # redirect to the order_build view via named URLs to start adding books
    return redirect(reverse('order-build'))
  except Inmate.DoesNotExist:
    print("There is no inmate with primary key " + request.session['inmate'])
    raise


def order_add_book_isbn(request):
  """Same as order_add_book_asin except it does additional ISBN format checking"""
  if isbn.isValid(isbn.isbn_strip(request.POST['ISBN'])):
    # try:
    book = Book.get_book(isbn.isbn_strip(request.POST['ISBN']))
    if not book:
      raise Http404('No book with that ISBN found')
    order_add_book(request, book)
    return order_render_as_response(request)
  else:
    # this ASIN isn't well-formatted, so return 400-bad-request error message
    return HttpResponseBadRequest()


def order_add_book(request, book):
  """Add the book to the current session order
     Saves the book to do so"""
  try:
    # now add this book to the current order and save it
    book.order = request.session['order']
    book.save()
  except KeyError:
    # there is no current order
    print("Tried to add a book to current order, but there isn't a current order")
    raise KeyError


def order_remove_book(request, book_pk):
  """Remove the given book from the current order and delete it"""
  try:
    book = get_object_or_404(Book, pk=book_pk)
    if book.order == request.session['order']:
      book.delete()
    else:
      raise Exception("Tried to remove a book from the current order that wasn't in the current order")
  except KeyError:
    logging.info("Tried to remove a book from the current order, but there isn't a current order")
    raise

  return order_render_as_response(request)


def order_add_book_custom(request):
  """Add book to the current order with a custom title & author. Used for the
     AJAX book adds of books with custom titles and/or authors."""
  # If this is a non-unique book, fill in what attributes we can and continue
  if request.POST.get('Title', False):
    book = Book()
    book.title = request.POST.get('Title', '')
    book.author = request.POST.get('Author', '')
    order_add_book(request, book)
  else:
    # The title is empty, which is the one field we require. We fail
    # silently for now, but could do something here.
    logging.info('Tried to add a custom book with no title to the current order, failing silently')
  return order_render_as_response(request)


def order_render_as_response(request):
  """Wraps the current order snippet in an HTTP Response for return by view
     functions (the AJAX ones; its a reponse for the client-side AJAX call)"""
  return HttpResponse(json.dumps(
    {'summary': order_get_summary_html(request),
     'snippet': order_get_snippet_html(request),
     'warnings': order_get_warnings_html(request), }))


def order_get_snippet_html(request):
  """Renders the current order as a snippet of HTML"""
  return render_to_string('LemurApp/order_snippet.html', context_instance=RequestContext(request))


def order_get_summary_html(request):
  """Renders the current order summary as a snippet of HTML"""
  return render_to_string('LemurApp/order_summary.html', context_instance=RequestContext(request))


def order_get_warnings_html(request):
  """Renders the current order's warnings in a list as a snippet of HMTL"""
  return render_to_string('LemurApp/order_warnings.html', context_instance=RequestContext(request))


def order_build(request):
  """Initial view for the order build page. Initializes all the forms for
     that page. This view also handles forms that submited back to the page,
     which is only the true search form for now because the title form and
     the ISBN form are both handled by client-side AJAX functions that make
     requests to other views (order_add_book_custom and order_add_book_asin,
     respectively).

     So for the true Amazon search, this view does an Amazon API search
     and returns the results."""

  context_dict = {
    'errors': [],
    'formISBN': forms.BookForm(auto_id='isbn_id_%s'),
    'formTitle': forms.BookForm(auto_id='title_id_%s'),
    'formSearch': forms.BookForm(auto_id='search_id_%s')
  }

  # If it's a real search, do a Google search and display the results
  if request.GET.get('whichForm', False) == 'search':
    context_dict['formSearch'] = forms.BookForm(request.GET, auto_id='search_id_%s')
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
      context_dict['books'] = []
      context_dict['books'] = search_result.books
      context_dict['totalPages'] = search_result.pages
      if search_result.pages > 1:
        context_dict['pagination'] = True
      context_dict['currPage'] = page
      context_dict['nextPage'] = page + 1
      context_dict['prevPage'] = page - 1
    else:
      # There weren't any results from our Amazon query
      context_dict['errors'] += [
        "No books matching the title/author you entered were found, try double-checking your spelling."]
      if request.GET.get('author') and request.GET.get('title'):
        # If the user entered both an author and a title, create a new dummy book result to use instead of real
        # results with the entered form data
        context_dict['errors'] += [
          "If you're certain the title and author you entered are correct, you can manually add the book below."]
        book = booktuple(title=request.GET['title'], author=request.GET['author'], isbn='')
        context_dict['books'] = [book]
        context_dict['custom_book'] = True
      else:
        # If we're missing the author or title prompt the user to enter both before we try making a dummy book
        context_dict['errors'] += [
          "If you enter both a title and an author in the search form you can manually enter the book."]

  context_dict['currentOrderHTML'] = order_get_snippet_html(request)
  context_dict['currentOrderWarningsHTML'] = order_get_warnings_html(request)
  return render_to_response('LemurApp/order_build.html', context_dict, context_instance=RequestContext(request))


def order_send_out(request):
  """Display a page allowing the user to mark an order as sent out. Mark the
     current order as sent if the form is submitted."""
  if request.method == 'POST':  # If the form has been submitted...
    form = forms.SendOutForm(request.POST)  # A form bound to the POST data
    if form.is_valid():  # All validation rules pass
      currentOrder = request.session['order']
      currentOrder.sender = form.cleaned_data['sender']
      currentOrder.date_closed = datetime.now()
      currentOrder.status = 'SENT'
      currentOrder.save()
      # now that we're sent, we can unset the current order
      del request.session['order']
      return redirect(currentOrder)
  else:
    if 'order' in request.session:
      form = forms.SendOutForm(instance=request.session['order'])  # An unbound form
    else:
      form = None
  return render_to_response('LemurApp/order_sendout.html', {'form': form}, context_instance=RequestContext(request))


def order_unset(request):
  """Unset the current order in session and redirect to the list of open
     orders where another can be selected."""
  request.session['order'] = None
  return redirect(reverse('order-list'))


def order_set(request, order_pk):
  """Select the given order and set it as the current order in session, then
     redirect to the order_build page."""
  request.session['order'] = get_object_or_404(Order, pk=order_pk)
  return redirect(reverse('order-build'))


def order_reopen(request, order_pk):
  """Resets the status of the given order to open and sets this order to current."""
  order = get_object_or_404(Order, pk=order_pk)
  order.status = 'OPEN'
  order.date_closed = None
  order.save()
  return order_set(request, order_pk)
