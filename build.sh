#!/bin/sh -x

for dep in $(jq --raw-output '.dependencies|keys|@sh' package.json | xargs); do
    main=node_modules/$dep/$(jq --raw-output .main node_modules/$dep/package.json)
    mkdir --parents out/$(dirname $dep) && ln --force $main out/$dep.js
done

tsc --project src --outDir out
echo "import(browser.runtime.getURL('upscale.js'))" > out/content.js
convert -transparent white src/icon.svg out/icon.png
web-ext build --source-dir out --artifacts-dir . --overwrite-dest

for browser do case $browser in
    *) echo "Signing extensions for $browser is not supported yet" >&2
esac done
