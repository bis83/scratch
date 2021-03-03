// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

var store = store || {};

(() => {
    const create = () => {
        return {
            actor: {
                x: 65,          // world-x
                z: 65,          // world-z
                azimuth: 0,     // degree
                altitude: 0,    // degree
            },
            floors: [
                {x: 30, z: 30},
                {x: 30, z: 31},
                {x: 30, z: 32},
                {x: 30, z: 33},
                {x: 31, z: 30},
                {x: 31, z: 31},
                {x: 31, z: 32},
                {x: 31, z: 33},
                {x: 32, z: 30},
                {x: 32, z: 31},
                {x: 32, z: 32},
                {x: 32, z: 33},
                {x: 33, z: 30},
                {x: 33, z: 31},
                {x: 33, z: 32},
                {x: 33, z: 33},
            ],
            objects: []
        };
    };

    store.create = create;
})();
