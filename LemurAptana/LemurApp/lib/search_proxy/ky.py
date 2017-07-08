import re
from multiprocessing.dummy import Pool

import requests
from bs4 import BeautifulSoup

from LemurAptana.LemurApp.models import Inmate

# there's a string embedded in the page of the format "(1) / (2)" where 2 is the inmate DOC number and 1 is the
# "PID", which the site uses as their identifier
matcher = re.compile(r'\s+(?P<pid>\d+)\s+/\s+(?P<doc>\d{6})')


def _search_inmate_list(first_name=None, last_name=None, inmate_id=None):
  kool_url = "http://kool.corrections.ky.gov/"
  params = {
    "returnResults": True,
  }
  if first_name:
    params['firstName'] = first_name
  if last_name:
    params['lastName'] = last_name
  if inmate_id:
    params['DOC'] = inmate_id
  r1 = requests.get(kool_url, params)
  bs = BeautifulSoup(r1.content, "html.parser")

  pid_numbers = [matcher.match(matched).groupdict()['pid'] for matched in bs.find_all(string=matcher)]
  return pid_numbers


def _search_pid(pid_number):
  kool_detail_url = "http://kool.corrections.ky.gov/KOOL/Details/%s" % pid_number
  r2 = requests.get(kool_detail_url)

  b2 = BeautifulSoup(r2.content, "html.parser")

  results = {
    "projected_parole": None,
    "paroled_date": None,
    "parent_institution": None,
    "last_name": '',
    "first_name": '',
    "ky_pid": pid_number,
    "inmate_id": ''
  }

  try:
    inmate_id = matcher.match(b2.find(string=matcher)).groupdict()['doc']
    results['inmate_id'] = inmate_id
  except AttributeError:
    pass

  # first the inmate name
  try:
    name = next(b2.find(string=re.compile('Name:'))
                .find_parent('td')
                .find_next_sibling('td')
                .stripped_strings)
    results["last_name"], results["first_name"] = name.split(',')
  except AttributeError:
    pass

  try:
    # try to parse the parent institution
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

  # string any lingering whitespace
  return {k: v.strip() if v else v for k, v in results.items()}


def kentucky_search_by_id(inmate_id):
  """ Searches the Kentucky DOC site (KOOL) and parses some information for the result page """
  if not inmate_id:
    return None
  else:
    # TODO move this caching logic outside of the library so this stays "pure" of Django
    try:
      inmate = Inmate.objects.get(inmate_id=inmate_id)
      if not inmate.inmate_doc_id:
        results = _search_inmate_list(inmate_id=inmate_id)
        if results:
          assert len(results) is 1
          inmate.inmate_doc_id = results[0]
          inmate.save()
      return _search_pid(inmate.inmate_doc_id)
    except Inmate.DoesNotExist:
      results = _search_inmate_list(inmate_id=inmate_id)
      if results:
        assert len(results) is 1
        return _search_pid(results[0])
      else:
        return None


def kentucky_search_proxy(first_name=None, last_name=None, inmate_id=None):
  if not any([inmate_id, last_name, first_name]):
    return []
  if inmate_id:
    res = kentucky_search_by_id(inmate_id)
    return [res] if res else []
  else:
    pids = _search_inmate_list(first_name=first_name, last_name=last_name)
    print(pids)
    if not pids:
      return []
    pids = pids[:10]  # don't bother with more than 10 results
    with Pool(len(pids)) as p:
      return p.map(_search_pid, pids)
