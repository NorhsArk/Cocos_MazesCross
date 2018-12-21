(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/Const/globals.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f774aa2KJxEp68y3WRvT7GZ', 'globals', __filename);
// Script/Const/globals.js

"use strict";

window.SDK = require("../SDK/facebook"); //平台SDK
window.playTimesAD = 2;
window.isDebug = false;
window.lineWidth = 6;
window.plusHelp = 5; //看完广告后，获得的帮助数量
window.openAllLevel = false;

window.langArr = ["English", "Português", "El español", "भारत गणराज्य", "中文"];
window.nameArr = ['en', 'pt', 'es', 'in', 'zh'];

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
        //# sourceMappingURL=globals.js.map
        