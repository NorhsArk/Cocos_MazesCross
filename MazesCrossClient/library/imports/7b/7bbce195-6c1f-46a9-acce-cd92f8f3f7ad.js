"use strict";
cc._RF.push(module, '7bbceGVbB9GqazOzZL48/et', 'sdk_ad');
// Script/SDK/script/sdk_ad.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        adSprite: {
            default: null,
            type: cc.Sprite
        },
        pic: {
            default: ""
        },
        game_id: {
            default: ""
        },
        hasAd: false

    },

    onLoad: function onLoad() {},
    show: function show() {

        // this.node.active = true;
        if (this.node != null) {
            this.node.setPosition(cc.v2(0, 0));
        }
    },
    setAd: function setAd(pic, game_id) {
        if (this.node == null || this.adSprite == null) {
            return;
        }
        this.pic = pic;
        this.game_id = game_id;

        // console.log("setAd:",this.pic,this.game_id);

        //加载图片，设置图片。
        var self = this;
        var remoteUrl = this.pic;
        // console.log("remoteUrl:",remoteUrl)
        // cc.loader.load({url: remoteUrl, type: 'png'}, function (err, texture) {

        cc.loader.load(remoteUrl, function (err, texture) {
            // console.log("err:",err)
            // console.log("texture:",texture)
            // console.log("self.adSprite:",self.adSprite)
            // var winSize = cc.director.getWinSize();
            // var w = winSize.width - 50;
            self.adSprite.spriteFrame = new cc.SpriteFrame(texture);
            // self.adSprite.node.setContentSize(cc.size(w,w));
        });

        this.hasAd = true;
        // this.show();
    },
    onCloseBtnClicked: function onCloseBtnClicked() {
        // this.node.active = false;
        this.node.setPosition(cc.v2(1500, 1500));
        SDK().reLoadOpAd();
        SDK().stat(2, this.game_id);
    },
    onPlayBtnClicked: function onPlayBtnClicked() {
        this.onCloseBtnClicked();
        SDK().switchGameAsync(this.game_id);
    }
});

cc._RF.pop();