const video = document.getElementsByTagName('video')[0];
video.style.visibility = 'hidden';
const ratio = video.videoHeight / video.videoWidth;

const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
const ctx = canvas.getContext('2d', { alpha: false });

let width, height, size;
function resize() {
    width = canvas.width = video.offsetWidth;
    height = canvas.height = Math.floor(width * ratio);
    size = width * height * 4;
}

new ResizeObserver(resize).observe(video), resize();
video.after(canvas);

(function step() {
    requestAnimationFrame(step);

    if (width && height) {
        ctx.drawImage(video, 0, 0, width, height);
        let frame = ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < size; i += 4) frame.data[i] = 255;
        ctx.putImageData(frame, 0, 0);
    }
})();
