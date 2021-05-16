'use strict';

const toggle = document.getElementById('toggle');
toggle.onchange = () => browser.storage.local.set({ enabled: toggle.checked });
browser.storage.local.get('enabled').then(({ enabled }) => toggle.checked = enabled);
