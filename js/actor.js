// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var actor = actor || {};

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

    const fovy = Math.PI / 5;
    const nearPlane = 0.1;
    const farPlane = 2000.0;
    const eyeHeight = 1.5;

    let azimuth = 0;    // degree
    let altitude = 0;   // degree
    let posX = 65;
    let posZ = 65;

    const setup = () => {
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
            isPointerLocked = document.pointerLockElement === document.body;
            ev.preventDefault();
        });
        document.body.addEventListener("click", (ev) => {
            if(!isPointerLocked) {
                document.body.requestPointerLock();
            }
            ev.preventDefault();
        });
        document.body.addEventListener("mousemove", (ev) => {
            if(!isPointerLocked) {
                return;
            }
            const mouseSensitivity = 0.1;
            const mx = ev.movementX * mouseSensitivity;
            const my = ev.movementY * mouseSensitivity;
            updateAngle(mx, my);
            ev.preventDefault();
        });
    };

    const updateAngle = (mx, my) => {
        azimuth  = (((Math.trunc(100 * (azimuth - mx)) % 36000) + 36000) % 36000) / 100;
        altitude = Math.max(Math.min(altitude - my, 90), -90);
    };

    const updatePosition = (mx, my) => {
        const moveSpeed = 0.1;
        const d = vec2.fromValues(mx, my);
        vec2.normalize(d, d);
        vec2.scale(d, d, moveSpeed);
        vec2.rotate(d, d, vec2.fromValues(0, 0), -azimuth * Math.PI / 180);
        posX += d[0];
        posZ += d[1];
    };

    const updateByController = () => {
        if(gamepad) {
            const gamepads = navigator.getGamepads();
            gamepad = gamepads[gamepad.index];
            const lx = Math.trunc(gamepad.axes[0] * 4) / 4;
            const ly = Math.trunc(gamepad.axes[1] * 4) / 4;
            updatePosition(lx, ly);
            const rx = Math.trunc(gamepad.axes[2] * 4) / 4;
            const ry = Math.trunc(gamepad.axes[3] * 4) / 4;
            updateAngle(rx, ry);
        }
        if(keymap.w || keymap.a || keymap.s || keymap.d) {
            const mx = (keymap.a ? -1 : 0) + (keymap.d ? +1 : 0);
            const my = (keymap.w ? -1 : 0) + (keymap.s ? +1 : 0);
            updatePosition(mx, my);
        }
    };

    const step = () => {
        updateByController();
    };

    const viewMatrix = () => {
        const pos = vec3.fromValues(posX, eyeHeight, posZ);
        const rot = quat.create();
        quat.fromEuler(rot, altitude, azimuth, 0);
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

    const viewProjection = (aspect) => {
        const m = mat4.create();
        mat4.multiply(m, projectionMatrix(aspect), viewMatrix());
        return m;
    };

    actor.setup = setup;
    actor.step = step;
    actor.viewProjection = viewProjection;
})();
