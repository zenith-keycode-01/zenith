#!/bin/bash

#################################

# Usage:   ./deploy.sh

###################################

#######################################
# Funciton for generic printing
# ARGUMENTS:  colour code
# OUTPUTS  :  Prints echo message
#######################################
function log(){
    message=$1
    colour=$2
    echo -e "\033[1;"$colour"m$message\033[0m"
}

log "Pulling from branch main" 33

git pull origin main

log  "Running yarn install" 33 
yarn install
log "Now execute run.sh to run the application" 32

