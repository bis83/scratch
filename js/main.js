// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

(() => {
    const setup = () => {
        canvas.setup();
        actor.setup();
        world.setup();
        update();
    };

    const update = () => {
        world.update();
        actor.update();
        canvas.render(actor, world);
        requestAnimationFrame(update);
    };

    window.addEventListener("load", setup);
})();
