#!/bin/sh -x

for dep in $(jq --raw-output '.dependencies|keys|@sh' package.json | xargs); do
    main=node_modules/$dep/$(jq --raw-output .main node_modules/$dep/package.json)
    mkdir --parents out/$(dirname $dep) && ln --force $main out/$dep.js
done

tsc --project src --outDir out
echo "import(browser.runtime.getURL('upscale.js'))" > out/content.js
convert -transparent white src/icon.svg out/icon.png

for browser do (cd out && zip --recurse-paths ../pixelUP-$browser .) done
