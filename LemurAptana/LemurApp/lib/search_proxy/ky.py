import re

import requests
from bs4 import BeautifulSoup


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