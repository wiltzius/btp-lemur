#!/bin/bash

# rebuild client asset bundle
webpack
# collect static files for django (including client asset bundle)
./manage.py collectstatic
# run any django migrations
./manage.py migrate
# restart the server's fcgi service
sudo initctl status lemur-fcgi