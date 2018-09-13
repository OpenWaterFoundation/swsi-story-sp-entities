#!/bin/sh
#
# Script to create the uploadable site
# - implement cache-busting as appropriate to ensure that changed files force a reload

# Call the main script and tell it to just prep for upload but don't upload

./copy-to-owf-amazon-s3.sh prep-upload
