const options = {
  enabled: true,
};

type Options = typeof options;

import './webextension-polyfill.js';

export default new Proxy(Object.assign(options, await browser.storage.local.get()), {
  set: <Key extends keyof Options>(_: Options, key: Key, value: Options[Key]) =>
    !void browser.storage.local.set({ [key]: (options[key] = value) }),
});

export const watchers: { [Key in keyof Options]?: (value: Options[Key]) => void } = {};
const handleOptionChange = <Key extends keyof Options>(key: Key, value: Options[Key]) =>
  (watchers[key] as ((_: typeof value) => void) | undefined)?.((options[key] = value));

browser.storage.onChanged.addListener((changes) =>
  Object.entries(changes).forEach(([key, { newValue }]) =>
    handleOptionChange(key as keyof Options, newValue)
  )
);
