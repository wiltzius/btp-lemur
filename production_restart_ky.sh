#!/bin/bash

# source virtualenv
source ~btpky/lemur/btp-lemur/BTPKYENV/bin/activate
# run common ops
./production_restart.sh
# restart the server's fcgi service
sudo initctl restart lemur-fcgi-ky
