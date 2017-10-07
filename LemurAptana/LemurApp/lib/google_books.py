from collections import namedtuple

from apiclient import discovery
from django.conf import settings

# just build this at import time I guess
service = discovery.build('books', 'v1', developerKey=settings.GBOOKS_KEY)

RESULTS_PER_PAGE = 10

booktuple = namedtuple('booktuple', ['title', 'author', 'isbn'])
searchresult = namedtuple('searchresult', ['pages', 'books', 'lastResultIndex'])


def _isbn13_from_industry_identifiers(industry_identifiers):
  # the ISBNs are stored in a list for some reason, with a type field, so find the ISBN13 one
  try:
    return next(i['identifier'] for i in industry_identifiers if i['type'] == 'ISBN_13')
  except StopIteration:
    return None


def _tuple_result(result):
  try:
    volumeInfo = result['volumeInfo']
    isbn = _isbn13_from_industry_identifiers(volumeInfo['industryIdentifiers'])
    if not isbn:
      return None
    return booktuple(title=volumeInfo['title'],
                     author=', '.join(volumeInfo.get('authors', [])),     # authors is a list, if it exists
                     isbn=isbn)
  except (KeyError, ValueError):
    # import ipdb; ipdb.set_trace()
    # Sometimes the Google API returns results missing some of the key fields; just skip them.
    return None


def search(q, page=0):
  request = service.volumes().list(q=q,
                                   startIndex=page * RESULTS_PER_PAGE,
                                   maxResults=40,     # overfetch because many of the results will be irrelevant
                                   printType='books',
                                   fields="totalItems,items(volumeInfo(title,authors,industryIdentifiers))")
  response = request.execute()
  total_items = response['totalItems']

  results = []
  lastIndex = -1
  items = response.get('items', [])
  while len(items) and len(results) < RESULTS_PER_PAGE:
    # many of the results are irrelevant (ebooks and others missing ISBNs), so continue through the list until we have
    # enough to fill the page.
    # noinspection PyProtectedMember
    r = _tuple_result(items.pop(0))._asdict()
    if r:
      results.append(r)
    # Write down the index of the last book we used to fill the list, since that's where we should start the next page
    # TODO actually use this value, for now it just redisplays some on the next page
    lastIndex += 1
  return searchresult(pages=total_items // RESULTS_PER_PAGE,
                      lastResultIndex=lastIndex,
                      books=results)


def search_isbn(isbn):
  request = service.volumes().list(q="isbn:{}".format(isbn),
                                   fields="totalItems,items(volumeInfo(title,authors,industryIdentifiers))")
  response = request.execute()
  # hopefully there's only one result!
  if response['totalItems'] == 0:
    return None
  return _tuple_result(response['items'][0])
