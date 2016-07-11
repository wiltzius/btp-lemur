# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import datetime
from server.LemurApp.models.inmate import InmateIDField


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='BannerMessage',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('message', models.CharField(unique=True, max_length=250)),
                ('handle', models.IntegerField(unique=True, verbose_name=b'Handle (leave this as 1!)')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Book',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('asin', models.CharField(max_length=13, null=True, verbose_name=b'ISBN', blank=True)),
                ('title', models.CharField(max_length=250, verbose_name=b'Title')),
                ('author', models.CharField(max_length=250, verbose_name=b'Author', blank=True)),
                ('creation_date', models.DateTimeField(default=datetime.datetime.now, verbose_name=b'Creation date', editable=False)),
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
                ('restrictsHardbacks', models.BooleanField(default=False, verbose_name=b'This facility restricts hardbacks')),
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
                ('inmate_id', InmateIDField(max_length=250, unique=True, null=True, verbose_name=b'Inmate ID')),
                ('first_name', models.CharField(max_length=250, verbose_name=b'First name')),
                ('last_name', models.CharField(max_length=250, verbose_name=b'Last name')),
                ('address', models.CharField(max_length=250, null=True, verbose_name=b'Address', blank=True)),
                ('creation_date', models.DateTimeField(default=datetime.datetime.now, editable=False)),
                ('facility', models.ForeignKey(to='Facility')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('status', models.CharField(default=b'OPEN', max_length=6, verbose_name=b'Order status', choices=[(b'SENT', b'Sent'), (b'OPEN', b'Open')])),
                ('date_opened', models.DateTimeField(default=datetime.datetime.now, verbose_name=b'Date opened', editable=False)),
                ('date_closed', models.DateTimeField(null=True, verbose_name=b'Date closed', blank=True)),
                ('sender', models.CharField(max_length=250, null=True, verbose_name=b'Sender', blank=True)),
                ('inmate', models.ForeignKey(verbose_name=b'Inmate', to='Inmate')),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='book',
            name='order',
            field=models.ForeignKey(to='Order'),
            preserve_default=True,
        ),
    ]
