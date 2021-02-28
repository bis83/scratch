// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var world = world || {};

(() => {
    const sx = 64;
    const sz = 64;

    const floor = Array.from({length: sx * sz}, (v, i) => null);

    const setup = () => {
        for(let i=28; i<36; ++i) {
            for(let j=28; j<36; ++j) {
                floor[i + j * sx] = {
                    type: "floor"
                };
            }
        }
    };

    const step = () => {  
    };

    const sizeX = () => {
        return sx;
    };

    const sizeZ = () => {
        return sz;
    };

    const at = (x, z) => {
        return floor[x + z * sx];
    };

    world.setup = setup;
    world.step = step;
    world.sizeX = sizeX;
    world.sizeZ = sizeZ;
    world.at = at;
})();
