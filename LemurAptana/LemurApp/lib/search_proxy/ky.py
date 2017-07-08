import re
from multiprocessing.dummy import Pool

import requests
from bs4 import BeautifulSoup

from LemurAptana.LemurApp.models import Inmate


def _search_inmate_list(first_name=None, last_name=None, inmate_id=None):
  kool_url = "http://kool.corrections.ky.gov/"
  r1 = requests.get(kool_url, {
    "returnResults": True,
    "DOC": inmate_id,
    "lastName": last_name,
    "firstName": first_name
  })
  bs = BeautifulSoup(r1.content, "html.parser")

  # there's a string embedded in the page of the format "(1) / (2)" where 2 is the inmate DOC number and 1 is the
  # "PID", which the site uses as their identifier
  matcher = re.compile(r'(?P<pid>\d*) / (?P<doc>\d{6})')
  pid_numbers = [matcher.match(matched) for matched in bs.find_all(string=matcher)]
  return pid_numbers


def _search_detail(pid_number):
  kool_detail_url = "http://kool.corrections.ky.gov/KOOL/Details/%s" % pid_number
  r2 = requests.get(kool_detail_url)

  b2 = BeautifulSoup(r2.content, "html.parser")

  results = {
    "projected_parole": None,
    "paroled_date": None,
    "parent_institution": None,
    "last_name": None,
    "first_name": None,
    "ky_pid": pid_number
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


def kentucky_search_by_id(inmate_id):
  """ Searches the Kentucky DOC site (KOOL) and parses some information for the result page """
  if not inmate_id:
    return None
  else:
    # TODO move this caching logic outside of the library so this stays "pure" of Django
    inmate = Inmate.objects.get(inmate_id=inmate_id)
    if inmate:
      if not inmate.inmate_doc_id:
        results = _search_inmate_list(inmate_id=inmate_id)
        if results:
          assert len(results) is 1
          inmate.inmate_doc_id = results[0]
          inmate.save()
      return _search_detail(inmate.inmate_doc_id)
    else:
      results = _search_inmate_list(inmate_id=inmate_id)
      if results:
        assert len(results) is 1
        return _search_detail(results[0])
      else:
        return None


def kentucky_search_proxy(first_name=None, last_name=None, inmate_id=None):
  if not any([inmate_id, last_name, first_name]):
    return []
  if inmate_id:
    kentucky_search_by_id(inmate_id)
  else:
    pids = _search_inmate_list(first_name=first_name, last_name=last_name)
    pids = pids[:10]  # don't bother with more than 10 results
    with Pool(len(pids)) as p:
      return p.map(_search_detail, pids)
