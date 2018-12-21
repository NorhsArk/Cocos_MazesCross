"use strict";
cc._RF.push(module, '0bfed705u9G85RWvZFfoZtO', 'ZoominForever');
// Script/UI/Common/ZoominForever.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad: function onLoad() {
        var seq = cc.repeatForever(cc.sequence(cc.scaleTo(0.88, 1.1, 1.1), cc.scaleTo(0.88, 0.9, 0.9)));
        this.node.runAction(seq);
    }
});

cc._RF.pop();