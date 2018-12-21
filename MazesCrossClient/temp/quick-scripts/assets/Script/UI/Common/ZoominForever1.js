(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/Common/ZoominForever1.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2f1b5ntEa5NbYY+SYDZzHax', 'ZoominForever1', __filename);
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
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=ZoominForever1.js.map
        