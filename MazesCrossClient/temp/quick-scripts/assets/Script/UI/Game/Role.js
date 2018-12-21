(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/Game/Role.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '01249Rk7stLqpgK0u1Ta5FD', 'Role', __filename);
// Script/UI/Game/Role.js

"use strict";

var HexCell = require("./HexCell");

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        },
        die: {
            default: null,
            type: cc.Node
        },
        arrowNode: {
            default: null,
            type: cc.Node
        },
        leftNode: {
            default: null,
            type: cc.Node
        },
        rightNode: {
            default: null,
            type: cc.Node
        },
        bottomNode: {
            default: null,
            type: cc.Node
        },
        topNode: {
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
        },
        gameView: {
            default: null
        },
        darkNode: {
            default: null,
            type: cc.Node
        }

    },

    onLoad: function onLoad() {},

    start: function start() {},
    init: function init() {
        this.bg.active = true;
        this.die.active = false;
    },


    onCollisionEnter: function onCollisionEnter(other, self) {
        if (this.gameView != null) {
            //cc.log("other.node:",other.node)
            //cc.log("other.node.opacity:",other.node.opacity)
            if (other.node != null && other.node.opacity > 0 && other.node.active) {
                this.gameView.collisionCallback();
            }
        }
    },

    setDark: function setDark(isDark) {
        this.darkNode.active = isDark;
    },


    /**
    * 显示箭头
    */
    setArrow: function setArrow(t, l, d, r) {
        //寻找
        this.topNode.active = t;
        this.bottomNode.active = d;
        this.leftNode.active = l;
        this.rightNode.active = r;

        this.arrowNode.active = true;
    },
    hideArrow: function hideArrow() {
        this.arrowNode.active = false;
    },


    /**
    * 死亡
    */
    playDie: function playDie(cb) {
        var self = this;
        this.bg.active = true;
        this.die.active = false;
        this.die.setContentSize(cc.size(100, 100));

        this.blinking(this.bg, function () {
            self.bg.active = false;
            self.die.active = true;
            self.blinking(self.die, function () {
                self.die.setContentSize(cc.size(180, 180));
                self.blinking(self.die, function () {
                    self.scheduleOnce(function () {
                        self.die.runAction(cc.fadeOut(0.2));
                    }, 0.1);
                });
            });
        });
    },
    blinking: function blinking(node, cb) {
        var a1 = cc.delayTime(0.12);
        var a2 = cc.fadeOut(0.01);
        var a3 = cc.delayTime(0.1);
        var a4 = cc.fadeIn(0.01);
        var b1 = cc.callFunc(function () {
            if (cb) {
                cb();
            }
        });

        var seq = cc.repeat(cc.sequence(a1, a2, a3, a4), 2);
        node.stopAllActions();
        node.runAction(cc.sequence(seq, b1));
    },


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
        //# sourceMappingURL=Role.js.map
        