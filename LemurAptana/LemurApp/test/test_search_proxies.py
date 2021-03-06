import json

from django.test import TestCase, Client

from LemurAptana.LemurApp.lib.search_proxy.federal import federal_search_proxy
from LemurAptana.LemurApp.lib.search_proxy.il import illinois_search_proxy
from LemurAptana.LemurApp.lib.search_proxy.ky import kentucky_search_proxy


class SearchProxyTests(TestCase):
  """ These tests kinda suck because they're 'live' but hey, at least they're testing the real thing. """

  def test_il_single(self):
    results = illinois_search_proxy(inmate_id='N91569')
    assert set({
      'inmate_id': 'N91569',
      'first_name': 'JOHN L.',
      'last_name': 'JONES',
      'paroled_date': '06/30/2017',
      'parent_institution': 'STATEVILLE CORRECTIONAL CENTER'
    }.items()) <= set(results[0].items())

  def test_il_multi(self):
    results = illinois_search_proxy(last_name='jones', first_name='john')
    assert len(results) > 2

  def test_il_notfound_id(self):
    results = illinois_search_proxy(inmate_id='X12345')
    assert not results

  def test_il_notfound_name(self):
    results = illinois_search_proxy(first_name='asldkfl', last_name='xkljsdfd')
    assert not results

  def test_federal_multi(self):
    results = federal_search_proxy(first_name='John', last_name='Jones')
    assert len(results) > 2

  def test_federal_single(self):
    results = federal_search_proxy(inmate_id='03032-007')
    assert set({
                 'inmate_id': '03032-007',
                 'first_name': 'JOHN',
                 'last_name': 'JONES',
                 'paroled_date': '',
                 'projected_parole': 'LIFE',
                 'parent_institution': 'Canaan'
               }.items()) <= set(results[0].items())

  def test_federal_notfound_id(self):
    results = federal_search_proxy(inmate_id='12345670')
    assert not results

  def test_federal_notfound_name(self):
    results = federal_search_proxy(first_name='asldkfl', last_name='xkljsdfd')
    assert not results

  def test_kentucky_multi(self):
    results = kentucky_search_proxy(first_name='John', last_name='Smith')
    assert len(results) > 2

  def test_kentucky_single(self):
    results = kentucky_search_proxy(inmate_id='190902')
    assert set({
                 'inmate_id': '190902',
                 'first_name': 'ALICIA LEANN',
                 'last_name': 'JONES',
                 'paroled_date': None,
                 'projected_parole': '5/28/2020',
                 'parent_institution': 'McCracken County Jail'
               }.items()) <= set(results[0].items())

  def test_kentucky_notfound_id(self):
    results = kentucky_search_proxy(inmate_id='12345670')
    assert not results

  def test_kentucky_notfound_name(self):
    results = kentucky_search_proxy(first_name='asldkfl', last_name='xkljsdfd')
    assert not results

  def test_inmate_autocomplete_id(self):
    """ Integration test to make sure the entire autocomplete view works. """
    client = Client()
    res = client.post('/lemur/inmate/doc_autocomplete/', data={'inmate_id': '285034'})
    assert len(json.loads(res.content)['proxy_search_results']) == 1

  def test_inmate_autocomplete_name(self):
    """ Integration test to make sure the entire autocomplete view works. """
    client = Client()
    res = client.post('/lemur/inmate/doc_autocomplete/', data={'last_name': 'smith', 'first_name': 'jack'})
    assert len(json.loads(res.content)['proxy_search_results']) >= 3
