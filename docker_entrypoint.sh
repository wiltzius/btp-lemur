#!/bin/bash

# change to lemur project workdir
cd /lemur/lemur
# run migrations
python manage.py migrate
