// Copyright (c) bis83. Distributed under the MIT License.
"use strict";

const logicActorMoveAngle = (si, st) => {
    st.actor.azimuth  = (((Math.trunc(100 * (st.actor.azimuth - si.rx)) % 36000) + 36000) % 36000) / 100;
    st.actor.altitude = Math.max(Math.min(st.actor.altitude - si.ry, 90), -90);
    return st;
};

const logicActorMovePosition = (si, st) => {
    const moveSpeed = 0.1;
    const d = vec2.fromValues(si.lx, si.ly);
    vec2.normalize(d, d);
    vec2.scale(d, d, moveSpeed);
    vec2.rotate(d, d, vec2.fromValues(0, 0), -st.actor.azimuth * Math.PI / 180);
    st.actor.x += d[0];
    st.actor.z += d[1];
    return st;
};

const logicActorCorrectPosition = (st) => {
    // todo:
    return st;
};

const logicActorMove = (si, st) => {
    st = logicActorMoveAngle(si, st);
    st = logicActorMovePosition(si, st);
    st = logicActorCorrectPosition(st);
    return st;
};

const logic = (si, st) => {
    st = logicActorMove(si, st);
    return st;
};
