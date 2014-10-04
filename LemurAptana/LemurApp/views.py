import forms
from datetime import datetime
from models import Book, Inmate, Order
from django.shortcuts import render_to_response, redirect, get_object_or_404
from django.template import RequestContext
from django.template.loader import render_to_string
from django.http import HttpResponse
import json
from django.core.urlresolvers import reverse
from django.core.paginator import Paginator, InvalidPage, EmptyPage
from django.core.exceptions import ValidationError
from django.views.generic.detail import DetailView
from django.views.generic.list import ListView
from django.views.generic.edit import CreateView, UpdateView
from django.conf import settings
from django.http import Http404, HttpResponseBadRequest
from lib import isbn
import amazonproduct

def inmate_search(request, object_id=None):
    """Searches for the inmate whose information is passed in via GET parameters"""
    
    def paginate_results(queryset):
        paginator = Paginator(queryset, 10)
        
        # Make sure page request is an int. If not, deliver first page.
        try:
            page = int(request.GET.get('page', '1'))
        except ValueError:
            page = 1

        # If page request (9999) is out of range, deliver last page of results.
        try:
            inmates = paginator.page(page)
        except (EmptyPage, InvalidPage):
            inmates = paginator.page(paginator.num_pages)
        
        return inmates
    
    context_dict = {}
    if object_id is not None:
        #inmate = get_object_or_404(Inmate, pk=object_id)
        query = Inmate.objects.filter(pk__exact=object_id)
        if query.count() != 1:
            raise Http404
        context_dict['form'] = forms.InmateForm(instance=query[0]) # A form bound to this Inmate instance
        context_dict['inmate_list'] = paginate_results(query)
    elif 'inmate_id' in request.GET or 'first_name' in request.GET or 'last_name' in request.GET:
        context_dict['form'] = forms.InmateForm(request.GET) # A form bound to the GET data 
        context_dict['query'] = request.META['QUERY_STRING']
        # Try to find the inmate
        inmate_id = request.GET.get('inmate_id', '')
        first_name = request.GET.get('first_name', '')
        last_name = request.GET.get('last_name', '')
        query = Inmate.objects.filter(inmate_id__icontains=inmate_id).filter(first_name__icontains=first_name).filter(last_name__icontains=last_name)
        # grab the paginated result list
        context_dict['inmate_list'] = paginate_results(query)
    else:
        context_dict['form'] = forms.InmateForm() # An unbound form
    return render_to_response('LemurApp/inmate_search.html', context_dict, context_instance=RequestContext(request))


def inmate_add_searched(request):
    """ Takes data from GET querystring and uses it to pre-fill an inmate-add form (which normally uses a generic view;
        we're getting around the generic view here but taking advantage of the fact that the generic view usually adds
        a context variable 'form' that is used to make the inmate creation form. Note we don't validate it because it
        won't usually pass (the idea is to pre-fill a form part way with data from a missed hit in the inmate search
        page, but that page doesn't ask for all inmate details so there's no way that all the necessary information could
        be here)"""
    context_dict = {'form': forms.InmateForm(request.GET)}
    return render_to_response('LemurApp/inmate_add.html', context_dict, context_instance=RequestContext(request))


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
        print "There is no inmate with primary key " + request.session['inmate']
        raise
    

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
        print 'Tried to add a custom book with no title to the current order, failing silently'
    return order_render_as_response(request)

def order_add_book_isbn(request):
    """Same as order_add_book_asin except it does additional ISBN format checking"""
    if(isbn.isValid(isbn.isbn_strip(request.POST['ISBN']))):
        try:
            book = Book.get_book(isbn.isbn_strip(request.POST['ISBN']))
            order_add_book(request, book)
            return order_render_as_response(request)
        except amazonproduct.InvalidParameterValue:
            # this ASIN isn't found, so return 404-not-found error message
            raise Http404('No book with that ISBN found on Amazon')
    else:
        # this ASIN isn't well-formatted, so return 400-bad-request error message
        return HttpResponseBadRequest()

def order_add_book_asin(request):
    """Adds a book with the ASIN passed via POST. Used for AJAX book adds of
       books that were found in Amazon"""
    print "boo"
    try:
        book = Book.get_book(request.POST['ASIN'])
        order_add_book(request, book)
        return order_render_as_response(request)
    except amazonproduct.InvalidParameterValue:
        # this ASIN isn't found, so return 404-not-found error message
        raise Http404('No book with that ASIN found on Amazon')

def order_add_book(request, book):
    """Add the book to the current session order
       Saves the book to do so"""
    try:
        # now add this book to the current order and save it
        book.order = request.session['order']
        book.save()
    except KeyError:
        # there is no current order
        print "Tried to add a book to current order, but there isn't a current order"
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
        print "Tried to remove a book from the current order, but there isn't a current order"
        raise KeyError
    
    return order_render_as_response(request)

def order_render_as_response(request):
    """Wraps the current order snippet in an HTTP Response for return by view
       functions (the AJAX ones; its a reponse for the client-side AJAX call)"""
    return HttpResponse(json.dumps(
                            {'summary': order_get_summary_html(request),
                             'snippet': order_get_snippet_html(request),
                             'warnings': order_get_warnings_html(request),}))

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
       
    context_dict = {}
    context_dict['errors'] = []
    context_dict['formISBN'] = forms.BookForm(auto_id='isbn_id_%s')
    context_dict['formTitle'] = forms.BookForm(auto_id='title_id_%s')
    context_dict['formSearch'] = forms.BookForm(auto_id='search_id_%s')
                
    # If it's a real search, do an Amazon search and display the results
    if request.GET.get('whichForm', False) == 'search':
        context_dict['formSearch'] = forms.BookForm(request.GET, auto_id='search_id_%s')
        power = []
        if request.GET.get('author', False):
            power += ['author:'+request.GET['author']]
        if request.GET.get('title', False):
            power += ['title:'+request.GET['title']]
        if not power:
            # If we wanted to do something special for searching with all fields empty we could here,
            # but for now just let Amazon do it's thing (which is return Stieg Larrson books, apparently) 
            pass    
        
        try:
            # Do the power search
            try:
                page = int(request.GET.get('page', '1'))
            except ValueError:
                # if for some reason 'page' is a GET parameter but not a valid number, just default to 1 
                page = 1
            api = amazonproduct.API(settings.AWS_KEY, settings.AWS_SECRET_KEY, locale='us', associate_tag=settings.AWS_ASSOCIATE_TAG)
            results = api.item_search('Books', Power=' and '.join(power), ItemPage=str(page))
            context_dict['books'] = []
            for book in results:
                context_dict['books'].append(book)
                if(len(context_dict['books']) >= 10):
                    break
            context_dict['totalPages'] = results.pages
            if results.pages > 1: context_dict['pagination'] = True
            context_dict['currPage'] = page
            context_dict['nextPage'] = page+1
            context_dict['prevPage'] = page-1
            
        except amazonproduct.NoExactMatchesFound:
            # There weren't any results from our Amazon query
            context_dict['errors'] += ["No books matching the title/author you entered were found, try double-checking your spelling."]
            if request.GET.get('author', False) and request.GET.get('title', False):
                # If the user entered both an author and a title, create a new dummy book result to use instead of real results with the entered form data
                context_dict['errors'] += ["If you're certain the title and author you entered are correct, you can manually add the book below."]
                book = {'customBook': True, 'ItemAttributes': {'Title': request.GET['title'], 'Author': request.GET['author']}}
                context_dict['books'] = [book]
            else:
                # If we're missing the author or title prompt the user to enter both before we try making a dummy book 
                context_dict['errors'] += ["If you enter both a title and an author in the search form you can manually enter the book."]
    
    context_dict['currentOrderHTML'] = order_get_snippet_html(request)
    context_dict['currentOrderWarningsHTML'] = order_get_warnings_html(request)
    return render_to_response('LemurApp/order_build.html', context_dict, context_instance=RequestContext(request))

def order_send_out(request):
    """Display a page allowing the user to mark an order as sent out. Mark the
       current order as sent if the form is submitted."""
    if request.method == 'POST': # If the form has been submitted...
        form = forms.SendOutForm(request.POST) # A form bound to the POST data
        if form.is_valid(): # All validation rules pass
            currentOrder = request.session['order']
            currentOrder.sender = form.cleaned_data['sender']
            currentOrder.date_closed = datetime.now()
            currentOrder.status = 'SENT'
            currentOrder.save()
            # now that we're sent, we can unset the current order
            del request.session['order']
            return redirect(currentOrder)
    else:
        form = forms.SendOutForm(instance=request.session['order']) # An unbound form
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


## Generic Views

class OrderList(ListView):
    model = Order

class OrderDetail(DetailView):
    model = Order

class InmateCreate(CreateView):
    form_class = forms.InmateForm
    template_name = 'LemurApp/inmate_add.html'
    model = Inmate

class InmateUpdate(UpdateView):
    model = Inmate

'''
def order_cleanup(request):
    """Marks all currently open orders as sent, unless they have no books in which case they're deleted."""
    for order in Order.objects.filter(status__exact='OPEN'):
        # Mark orders with books as sent
        if order.book_set.count():
            order.status = 'SENT'
            order.date_closed = datetime.now()
            order.save()
        # Delete orders without books
        else:
            order.delete()
    # Unset the current order
    order_unset(request)
    # Display the order list template again, with an extra note saying we cleaned up
    return OrderList(request, queryset = Order.objects.filter(status__exact='OPEN'), template_object_name = 'order', extra_context = {'cleaned': True})
'''
