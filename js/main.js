// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

(() => {
    let canvas = null;
    let opengl = null;

    const init = () => {
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);

        opengl = canvas.getContext("webgl2");

        update();
    };

    const update = () => {
        requestAnimationFrame(update);

        const width = window.innerWidth;
        if(width !== opengl.canvas.width) {
            opengl.canvas.width = width;
        }
        const height = window.innerHeight;
        if(height !== opengl.canvas.height) {
            opengl.canvas.height = height;
        }

        opengl.viewport(0, 0, opengl.canvas.width, opengl.canvas.height);
        opengl.clearColor(0, 0, 0, 0);
        opengl.clearDepth(1.0);
        opengl.clear(opengl.COLOR_BUFFER_BIT | opengl.DEPTH_BUFFER_BIT);
    };

    window.addEventListener("load", init);
})();
