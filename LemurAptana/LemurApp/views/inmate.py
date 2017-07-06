from django.core.paginator import Paginator, EmptyPage, InvalidPage
from django.http import Http404, JsonResponse
from django.shortcuts import render_to_response
from django.template import RequestContext

from LemurAptana.LemurApp import forms
from LemurAptana.LemurApp.lib.search_proxy.federal import federal_search_proxy
from LemurAptana.LemurApp.lib.search_proxy.ky import kentucky_search_proxy
from LemurAptana.LemurApp.lib.search_proxy.il import illinois_search_proxy
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
    if res:
      res = res[0]
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


def inmate_doc_autocomplete(request):
  res = federal_search_proxy(first_name=request.POST.get('first_name'),
                             last_name=request.POST.get('last_name'),
                             inmate_id=request.POST.get('inmate_id'))
  # todo fuzzy-match facility to an existing one if possible
  return JsonResponse({"proxy_search_results": res})
