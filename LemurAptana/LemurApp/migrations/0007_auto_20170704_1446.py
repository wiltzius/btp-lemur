# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LemurApp', '0005_inmate_inmate_doc_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='facility',
            name='address',
            field=models.CharField(max_length=250, blank=True, default=""),
        ),
        migrations.AlterField(
            model_name='book',
            name='order',
            field=models.ForeignKey(related_name='books', to='LemurApp.Order'),
        ),
        migrations.AlterField(
            model_name='order',
            name='inmate',
            field=models.ForeignKey(verbose_name='Inmate', related_name='orders', to='LemurApp.Inmate'),
        ),
    ]
