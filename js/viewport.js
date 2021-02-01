// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var viewport = viewport || {};

(() => {
    const matrix = mat4.create();

    const update = (opengl) => {
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

        const v = mat4.create();
        mat4.lookAt(v, vec3.fromValues(-2, 0, -2), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
        const p = mat4.create();
        mat4.perspective(p, Math.PI / 4, width / height, 0.01, 1000.0);
        mat4.multiply(matrix, p, v);
    };

    const viewProjection = () => {
        return matrix;
    };

    viewport.update = update;
    viewport.viewProjection = viewProjection;
})();
