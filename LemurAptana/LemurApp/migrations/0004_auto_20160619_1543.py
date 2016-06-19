# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


def set_order_age(apps, schema_editor):
    settingsStore = apps.get_model("LemurApp", "LemurSettingsStore")
    new_setting = settingsStore(settingName='order_age_policy', settingValue='3')
    new_setting.save()


class Migration(migrations.Migration):

    dependencies = [
        ('LemurApp', '0003_auto_20160619_1528'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lemursettingsstore',
            options={'ordering': ['settingName'], 'verbose_name_plural': 'Lemur Settings'},
        ),
        migrations.RunPython(set_order_age)
    ]
