(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/GameLogic/Player.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'e32198K/PFAYI3D//JNhj6H', 'Player', __filename);
// Script/GameLogic/Player.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        age: {
            default: 0,
            type: cc.Integer
        },
        avatar: {
            default: ""
        },
        group_id: {
            default: 0,
            type: cc.Integer
        },
        is_rebot: {
            default: 0,
            type: cc.Integer
        },
        pname: {
            default: ""
        },
        score: {
            default: 0,
            type: cc.Integer
        },
        sex: {
            default: 0,
            type: cc.Integer
        },
        user_id: {
            default: 0,
            type: cc.Integer
        }
    },

    setUserInfo: function setUserInfo(userInfo) {
        this.age = userInfo.age;
        this.avatar = userInfo.avatar;
        this.group_id = userInfo.group_id;
        this.is_rebot = userInfo.is_rebot;
        this.pname = this.substrName(userInfo.name, 6);
        this.score = userInfo.score;
        this.sex = userInfo.sex;
        this.user_id = userInfo.user_id;
    },

    substrName: function substrName(str, n) {
        if (str.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
            return str;
        } else {
            var len = 0;
            var tmpStr = "";
            for (var i = 0; i < str.length; i++) {
                //遍历字符串
                if (/[\u4e00-\u9fa5]/.test(str[i])) {
                    //中文 长度为两字节
                    len += 2;
                } else {
                    len += 1;
                }
                if (len > n) {
                    break;
                } else {
                    tmpStr += str[i];
                }
            }
            return tmpStr + " ...";
        }
    }

    // update (dt) {},

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
        //# sourceMappingURL=Player.js.map
        