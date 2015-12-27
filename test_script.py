import re

import requests
from bs4 import BeautifulSoup

IL_DOC_SEARCH_URL = "http://www.idoc.state.il.us/subsections/search/ISinms2.asp"

params = {
    "selectlist1": "IDOC",
    "idoc": "B83935"
}

r = requests.post(IL_DOC_SEARCH_URL, params)

bs = BeautifulSoup(r.content, "html.parser")

results = {}

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

print results
