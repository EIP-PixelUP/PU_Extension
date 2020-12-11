const video = document.getElementsByTagName('video')[0];
video.style.visibility = 'hidden';

const swap = document.createElement('button');
swap.style.position = 'fixed';
swap.textContent = 'show original';
video.parentElement.parentElement.after(swap);

XbrWasm.ready.then(() => {
    const xbrwasm = new XbrWasm(video, 3); // Scaling factor of 3
    const canvas = xbrwasm.destCanvas;
    canvas.style.position = 'absolute'
    video.after(canvas);

    function resize() {
        canvas.style.width = video.style.width;
        canvas.style.height = video.style.height;
    }
    new ResizeObserver(resize).observe(video), resize();

    let original = false;
    swap.onclick = () => {
        original = !original;

        if (original) {
            video.style.visibility = '';
            canvas.style.visibility = 'hidden';
            swap.textContent = 'show upscaled';
        } else {
            video.style.visibility = 'hidden';
            canvas.style.visibility = '';
            swap.textContent = 'show original';
        }
    }

    (function step() {
        xbrwasm.draw();
        requestAnimationFrame(step);
    })();
});
