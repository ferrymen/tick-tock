#!/bin/bash

# Start in tasks/ even if run from root directory
# $0: **\*\tasks\publish.sh
# "$(dirname "$0")": **\*\tasks\
cd "$(dirname "$0")"

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the ouput is corrent
set -e

# Echo ervery command beging executed
set -x

# Go to root
cd ..
root_path=$PWD

# -n: string non empty
if [ -n "$(git status --porcelain)" ]; then
  echo "Your git status is not clean. Aborting.";
  exit 1;
fi

# Go!
./node_modules/.bin/lerna publish --independent "$@"

# Pause
read -p "Press enter to continue..."