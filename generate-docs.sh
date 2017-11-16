#!/usr/bin/env bash

echo '{"plugins": ["plugins/markdown"]}' > jsdoc.tmp.json
jsdoc -c jsdoc.tmp.json -d docs client/*.js server/*.js
rm jsdoc.tmp.json

# copy docs/ to client/docs/ to make it easy to view from the cloud server
cp -R docs client/

