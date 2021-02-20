// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var viewport = viewport || {};

(() => {
    let gamepad = null;
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
        window.addEventListener("gamepadconnected", (ev) => {
            gamepad = ev.gamepad;
        });
        window.addEventListener("gamepaddisconnected", (ev) => {
            if(gamepad === ev.gamepad) {
                gamepad = null;
            }
        });
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
        azimuth  = azimuth - mx;
        altitude = Math.max(Math.min(altitude - my, 90), -90);
    };

    const updatePosition = (mx, my) => {
        const d = vec3.fromValues(mx, 0, my);
        vec3.rotateY(d, d, vec3.fromValues(0, 0, 0), azimuth * Math.PI / 180);
        vec3.add(position, position, d);
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

        if(gamepad) {
            const gamepads = navigator.getGamepads();
            gamepad = gamepads[gamepad.index];
            {
                const mx = Math.trunc(gamepad.axes[0] * 4) / 4;
                const my = Math.trunc(gamepad.axes[1] * 4) / 4;
                updatePosition(mx, my);
            }
            {
                const mx = Math.trunc(gamepad.axes[2] * 4) / 4;
                const my = Math.trunc(gamepad.axes[3] * 4) / 4;
                updateAngle(mx, my);
            }
        }
        if(keymap.w) {
            updatePosition(0, -1);
        }
        if(keymap.a) {
            updatePosition(-1, 0);
        }
        if(keymap.s) {
            updatePosition(0, +1);
        }
        if(keymap.d) {
            updatePosition(+1, 0);
        }

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
