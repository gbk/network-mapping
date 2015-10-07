#!/bin/bash

webpack --config webpack.config.js

rm -rf dist
cp -r src dist

rm -f dist.zip
zip -r dist.zip dist

rm -f dist.crx
/opt/google/chrome/google-chrome --pack-extension=dist
rm -f dist.pem

rm -rf dist
