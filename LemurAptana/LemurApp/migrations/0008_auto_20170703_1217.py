# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_stores_from_fixture(apps, schema_editor):
  from django.core.management import call_command
  call_command("loaddata", "basic_data")
  Inmate = apps.get_model('LemurApp', 'Inmate')
  Facility = apps.get_model('LemurApp', 'Facility')
  facilities = Facility.objects.all()
  for x in range(20):
    i = Inmate(first_name='Some',
               last_name='Body',
               inmate_id='X%05d' % x,
               facility=facilities[x] if x != 0 else Facility.objects.get(pk=1),
               address='123 Somewhere St, Someplace CA 94110' if x == 0 else '')
    i.save()


class Migration(migrations.Migration):
  dependencies = [
    ('LemurApp', '0007_auto_20170704_1446'),
  ]

  operations = [
    migrations.RunPython(load_stores_from_fixture),
  ]
