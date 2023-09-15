#!/bin/bash

#################################
#Check env.sample for env reference
#Usage:   
#     For local  -->  ./run.sh
#     For EC2    -->  sudo ./run.sh
###################################

source .env
yarn dev
