// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var signal = signal || {};

(() => {
    let gamepad = null;
    let isPointerLocked = false;
    const keymap = {
        w: false,
        a: false,
        s: false,
        d: false
    };
    const mousemove = [];

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
            mousemove.push({mx: mx, my: my});
            ev.preventDefault();
        });
    };

    const poll = () => {
        const sig = {
            lx: 0,
            ly: 0,
            rx: 0,
            ry: 0
        };
        if(gamepad) {
            const gamepads = navigator.getGamepads();
            gamepad = gamepads[gamepad.index];
            sig.lx = Math.trunc(gamepad.axes[0] * 4) / 4;
            sig.ly = Math.trunc(gamepad.axes[1] * 4) / 4;
            sig.rx = Math.trunc(gamepad.axes[2] * 4) / 4;
            sig.ry = Math.trunc(gamepad.axes[3] * 4) / 4;
        }
        if(keymap.w || keymap.a || keymap.s || keymap.d) {
            sig.lx = (keymap.a ? -1 : 0) + (keymap.d ? +1 : 0);
            sig.ly = (keymap.w ? -1 : 0) + (keymap.s ? +1 : 0);
        }
        if(mousemove.length > 0) {
            sig.rx = 0;
            sig.ry = 0;
            for(const m of mousemove) {
                sig.rx += m.mx;
                sig.ry += m.my;
            }
            mousemove.length = 0;
        }
        return sig;
    };

    signal.setup = setup;
    signal.poll = poll;
})();
