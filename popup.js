// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  // use `url` here inside the callback because it's asynchronous!
  var currentDiv = document.getElementById('anchre');
  //var y = document.createElement("p");
  //y.textContent = url;
  //document.body.insertBefore(y, currentDiv);
  
  //var test = document.createElement("p");
  //test.textContent = url.slice(0, 24) + "embed/" + url.slice(32);
  //document.body.insertBefore(test, y);

  var x = document.createElement("iframe");
  x.width = "560";
  x.height = "315";
  x.src = url.slice(0, 24) + "embed/" + url.slice(32);
  x.frameborder = "0";
  x.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  x.allowfullscreen = true;
  document.body.insertBefore(x, currentDiv);
});
