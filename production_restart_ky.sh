#!/bin/bash

# run common ops
./production_restart.sh
# restart the server's fcgi service
sudo initctl restart lemur-fcgi-ky
