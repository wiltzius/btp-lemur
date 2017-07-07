from unittest import TestCase

from LemurAptana.LemurApp.lib.search_proxy.il import illinois_search_proxy


class SearchProxyTests(TestCase):

  def test_il_single(self):
    results = illinois_search_proxy(inmate_id='N91569')
    assert set({
      'inmate_id': 'N91569',
      'first_name': 'JOHN L.',
      'last_name': 'JONES',
      'paroled_date': '06/30/2017',
      'parent_institution': 'STATEVILLE CORRECTIONAL CENTER'
    }.items()) < set(results[0].items())

  def test_il_multi(self):
    results = illinois_search_proxy(last_name='jones', first_name='john')
    assert len(results) > 2
