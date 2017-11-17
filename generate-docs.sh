#!/usr/bin/env bash

echo '{"plugins": ["plugins/markdown"]}' > jsdoc.tmp.json
mv client/bundle.js client/bundle.notjs
jsdoc -c jsdoc.tmp.json -d docs client/*.js server/*.js
mv client/bundle.notjs client/bundle.js
rm jsdoc.tmp.json

# copy docs/ to client/docs/ to make it easy to view from the cloud server
cp -R docs client/

