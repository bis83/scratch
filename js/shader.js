// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var shader = shader || {};

(() => {
    const VS_SOURCE = `#version 300 es
    uniform mat4 uWorld;
    uniform mat4 uViewProjection;
    void main() {
        float x = (gl_VertexID & 0x1) == 0 ? -0.5 : +0.5;
        float y = (gl_VertexID & 0x2) == 0 ? -0.5 : +0.5;
        gl_Position = uViewProjection * uWorld * vec4(x, y, 0, 1);
    }`;
    const FS_SOURCE = `#version 300 es
    precision mediump float;
    out vec4 finalColor;
    void main() {
        finalColor = vec4(1, 1, 1, 1);
    }`;

    let prog = null;
    let uWorld = null;
    let uViewProjection = null;

    const createShader = (opengl, type, source) => {
        const shader = opengl.createShader(type);
        opengl.shaderSource(shader, source);
        opengl.compileShader(shader);
        const success = opengl.getShaderParameter(shader, opengl.COMPILE_STATUS);
        if(!success) {
            console.log(opengl.getShaderInfoLog(shader));
            opengl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const createProgram = (opengl, vertexShader, fragmentShader) => {
        const program = opengl.createProgram();
        opengl.attachShader(program, vertexShader);
        opengl.attachShader(program, fragmentShader);
        opengl.linkProgram(program);
        const success = opengl.getProgramParameter(program, opengl.LINK_STATUS);
        if(!success) {
            console.log(opengl.getProgramInfoLog(program));
            opengl.deleteProgram(program);
            return null;
        }
        return program;
    };

    const setup = (opengl) => {
        if(!prog) {
            prog = createProgram(opengl,
                createShader(opengl, opengl.VERTEX_SHADER, VS_SOURCE),
                createShader(opengl, opengl.FRAGMENT_SHADER, FS_SOURCE));
            uWorld = opengl.getUniformLocation(prog, "uWorld");
            uViewProjection = opengl.getUniformLocation(prog, "uViewProjection");
        }
    };

    const render = (opengl, viewport, mesh) => {
        setup(opengl);

        opengl.useProgram(prog);
        opengl.uniformMatrix4fv(uWorld, false, mat4.create());
        opengl.uniformMatrix4fv(uViewProjection, false, viewport.viewProjection());
        opengl.drawArrays(opengl.TRIANGLE_STRIP, 0, 4);
    };

    shader.render = render;
})();
