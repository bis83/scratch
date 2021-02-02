// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var viewport = viewport || {};

(() => {
    let isPointerLocked = false;
    const keymap = {
        w: false,
        a: false,
        s: false,
        d: false,
        space: false
    };

    let azimuth = 0;    // degree
    let altitude = 0;   // degree
    const position = vec3.fromValues(0, 1.5, 0);
    const matrix = mat4.create();

    const setup = (opengl) => {
        document.addEventListener("keydown", (ev) => {
            if(!isPointerLocked) {
                return;
            }
            switch(ev.code) {
                case "KeyW": keymap.w = true; break;
                case "KeyA": keymap.a = true; break;
                case "KeyS": keymap.s = true; break;
                case "KeyD": keymap.d = true; break;
                case "Space": keymap.space = true; break;
            }
            ev.preventDefault();
        });
        document.addEventListener("keyup", (ev) => {
            if(!isPointerLocked) {
                return;
            }
            switch(ev.code) {
                case "KeyW": keymap.w = false; break;
                case "KeyA": keymap.a = false; break;
                case "KeyS": keymap.s = false; break;
                case "KeyD": keymap.d = false; break;
                case "Space": keymap.space = false; break;
            }
            ev.preventDefault();
        });
        document.addEventListener("pointerlockchange", (ev) => {
            isPointerLocked = document.pointerLockElement === opengl.canvas;
            ev.preventDefault();
        });
        opengl.canvas.addEventListener("click", (ev) => {
            if(!isPointerLocked) {
                opengl.canvas.requestPointerLock();
            }
            ev.preventDefault();
        });
        opengl.canvas.addEventListener("mousemove", (ev) => {
            if(!isPointerLocked) {
                return;
            }
            const mx = ev.movementX;
            const my = ev.movementY;
            updateAngle(mx, my);
            ev.preventDefault();
        });
    };

    const updateAngle = (mx, my) => {
        // fixme:
        azimuth += -mx / 10.0;
        altitude += -my / 10.0;
        if(altitude > 90) {
            altitude = 90;
        }
        if(altitude < -90) {
            altitude = -90;
        }
    };

    const updatePosition = () => {
        // fixme:
        if(keymap.w) {
            const d = vec3.fromValues(0, 0, -1);
            vec3.rotateY(d, d, vec3.fromValues(0, 0, 0), azimuth * Math.PI / 180);
            vec3.add(position, position, d);
        }
        if(keymap.a) {
            const d = vec3.fromValues(-1, 0, 0);
            vec3.rotateY(d, d, vec3.fromValues(0, 0, 0), azimuth * Math.PI / 180);
            vec3.add(position, position, d);
        }
        if(keymap.s) {
            const d = vec3.fromValues(0, 0, 1);
            vec3.rotateY(d, d, vec3.fromValues(0, 0, 0), azimuth * Math.PI / 180);
            vec3.add(position, position, d);
        }
        if(keymap.d) {
            const d = vec3.fromValues(1, 0, 0);
            vec3.rotateY(d, d, vec3.fromValues(0, 0, 0), azimuth * Math.PI / 180);
            vec3.add(position, position, d);
        }
    };

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

        updatePosition();

        const v = mat4.create();
        const q = quat.create();
        quat.fromEuler(q, altitude, azimuth, 0);   // fixme:
        mat4.fromRotationTranslation(v, q, position);
        mat4.invert(v, v);

        const p = mat4.create();
        mat4.perspective(p, Math.PI / 4, width / height, 0.01, 1000.0);
        mat4.multiply(matrix, p, v);
    };

    const viewProjection = () => {
        return matrix;
    };

    viewport.setup = setup;
    viewport.update = update;
    viewport.viewProjection = viewProjection;
})();
