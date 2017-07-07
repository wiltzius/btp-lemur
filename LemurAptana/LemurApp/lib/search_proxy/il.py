import re
from multiprocessing.dummy import Pool

import requests
from bs4 import BeautifulSoup


def parse_inmate_detail_page(inmate_id, html):
  results = {
    "inmate_id": inmate_id,
    "first_name": None,
    "last_name": None,
    "projected_parole": None,
    "paroled_date": None,
    "parent_institution": None
  }
  bs = BeautifulSoup(html, "html.parser")

  # grab the inmate's name
  inmate_name_regex = re.compile(r'[\w]* - (?P<last_name>.*), (?P<first_name>.*)')
  inmate_id_and_name = bs.find(string=inmate_name_regex)
  results.update(inmate_name_regex.match(inmate_id_and_name).groupdict())

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

  # trim all result values
  return {k: v.strip() if v else v for k, v in results.items()}


def parse_result_list(html):
  bs = BeautifulSoup(html, "html.parser")

  option_text = [o.text for o in bs.find_all('option')]
  split_texts = [text.split(' | ') for text in option_text]

  # fetch all the inmate details in parallel
  with Pool(max(len(split_texts), 32)) as p:
    return p.map(_search_inmate_id, [inmate_id for inmate_id, _bday, _fullname in split_texts])


def _search_list(first_name, last_name):
  url = "http://www.idoc.state.il.us/subsections/search/ISListInmates2.asp"
  q = last_name
  if first_name:
    q += ', ' + first_name
  r = requests.post(url, {
    "selectlist1": "Last",
    "idoc": q
  })
  return parse_result_list(r.content)


def _search_inmate_id(inmate_id):
  url = "http://www.idoc.state.il.us/subsections/search/ISinms2.asp"
  r = requests.post(url, {
    "selectlist1": "IDOC",
    "idoc": inmate_id
  })
  return parse_inmate_detail_page(inmate_id, r.content)


def illinois_search_proxy(inmate_id=None, first_name=None, last_name=None):
  """ Searches the Illinois DOC website for this inmate's ID and parses out some information from the result page. """

  if inmate_id:
    return [_search_inmate_id(inmate_id)]
  elif last_name:
    return _search_list(first_name, last_name)
  else:
    return None
