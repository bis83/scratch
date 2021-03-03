// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

(() => {
    let st = store.create();

    const setup = () => {
        canvas.setup();
        signal.setup();
        update();
    };

    const update = () => {
        const si = signal.poll();
        st = logic(si, st);
        canvas.render(st);
        requestAnimationFrame(update);
    };

    window.addEventListener("load", setup);
})();
