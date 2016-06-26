# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LemurApp', '0004_auto_20160619_1543'),
    ]

    operations = [
        migrations.AddField(
            model_name='inmate',
            name='inmate_doc_id',
            field=models.CharField(default=b'', max_length=250, verbose_name=b'Inmate DOC ID', blank=True),
            preserve_default=True,
        ),
    ]
