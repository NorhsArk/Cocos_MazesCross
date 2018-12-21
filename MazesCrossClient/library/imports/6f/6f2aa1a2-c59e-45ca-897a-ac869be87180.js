"use strict";
cc._RF.push(module, '6f2aaGixZ5Fyol6rIab6HGA', 'TimeGift');
// Script/UI/TimeGift.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var passVal = [3, 50];
var timeVal = [2, 100];
cc.Class({
    extends: cc.Component,

    properties: {
        giftView: {
            default: null,
            type: cc.Node
        },
        giftBtn: {
            default: null,
            type: cc.Node
        },
        giftMask: {
            default: null,
            type: cc.Node
        },
        giftTip: {
            default: null,
            type: cc.Node
        },
        giftTimeText: {
            default: null,
            type: cc.Label
        },
        giftTime: {
            default: 0,
            visible: false
        },
        heartsNum: {
            default: null,
            type: cc.Label
        },
        coinsNum: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        window.timeGiftScript = this;
        SDK().getItem("giftTime", function (time) {
            time = parseInt(time);
            this.giftTime = time;
        }.bind(this));

        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.openBtn();
        }, this);
    },
    openBtn: function openBtn() {
        window.gameApplication.soundManager.playSound("btn_click");
        if (this.giftTip.active) {
            this.showTimeGiftView(1);
        }
    },
    start: function start() {
        this.checkTime(true);
    },
    showTimeGiftView: function showTimeGiftView(type) {
        console.log(type);
        var heartVal = 0;
        var coinVal = 0;
        if (type == 1) {
            heartVal = timeVal[0];
            coinVal = timeVal[1];
        } else if (type == 2) {
            heartVal = passVal[0];
            coinVal = passVal[1];
        }
        this.heartsNum.string = "+" + heartVal;
        this.coinsNum.string = "+" + coinVal;
        window.gameApplication.openGiftView(true);
        var bg = this.giftView.getChildByName("Bg");
        var later = bg.getChildByName("Later");
        var receive = bg.getChildByName("ReceiveView");
        var lightBg0 = receive.getChildByName("Light0");
        var lightBg1 = receive.getChildByName("Light1");
        var receiveBtn = receive.getChildByName("Receive");
        var doubleBtn = receive.getChildByName("Double");
        lightBg0.runAction(cc.repeatForever(cc.repeatForever(cc.rotateBy(1, 120))));
        lightBg1.runAction(cc.repeatForever(cc.rotateBy(1, 120)));
        receiveBtn.off(cc.Node.EventType.TOUCH_END);
        //接收按钮
        receiveBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");

            if (type == 1) {
                //重置时间
                this.resetTime();
            }

            //加体力
            SDK().getItem("hearts", function (Heart) {
                Heart = parseInt(Heart);
                Heart = Heart + heartVal;
                window.gameApplication.flyReward(heartVal, "heartSprite", window.mainScirpt.hearts, null);
                SDK().setItem({ hearts: Heart }, null);
                if (null != window.mainScirpt.hearts) {
                    window.mainScirpt.hearts.getComponent(cc.Label).string = Heart.toString();
                }
            }.bind(this));

            //加金币
            SDK().getItem("coins", function (Coin) {
                Coin = parseInt(Coin);
                Coin = Coin + coinVal;
                window.gameApplication.flyReward(coinVal * 0.1, "coin", window.mainScirpt.coins, null);
                SDK().setItem({ coins: Coin }, function () {
                    window.mainScirpt.refreashVal();
                });
                if (null != window.mainScirpt.coins) {
                    window.mainScirpt.coins.getComponent(cc.Label).string = Coin.toString();
                }
            }.bind(this));

            window.gameApplication.openGiftView(false);
        }, this);

        doubleBtn.off(cc.Node.EventType.TOUCH_END);
        //三倍按钮
        doubleBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            window.gameApplication.onVideoBtnClick(function (isCompleted) {
                if (isCompleted) {
                    if (type == 1) {
                        //重置时间
                        this.resetTime();
                    }

                    //加体力
                    SDK().getItem("hearts", function (Heart) {
                        Heart = parseInt(Heart);
                        Heart = Heart + heartVal * 3;
                        window.gameApplication.flyReward(heartVal * 3, "heartSprite", window.mainScirpt.hearts, null);
                        SDK().setItem({ hearts: Heart }, null);
                        if (null != window.mainScirpt.hearts) {
                            window.mainScirpt.hearts.getComponent(cc.Label).string = Heart.toString();
                        }
                    }.bind(this));

                    //加金币
                    SDK().getItem("coins", function (Coin) {
                        Coin = parseInt(Coin);
                        Coin = Coin + coinVal * 3;
                        window.gameApplication.flyReward(coinVal * 0.3, "coin", window.mainScirpt.coins, null);
                        SDK().setItem({ coins: Coin }, function () {
                            window.mainScirpt.refreashVal();
                        });
                        if (null != window.mainScirpt.coins) {
                            window.mainScirpt.coins.getComponent(cc.Label).string = Coin.toString();
                        }
                    }.bind(this));
                    window.gameApplication.openGiftView(false);
                }
            }.bind(this));
        }, this);

        later.off(cc.Node.EventType.TOUCH_END);
        later.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            window.gameApplication.openGiftView(false);
        }, this);
    },
    resetTime: function resetTime() {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        this.giftTime = timestamp;
        SDK().setItem({ giftTime: this.giftTime }, null);
    },
    checkTime: function checkTime(isStart) {
        var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
        if (timestamp - this.giftTime > 10800) {
            if (!this.giftTip.active && this.giftMask.active || isStart) {
                this.giftTip.active = true;
                this.giftMask.active = false;
                this.giftTimeText.node.active = true;
                this.giftBtn.stopAllActions();
                window.gameApplication.shake(this.giftBtn.getChildByName("Gift"));
            }
        } else {
            if (this.giftTip.active && !this.giftMask.active || isStart) {
                this.giftTip.active = false;
                this.giftTip.stopAllActions();
                this.giftMask.active = true;
                this.giftTimeText.node.active = true;
                this.giftBtn.getChildByName("Gift").stopAllActions();
                this.giftBtn.getChildByName("Gift").rotation = 0;
            }
            var temp = timestamp - this.giftTime;
            temp = 10800 - temp;
            var tempMin = temp / 60;
            var hor = 0;
            if (tempMin >= 60) {
                var count = Math.floor(tempMin / 60);
                hor = count;
                tempMin = tempMin % 60 * 60;
            }
            var min = tempMin / 60 < 10 ? "0" + Math.floor(tempMin / 60) : "" + Math.floor(tempMin / 60);
            var sec = temp % 60 < 10 ? "0" + Math.floor(temp % 60) : "" + Math.floor(temp % 60);
            if (temp <= 0) {
                min = "00";
                sec = "00";
            }
            if (hor > 0) {
                this.giftTimeText.string = hor + ":" + min + ":" + sec;
            } else {
                this.giftTimeText.string = min + ":" + sec;
            }
        }
        this.scheduleOnce(function () {
            this.checkTime(false);
        }.bind(this), 1);
    }
}

/* update(dt) {
    
}, */
);

cc._RF.pop();