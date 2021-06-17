#!/bin/bash

echo "Packaging extension for Firefox..."

web-ext --version > /dev/null || (echo "You need to install web-ext first" && exit 1)

cd out || (echo "Couldn't find the 'out' directory, try to build first." && exit 1)

path=`web-ext build --overwrite-dest`
