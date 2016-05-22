import re
import requests
from bs4 import BeautifulSoup


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
        "facility_name": None,
        "first_name": None,
        "last_name": None
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
        results["facility_name"] = next(
                bs.find(string=re.compile('Parent Institution'))
                    .find_parent('td')
                    .find_next_sibling('td')
                    .stripped_strings
        )
    except AttributeError:
        results["facility_name"] = None

    try:
        title_string = bs.find(string=re.compile(inmate_id))
        name_parts = title_string.split('-')[1].split(',')
        results["first_name"] = name_parts[-1].strip()
        results["last_name"] = name_parts[0].strip()
    except AttributeError:
        print 'attribute error'
        pass
    return results


def federal_search_proxy(inmate_id):
    """ Query the BOP site's (unauthenticated, wide-open) inmate search API.

    Note we could also pull facility information from this URL:
        https://www.bop.gov/PublicInfo/execute/phyloc
    """
    res = requests.post('https://www.bop.gov/PublicInfo/execute/inmateloc',
                        data={
                            'todo': 'query',
                            'output': 'json',
                            'inmateNumType': 'IRN',
                            'inmateNum': inmate_id
                        }).json()
    inmate_data = res['InmateLocator'][0]
    return {
        'first_name': inmate_data.get('nameFirst'),
        'projected_parole': inmate_data.get('projRelDate'),
        'facility_name': inmate_data.get('faclName'),
        'paroled_date': inmate_data.get('actRelDate')
    }
