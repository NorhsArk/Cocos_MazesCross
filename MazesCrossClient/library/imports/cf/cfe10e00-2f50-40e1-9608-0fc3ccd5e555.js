"use strict";
cc._RF.push(module, 'cfe104AL1BA4ZYID8PM1eVV', 'Enemy');
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