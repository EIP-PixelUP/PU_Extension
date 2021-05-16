'use strict';


function startUpscaling(video) {
    if (video.canvas) return;

    const canvas = video.canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { alpha: false });
    canvas.style.position = 'absolute';
    video.style.visibility = 'hidden';
    video.after(canvas);

    let width, height, size;
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
            let frame = context.getImageData(0, 0, width, height);
            for (let i = 0; i < size; i += 4) frame.data[i] = 255;
            context.putImageData(frame, 0, 0);
        }
    })();
}

function stopUpscaling(video) {
    if (!video.canvas) return;

    video.resizeObserver.disconnect();
    delete video.resizeObserver;
    video.style.visibility = '';
    video.canvas.remove();
    delete video.canvas;
}


const mutationObserver = new MutationObserver(mutations => {
    mutations.forEach(({ removedNodes, addedNodes }) => {
        removedNodes.forEach(node => {
            if (node.nodeName === 'VIDEO')
                stopUpscaling(node);
        });
        addedNodes.forEach(node => {
            if (node.nodeName === 'VIDEO')
                startUpscaling(node);
        });
    });
});


function toggleUpscaling(enable) {
    mutationObserver[enable ? 'observe' : 'disconnect'](document, { subtree: true, childList: true });
    [].forEach.call(document.getElementsByTagName('video'), enable ? startUpscaling : stopUpscaling);
}

browser.storage.local.get('enabled').then(({ enabled }) => toggleUpscaling(enabled));
browser.storage.onChanged.addListener(changes => {
    for (const [key, { newValue }] of Object.entries(changes))
        switch (key) {
            case 'enabled': toggleUpscaling(newValue); break;
        }
});
