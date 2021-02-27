// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var canvas = canvas || {};

(() => {
    let gl = null;

    const VS_SOURCE = `#version 300 es
    uniform float uHeight;
    uniform mat4 uWorld;
    uniform mat4 uViewProjection;
    out vec4 vColor;
    void main() {
        float x = (gl_VertexID & 0x1) == 0 ? -50.0 : +50.0;
        float z = (gl_VertexID & 0x2) == 0 ? -50.0 : +50.0;
        gl_Position = uViewProjection * uWorld * vec4(x, uHeight, z, 1);
        vColor = vec4(
            (gl_VertexID & 0x1) == 0 ? 0.0 : 1.0,   // r
            0,                                      // g
            (gl_VertexID & 0x2) == 0 ? 0.0 : 1.0,   // b
            1);                                     // a
    }`;
    const FS_SOURCE = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 finalColor;
    void main() {
        finalColor = vColor;
    }`;

    let prog = null;
    let uHeight = null;
    let uWorld = null;
    let uViewProjection = null;

    const createShader = (type, source) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if(!success) {
            console.log(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };

    const createProgram = (vertexShader, fragmentShader) => {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if(!success) {
            console.log(gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    };

    const setup = () => {
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        gl = canvas.getContext("webgl2");

        prog = createProgram(
            createShader(gl.VERTEX_SHADER, VS_SOURCE),
            createShader(gl.FRAGMENT_SHADER, FS_SOURCE));
        uHeight = gl.getUniformLocation(prog, "uHeight");
        uWorld = gl.getUniformLocation(prog, "uWorld");
        uViewProjection = gl.getUniformLocation(prog, "uViewProjection");
    };

    const render = (actor, world) => {
        const width = window.innerWidth;
        if(width !== gl.canvas.width) {
            gl.canvas.width = width;
        }
        const height = window.innerHeight;
        if(height !== gl.canvas.height) {
            gl.canvas.height = height;
        }
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const aspect = width / height;

        gl.useProgram(prog);
        gl.uniformMatrix4fv(uWorld, false, mat4.create());
        gl.uniformMatrix4fv(uViewProjection, false, actor.viewProjection(aspect));
        gl.uniform1f(uHeight, 0.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        gl.uniform1f(uHeight, 3.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    canvas.setup = setup;
    canvas.render = render;
})();
