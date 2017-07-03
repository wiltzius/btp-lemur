# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations


def load_stores_from_fixture(apps, schema_editor):
  from django.core.management import call_command
  call_command("loaddata", "initial_data")


class Migration(migrations.Migration):
  dependencies = [
    ('LemurApp', '0005_inmate_inmate_doc_id'),
  ]

  operations = [
    migrations.RunPython(load_stores_from_fixture),
  ]
