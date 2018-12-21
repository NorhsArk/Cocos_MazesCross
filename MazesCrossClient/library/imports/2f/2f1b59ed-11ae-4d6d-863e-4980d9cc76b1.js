"use strict";
cc._RF.push(module, '2f1b5ntEa5NbYY+SYDZzHax', 'ZoominForever1');
// Script/UI/Common/ZoominForever1.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.48, 1.25, 1.25), cc.delayTime(0.38), cc.scaleTo(0.78, 1, 1), cc.delayTime(0.68)));
        this.node.runAction(seq);
    }
});

cc._RF.pop();