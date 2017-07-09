#!/bin/bash

# source virtualenv
source ~books2pr/lemur/BTPENV/bin/activate
# run common ops
./production_restart.sh
# restart the server's fcgi service
sudo initctl restart lemur-fcgi
