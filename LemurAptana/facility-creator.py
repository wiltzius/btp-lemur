#!/usr/bin/env python
import os

from . import settings
# from django.core.management import setup_environ
#
# setup_environ(settings)     # This needs to be done before the model import below (we need a Django environment in order to import Django models)
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'
import django
django.setup()
from .LemurApp import models

faclist = ["Big Muddy River",
"Centralia",
"Crossroads ATC",
"Danville",
"Decatur",
"Decatur ATC",
"Dixon",
"Dwight",
"East Moline",
"Fox Valley ATC",
"Graham",
"Greenville Federal",
"Hill",
"Illinois River",
"Jacksonville",
"Lawrence",
"Lincoln",
"Logan",
"Marion Federal",
"Menard",
"North Lawndale ATC",
"Pekin Federal",
"Peoria ATC",
"Pinckneyville",
"Pontiac",
"Robinson",
"Shawnee",
"Sheridan",
"Southern Illinois ATC",
"Southwestern Illinois",
"Stateville",
"Tamms",
"Taylorville",
"Vandalia",
"Vienna",
"West Side ATC",
"Western Illinois"]

for fac in faclist:
    facility = models.Facility()
    facility.name = fac
    facility.save()
    