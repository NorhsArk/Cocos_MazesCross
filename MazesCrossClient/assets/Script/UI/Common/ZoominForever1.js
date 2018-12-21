
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        var seq = cc.repeatForever(
             cc.sequence(
                 cc.scaleTo(0.48,1.25, 1.25),
                 cc.delayTime(0.38),
                 cc.scaleTo(0.78,1, 1),
                 cc.delayTime(0.68),
             ));
        this.node.runAction(seq);
    },
}); 
