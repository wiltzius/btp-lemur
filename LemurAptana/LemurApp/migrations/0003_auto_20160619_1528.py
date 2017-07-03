# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LemurApp', '0002_facility_otherrestrictions'),
    ]

    operations = [
        migrations.CreateModel(
            name='LemurSettingsStore',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('settingName', models.CharField(unique=True, max_length=250)),
                ('settingValue', models.CharField(max_length=250)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AlterField(
            model_name='facility',
            name='otherRestrictions',
            field=models.CharField(default='', max_length=250, verbose_name='Other Restrictions', blank=True),
        ),
    ]
