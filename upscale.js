const video = document.getElementsByTagName('video')[0];
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { alpha: false });

let width, height, size;
(onresize = video.onfullscreenchange = () => {
    width = canvas.width = video.offsetWidth;
    height = canvas.height = Math.floor(video.videoHeight * width / video.videoWidth);
    size = width * height * 4;
})();
video.style.visibility = 'hidden';
canvas.style.position = 'absolute';
video.after(canvas);

(function step() {
    ctx.drawImage(video, 0, 0, width, height);
    let frame = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < size; i += 4) frame.data[i] = 255;
    ctx.putImageData(frame, 0, 0);
    requestAnimationFrame(step);
})();