(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/Game/Enemy.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'cfe104AL1BA4ZYID8PM1eVV', 'Enemy', __filename);
// Script/UI/Game/Enemy.js

"use strict";

var HexCell = require("./HexCell");

cc.Class({
    extends: cc.Component,

    properties: {
        emeny: {
            default: null,
            type: cc.Node
        },
        _axialCoordinate: {
            default: cc.v2(0, 0),
            visible: false
        },
        axialCoordinate: {
            get: function get() {
                return this._axialCoordinate;
            },
            set: function set(val) {
                this._axialCoordinate = cc.v2(val.x, val.y);
            }
        }
    },

    onLoad: function onLoad() {},

    start: function start() {},

    /**
    * 移动
    */
    moveTo: function moveTo() {}
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
        //# sourceMappingURL=Enemy.js.map
        