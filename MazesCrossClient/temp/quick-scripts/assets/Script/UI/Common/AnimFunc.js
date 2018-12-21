(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/Common/AnimFunc.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '069bcLwjtNB/LYJrOEJbxa+', 'AnimFunc', __filename);
// Script/UI/Common/AnimFunc.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {},

    shake: function shake() {
        cc.log("helpBtnShake");

        var a1 = cc.rotateTo(0.1, 15);
        var a2 = cc.rotateTo(0.1, 0);
        var a3 = cc.rotateTo(0.1, -15);
        var a4 = cc.rotateTo(0.12, 0);
        var rep = cc.repeat(cc.sequence(a1, a2, a3, a4), 3);
        this.node.stopAllActions();
        this.node.runAction(rep);
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
        //# sourceMappingURL=AnimFunc.js.map
        