interface Video extends HTMLVideoElement {
  canvas?: HTMLCanvasElement;
  resizeObserver?: ResizeObserver;
}

const startUpscaling = (video: Video) => {
  if (video.canvas) return;

  const canvas = (video.canvas = document.createElement('canvas'));
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const context = canvas.getContext('2d', { alpha: false })!;
  canvas.style.position = 'absolute';
  video.style.visibility = 'hidden';
  video.after(canvas);

  let [width, height, size] = [0, 0, 0];
  (video.resizeObserver = new ResizeObserver(() => {
    width = canvas.width = video.offsetWidth;
    height = canvas.height = video.offsetHeight;
    size = width * height * 4;
  })).observe(video);

  (function step() {
    if (!video.canvas) return;
    requestAnimationFrame(step);

    if (width && height) {
      context.drawImage(video, 0, 0, width, height);
      const frame = context.getImageData(0, 0, width, height);
      for (let i = 0; i < size; i += 4) frame.data[i] = 255;
      context.putImageData(frame, 0, 0);
    }
  })();
};

const stopUpscaling = (video: Video) => {
  video.resizeObserver?.disconnect();
  delete video.resizeObserver;
  video.style.visibility = '';
  video.canvas?.remove();
  delete video.canvas;
};

const isVideo = (node: Node): node is Video => node.nodeName === 'VIDEO';
const mutationObserver = new MutationObserver((mutations) => {
  mutations.forEach(({ removedNodes, addedNodes }) => {
    [...removedNodes].filter(isVideo).forEach(stopUpscaling);
    [...addedNodes].filter(isVideo).forEach(startUpscaling);
  });
});

import options, { watchers } from './options.js';
(watchers.enabled = (enable) => {
  mutationObserver[enable ? 'observe' : 'disconnect'](document, { subtree: true, childList: true });
  [...document.getElementsByTagName('video')].forEach(enable ? startUpscaling : stopUpscaling);
})(options.enabled);
