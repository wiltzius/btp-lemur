#!/bin/bash

# install python deps
pip install -r requirements.txt
# install any dependencies
yarn
# rebuild client asset bundle
webpack
# collect static files for django (including client asset bundle)
./manage.py collectstatic
# run any django migrations
./manage.py migrate
