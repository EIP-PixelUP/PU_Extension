#!/bin/sh

for dep in $(jq --raw-output '.dependencies|keys|@sh' package.json | xargs); do
    main=node_modules/$dep/$(jq --raw-output .main node_modules/$dep/package.json)
    mkdir --parents out/$(dirname $dep) && ln --relative --symbolic --force $main out/$dep.js
done

tsc && echo "import('./upscale.js')" > out/content.js
convert -transparent white src/icon.svg out/icon.png
cd out && zip --recurse-paths ../pixelUP .
