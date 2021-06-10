import options from './options.js';
const toggle = document.getElementById('toggle') as HTMLInputElement;
toggle.onchange = () => (options.enabled = toggle.checked);
toggle.checked = options.enabled;
