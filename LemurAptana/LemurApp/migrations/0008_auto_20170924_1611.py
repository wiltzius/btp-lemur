# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('LemurApp', '0007_auto_20170704_1446'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='notes',
            field=models.CharField(verbose_name='Notes', max_length=2048, blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='order',
            name='status',
            field=models.CharField(verbose_name='Order status', max_length=20, default='OPEN', choices=[('SENT', 'Sent'), ('OPEN', 'Open'), ('RETURNED', 'Returned')]),
        ),
    ]
