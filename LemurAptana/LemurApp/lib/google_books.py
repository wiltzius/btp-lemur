from collections import namedtuple

from apiclient import discovery
from django.conf import settings

# just build this at import time I guess
service = discovery.build('books', 'v1', developerKey=settings.GBOOKS_KEY)

RESULTS_PER_PAGE = 10

booktuple = namedtuple('booktuple', ['title', 'author', 'isbn'])
searchresult = namedtuple('searchresult', ['pages', 'books'])


def _isbn13_from_industry_identifiers(industry_identifiers):
  # the ISBNs are stored in a list for some reason, with a type field, so find the ISBN13 one
  return next(i['identifier'] for i in industry_identifiers if i['type'] == 'ISBN_13')


def _tuple_result(result):
  volumeInfo = result['volumeInfo']
  return booktuple(title=volumeInfo['title'],
                   author=', '.join(volumeInfo['authors']),     # authors is a list
                   isbn=_isbn13_from_industry_identifiers(volumeInfo['industryIdentifiers']))


def search(q, page=0):
  request = service.volumes().list(q=q,
                                   startIndex=page * RESULTS_PER_PAGE,
                                   maxResults=RESULTS_PER_PAGE,
                                   fields="totalItems,items(volumeInfo(title, authors, industryIdentifiers))")
  response = request.execute()
  # import ipdb; ipdb.set_trace()
  return searchresult(pages=response['totalItems'] // RESULTS_PER_PAGE,
                      books=[_tuple_result(r) for r in response['items']])


def search_isbn(isbn):
  request = service.volumes().list(q="isbn:{}".format(isbn),
                                   fields="totalItems,items(volumeInfo(title, authors, industryIdentifiers))")
  response = request.execute()
  # hopefully there's only one result!
  return _tuple_result(response['items'][0])
