"use strict";
cc._RF.push(module, '961c4S3IrNHB4M+zHyOMk6f', 'LoadingView');
// Script/UI/LoadingView.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        gameApplication: {
            default: null,
            type: Object
        }
    },

    onLoad: function onLoad() {
        this.gameApplication = cc.find("GameApplication").getComponent("GameApplication");
    },

    start: function start() {
        if (typeof bid !== 'undefined' && typeof mid !== 'undefined' && typeof lid !== 'undefined') {
            this.gameApplication.openLevelView(bid, mid);
        }
    },
    onPlayBtnClicked: function onPlayBtnClicked() {
        cc.log("onPlayBtnClicked");

        this.gameApplication.openMainView();
        this.gameApplication.soundManager.playSound("btn_click");
    }
}

// setProgress:function(node,progress){
//     node.string = progress + "%";
// }
// update (dt) {},
);

cc._RF.pop();