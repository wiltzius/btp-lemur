import requests


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