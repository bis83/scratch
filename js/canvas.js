// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var canvas = canvas || {};

(() => {
    let gl = null;

    const VS_SOURCE = `#version 300 es
    uniform float uX;
    uniform float uZ;
    uniform float uAlpha;
    uniform mat4 uWorld;
    uniform mat4 uViewProjection;
    out vec4 vColor;
    void main() {
        float x = 2.0 * (uX + ((gl_VertexID & 0x1) == 0 ? 0.0 : 1.0));
        float z = 2.0 * (uZ + ((gl_VertexID & 0x2) == 0 ? 0.0 : 1.0));
        gl_Position = uViewProjection * uWorld * vec4(x, 0, z, 1);
        float u = (gl_VertexID & 0x1) == 0 ? 0.0 : 1.0;
        float v = (gl_VertexID & 0x2) == 0 ? 0.0 : 1.0;
        vColor = vec4(u * uAlpha, v * uAlpha, 0, 1);
    }`;
    const FS_SOURCE = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 finalColor;
    void main() {
        finalColor = vColor;
    }`;

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

    const fovy = Math.PI / 5;
    const nearPlane = 0.1;
    const farPlane = 2000.0;
    const eyeHeight = 1.5;

    const viewMatrix = (st) => {
        const pos = vec3.fromValues(st.actor.x, eyeHeight, st.actor.z);
        const rot = quat.create();
        quat.fromEuler(rot, st.actor.altitude, st.actor.azimuth, 0);
        const v = mat4.create();
        mat4.fromRotationTranslation(v, rot, pos);
        mat4.invert(v, v);
        return v;
    };

    const projectionMatrix = (aspect) => {
        const p = mat4.create();
        mat4.perspective(p, fovy, aspect, nearPlane, farPlane);
        return p;
    };
    
    const viewProjection = (st, aspect) => {
        const m = mat4.create();
        mat4.multiply(m, projectionMatrix(aspect), viewMatrix(st));
        return m;
    };

    let prog = null;
    let uX = null;
    let uZ = null;
    let uAlpha = null;
    let uWorld = null;
    let uViewProjection = null;

    const setup = () => {
        const canvas = document.createElement("canvas");
        document.body.appendChild(canvas);
        gl = canvas.getContext("webgl2");

        prog = createProgram(
            createShader(gl.VERTEX_SHADER, VS_SOURCE),
            createShader(gl.FRAGMENT_SHADER, FS_SOURCE));
        uX = gl.getUniformLocation(prog, "uX");
        uZ = gl.getUniformLocation(prog, "uZ");
        uAlpha = gl.getUniformLocation(prog, "uAlpha");
        uWorld = gl.getUniformLocation(prog, "uWorld");
        uViewProjection = gl.getUniformLocation(prog, "uViewProjection");
    };

    const render = (st) => {
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
        gl.uniformMatrix4fv(uViewProjection, false, viewProjection(st, aspect));
        for(const floor of st.floors) {
            gl.uniform1f(uX, floor.x);
            gl.uniform1f(uZ, floor.z);
            gl.uniform1f(uAlpha, 1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
    };

    canvas.setup = setup;
    canvas.render = render;
})();
