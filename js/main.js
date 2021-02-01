// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

(() => {
    let canvas = null;
    let opengl = null;

    const setup = () => {
        canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        opengl = canvas.getContext("webgl2");
        update();
    };

    const update = () => {
        viewport.update(opengl);
        shader.render(opengl, viewport, mesh);
        requestAnimationFrame(update);
    };

    window.addEventListener("load", setup);
})();
