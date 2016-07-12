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
        pid_number = unicode(bs.find(string=re.compile(inmate.inmate_id))).split('/')[0].strip()
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

    # TODO -- if "Inmate Not Found" is in the body of the page, raise a 404

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
