# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
import LemurAptana.LemurApp.models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BannerMessage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.CharField(unique=True, max_length=250)),
                ('handle', models.IntegerField(unique=True, verbose_name='Handle (leave this as 1!)')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('asin', models.CharField(max_length=13, null=True, verbose_name='ISBN', blank=True)),
                ('title', models.CharField(max_length=250, verbose_name='Title')),
                ('author', models.CharField(max_length=250, verbose_name='Author', blank=True)),
                ('creation_date', models.DateTimeField(default=datetime.datetime.now, verbose_name='Creation date', editable=False)),
            ],
            options={
                'ordering': ['-creation_date'],
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Facility',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(unique=True, max_length=250)),
                ('restrictsHardbacks', models.BooleanField(default=False, verbose_name='This facility restricts hardbacks')),
            ],
            options={
                'ordering': ['name'],
                'verbose_name_plural': 'Facilities',
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Inmate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('inmate_id', LemurAptana.LemurApp.models.InmateIDField(max_length=250, unique=True, null=True, verbose_name='Inmate ID')),
                ('first_name', models.CharField(max_length=250, verbose_name='First name')),
                ('last_name', models.CharField(max_length=250, verbose_name='Last name')),
                ('address', models.CharField(max_length=250, null=True, verbose_name='Address', blank=True)),
                ('creation_date', models.DateTimeField(default=datetime.datetime.now, editable=False)),
                ('facility', models.ForeignKey(to='LemurApp.Facility')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.CharField(default='OPEN', max_length=6, verbose_name='Order status', choices=[('SENT', 'Sent'), ('OPEN', 'Open')])),
                ('date_opened', models.DateTimeField(default=datetime.datetime.now, verbose_name='Date opened', editable=False)),
                ('date_closed', models.DateTimeField(null=True, verbose_name='Date closed', blank=True)),
                ('sender', models.CharField(max_length=250, null=True, verbose_name='Sender', blank=True)),
                ('inmate', models.ForeignKey(verbose_name='Inmate', to='LemurApp.Inmate')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='book',
            name='order',
            field=models.ForeignKey(to='LemurApp.Order'),
            preserve_default=True,
        ),
    ]
