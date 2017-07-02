import re

import requests
from bs4 import BeautifulSoup
from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.http import Http404, JsonResponse
from django.shortcuts import render_to_response
from django.template import RequestContext

from LemurAptana.LemurApp import forms
from LemurAptana.LemurApp.models import Inmate


def inmate_search(request, pk=None):
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
  context_dict['has_results'] = False
  if pk is not None:
    # inmate = get_object_or_404(Inmate, pk=object_id)
    query = Inmate.objects.filter(pk__exact=pk)
    if query.count() != 1:
      raise Http404
    context_dict['form'] = forms.InmateForm(instance=query[0])  # A form bound to this Inmate instance
    context_dict['inmate_list'] = paginate_results(query)
    context_dict['has_results'] = True
  elif 'inmate_id' in request.GET or 'first_name' in request.GET or 'last_name' in request.GET:
    context_dict['form'] = forms.InmateForm(request.GET)  # A form bound to the GET data
    context_dict['query'] = request.META['QUERY_STRING']
    # Try to find the inmate
    query = Inmate.objects.all()
    inmate_id = request.GET.get('inmate_id')
    if inmate_id:
      query = query.filter(inmate_id__icontains=inmate_id)
    first_name = request.GET.get('first_name')
    if first_name:
      query = query.filter(first_name__icontains=first_name)
    last_name = request.GET.get('last_name')
    if last_name:
      query = query.filter(last_name__icontains=last_name)
    # grab the paginated result list
    context_dict['inmate_list'] = paginate_results(query)
    context_dict['has_results'] = True
  else:
    context_dict['form'] = forms.InmateForm()  # An unbound form
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


def inmate_search_proxy(request, pk):
  i = Inmate.objects.get(pk=pk)
  res = {}
  if i.inmate_type() is Inmate.InmateType.FEDERAL:
    res = federal_search_proxy(i.inmate_id)
  elif i.inmate_type() is Inmate.InmateType.ILLINOIS:
    res = illinois_search_proxy(i.inmate_id)
  elif i.inmate_type() is Inmate.InmateType.KENTUCKY:
    res = kentucky_search_proxy(i)
  elif i.inmate_type() is Inmate.InmateType.VIRGINIA:
    return JsonResponse({})
  # collapse paroled date / projected parole date into one field
  if res['paroled_date'] and not res['projected_parole']:
    res['parole_single'] = res['paroled_date']
  elif not res['paroled_date'] and res['projected_parole']:
    res['parole_single'] = res['projected_parole']
  return JsonResponse(res)


def kentucky_search_proxy(inmate):
  """ Searches the Kentucky DOC site (KOOL) and parses some information for the result page """
  if inmate.inmate_doc_id:
    pid_number = inmate.inmate_doc_id
  else:
    kool_url = "http://kool.corrections.ky.gov/"
    r1 = requests.get(kool_url, {
      "returnResults": True,
      "DOC": inmate.inmate_id
    })
    bs = BeautifulSoup(r1.content, "html.parser")

    # there's a string embedded in the page of the format "(1) / (2)" where 2 is the inmate DOC number and 1 is the
    # "PID", which the site uses as their identifier
    pid_number = str(bs.find(string=re.compile(inmate.inmate_id))).split('/')[0].strip()
    if pid_number:
      # if we succeeded in finding one of these, store it for future lookups
      inmate.inmate_doc_id = pid_number
      inmate.save()

  kool_detail_url = "http://kool.corrections.ky.gov/KOOL/Details/%s" % pid_number
  r2 = requests.get(kool_detail_url)

  b2 = BeautifulSoup(r2.content, "html.parser")

  results = {
    "projected_parole": None,
    "paroled_date": None,
    "parent_institution": None
  }

  try:
    # try to parse the parent institution
    # import ipdb; ipdb.set_trace()
    results["parent_institution"] = ' '.join(
      b2.find(string=re.compile('Location:'))
        .find_parent('td')
        .find_next_sibling('td')
        .stripped_strings
    )
  except AttributeError:
    results["parent_institution"] = None

  try:
    # try to parse the expected parole / release date
    results["projected_parole"] = ' '.join(
      b2.find(string=re.compile('TTS'))
        .find_parent('td')
        .find_next_sibling('td')
        .stripped_strings
    )
  except AttributeError:
    results["parent_institution"] = None

  return results


def illinois_search_proxy(inmate_id):
  """ Searches the Illinois DOC website for this inmate's ID and parses out some information from the result page. """

  il_doc_search_url = "http://www.idoc.state.il.us/subsections/search/ISinms2.asp"

  r = requests.post(il_doc_search_url, {
    "selectlist1": "IDOC",
    "idoc": inmate_id
  })

  results = {
    "projected_parole": None,
    "paroled_date": None,
    "parent_institution": None
  }
  bs = BeautifulSoup(r.content, "html.parser")

  try:
    # try to parse out the projected parole date
    results["projected_parole"] = next(
      bs.find(string=re.compile('Projected Parole Date'))
        .find_parent('td')
        .find_next_sibling('td')
        .stripped_strings
    )
  except AttributeError:
    results["projected_parole"] = None

  if results["projected_parole"] is None:
    # if that didn't work, see if they've been paroled already
    try:
      results["paroled_date"] = next(
        bs.find(string=re.compile('Parole Date'))
          .find_parent('td')
          .find_next_sibling('td')
          .stripped_strings
      )
    except AttributeError:
      results["paroled_date"] = None

  try:
    # try to parse the parent institution
    results["parent_institution"] = next(
      bs.find(string=re.compile('Parent Institution'))
        .find_parent('td')
        .find_next_sibling('td')
        .stripped_strings
    )
  except AttributeError:
    results["parent_institution"] = None

  return results


def federal_search_proxy(inmate_id):
  res = requests.post('https://www.bop.gov/PublicInfo/execute/inmateloc',
                      data={
                        'todo': 'query',
                        'output': 'json',
                        'inmateNumType': 'IRN',
                        'inmateNum': inmate_id
                      }).json()
  inmate_data = res['InmateLocator'][0]
  return {
    'projected_parole': inmate_data['projRelDate'],
    'parent_institution': inmate_data['faclName'],
    'paroled_date': inmate_data['actRelDate']
  }
  # return HttpResponse(res.json())

# def order_add_book_asin(request):
#   """Adds a book with the ASIN passed via POST. Used for AJAX book adds of
#      books that were found in Amazon"""
#   try:
#     book = Book.get_book(request.POST['ASIN'])
#     order_add_book(request, book)
#     return order_render_as_response(request)
#   except amazonproduct.InvalidParameterValue:
#     # this ASIN isn't found, so return 404-not-found error message
#     raise Http404('No book with that ASIN found on Amazon')
