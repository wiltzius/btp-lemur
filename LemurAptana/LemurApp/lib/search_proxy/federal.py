import requests


def federal_search_proxy(inmate_id=None, first_name=None, last_name=None):
  # the federal API requires either a first/last name or an inmate ID, so if we're missing that don't even bother
  if not (inmate_id or (first_name and last_name)):
    print('early out')
    return None
  res = requests.post('https://www.bop.gov/PublicInfo/execute/inmateloc',
                      data={
                        # TODO find a way to limit to 10 results, not 100
                        'todo': 'query',
                        'output': 'json',
                        'inmateNumType': 'IRN',
                        'inmateNum': inmate_id,
                        'nameFirst': first_name,
                        'nameLast': last_name
                      }).json()
  if res.get('InmateLocator'):
    return [{
      'projected_parole': inmate_data.get('projRelDate'),
      'parent_institution': inmate_data.get('faclName'),
      'paroled_date': inmate_data.get('actRelDate'),
      'last_name': inmate_data.get('nameLast'),
      'first_name': inmate_data.get('nameFirst'),
      'inmate_id': inmate_data.get('inmateNum')
    } for inmate_data in res['InmateLocator']]
  else:
    return None
