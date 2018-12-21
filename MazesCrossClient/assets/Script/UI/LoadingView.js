cc.Class({
    extends: cc.Component,

    properties: {
        gameApplication:{
            default:null,
            type:Object
        }  
    },

    onLoad: function () {
        this.gameApplication = cc.find("GameApplication").getComponent("GameApplication");
    },

    start () {
        if (typeof bid !== 'undefined' && typeof mid !== 'undefined' && typeof lid !== 'undefined') {
            this.gameApplication.openLevelView(bid,mid);
        }
    },

    onPlayBtnClicked(){
        cc.log("onPlayBtnClicked");

        this.gameApplication.openMainView();
        this.gameApplication.soundManager.playSound("btn_click");
    },

    // setProgress:function(node,progress){
    //     node.string = progress + "%";
    // }
    // update (dt) {},
});
