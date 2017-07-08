# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations

_facilities = {
  'Calloway County Jail',
  'Fulton County Jail'
  'Manchester Federal Correctional Institution',
  'Wallens Ridge State Prison',
  'Roederer Assessment Cntr'
}


def generate_faciltiies(apps, schema_editor):
  Facility = apps.get_model('LemurApp', 'Facility')
  for facility_name in _facilities:
    f = Facility(name=facility_name)
    f.save()


class Migration(migrations.Migration):
  dependencies = [
    ('LemurApp', '0008_auto_20170703_1217'),
  ]

  operations = [
    migrations.RunPython(generate_faciltiies)
  ]
