#!/bin/bash

# rebuild client asset bundle
webpack
# collect static files for django (including client asset bundle)
./manage.py collectstatic
# run any django migrations
./manage.py migrate
# restart the server's fcgi service
sudo initctl restart lemur-fcgi   # TODO this doesn't work for KY
