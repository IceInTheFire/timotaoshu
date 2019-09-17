#!/bin/bash
if [ ! -n "$1" ] ;then
    echo "use: ./start.sh {dev|product}"
else
	cd `dirname $0`
	cd ./adminApi
	npm run $1
	cd ./ivew-admin
	npm run $1
	cd ./h5
	npm run $1
fi