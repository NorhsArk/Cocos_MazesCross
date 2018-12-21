"use strict";
cc._RF.push(module, 'fb6faggz8ZGIIj857YwdZTb', 'RotationForever');
// Script/UI/Common/RotationForever.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var seq = cc.repeatForever(cc.rotateBy(0.3, 90));
        this.node.runAction(seq);
    }
});

cc._RF.pop();