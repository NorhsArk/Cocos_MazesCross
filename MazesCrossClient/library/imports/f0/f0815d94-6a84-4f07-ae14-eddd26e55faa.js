"use strict";
cc._RF.push(module, 'f08152UaoRPB64U7d0m5V+q', 'GameApplication');
// Script/GameLogic/GameApplication.js

"use strict";

var _constants = require("constants");

var SoundManager = require("../GameLogic/SoundManager");

cc.Class({
    extends: cc.Component,

    properties: {
        soundManager: {
            default: null,
            type: SoundManager
        },
        missions: {
            default: []
        },
        missionsCB: {
            default: []
        },
        conf: {
            default: {}
        },
        confCB: {
            default: []
        },
        createShortcuted: {
            default: 0,
            type: cc.Integer
        },
        effectView: {
            default: null,
            type: cc.Node
        },
        StepView: {
            default: null,
            type: cc.Node,
            visible: false
        },
        StepView_prefab: {
            default: null,
            type: cc.Prefab
        },
        HeartView: {
            default: null,
            type: cc.Node,
            visible: false
        },
        HeartView_prefab: {
            default: null,
            type: cc.Prefab
        },
        CoinView: {
            default: null,
            type: cc.Node,
            visible: false
        },
        CoinView_prefab: {
            default: null,
            type: cc.Prefab
        },
        SharaView: {
            default: null,
            type: cc.Node,
            visible: false
        },
        SharaView_prefab: {
            default: null,
            type: cc.Prefab
        },
        fbView_prefab: {
            default: null,
            type: cc.Prefab
        },
        _playTimes: {
            default: 0,
            type: cc.Integer
        },
        playTimes: {
            get: function get() {
                return this._playTimes;
            },
            set: function set(val) {
                this._playTimes = val;

                SDK().plusPlayTimes();
            }
        },
        uiAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        rewardList: {
            default: [],
            type: [cc.Node],
            visible: false
        }
    },

    //起始值，位移量，时间，回调
    lerpACtion: function lerpACtion(start, disVal, time, callback) {
        if (this.agent == null) {
            this.agent = new cc.Node("agent");
        }
        this.agent.stopAllActions();
        var ob = this.agent;
        if (start != null) {
            ob.x = start;
        }
        var repeatTime = time / 0.02;
        var repeatVal = disVal / repeatTime;
        ob.runAction(cc.repeat(cc.sequence(cc.callFunc(function () {
            callback(ob);
        }.bind(this), this), cc.moveBy(0.02, cc.v2(repeatVal, 0))), repeatTime + 1));
    },
    start: function start() {
        SDK().getItem("curLang", function (idx) {
            if (idx == null) {
                idx = 0;
            }
            this.setLanguage(window.nameArr[idx]);
        }.bind(this));
        SDK().init();
    },
    getConf: function getConf(path, cb) {

        if (this.conf[path] != null) {
            if (cb) {
                // cc.log("从cache读取："+path)
                cb(this.conf[path]);
            }
        } else {
            // cc.log("从硬盘读取："+path)
            cc.loader.loadRes(path, function (err, results) {
                this.conf[path] = results;
                if (cb != null) {
                    cb(results);
                }
            }.bind(this));
        }
    },
    onLoad: function onLoad() {
        window.gameApplication = this;
        var manager = cc.director.getCollisionManager();
        manager.enabled = true;
        manager.enabledDebugDraw = false;
        manager.enabledDrawBoundingBox = false;

        //Load Json
        cc.loader.loadRes("conf/missions", function (err, results) {
            this.missions = results;
            this.invokeMissionCB();
        }.bind(this));

        this.openMainView();
        //cc.game.addPersistRootNode(this.node);
        this.curShowIdx = 0;
    },
    onDestroy: function onDestroy() {
        cc.director.getCollisionManager().enabled = false;
    },
    setLanguage: function setLanguage(language) {
        var i18n = require('LanguageData');
        i18n.init(language);
    },
    getMissions: function getMissions(cb) {

        if (this.missions != null && this.missions.length > 0) {
            cb(this.missions);
        } else {
            this.missionsCB.push(cb);
        }
    },
    invokeMissionCB: function invokeMissionCB() {
        var self = this;
        if (this.missionsCB.length > 0) {
            this.missionsCB.forEach(function (cb) {
                if (cb != null) {
                    cb(self.missions);
                }
            });
        }
    },
    setNodeActive: function setNodeActive(nodePath, active, isPop) {
        var view = cc.find("Canvas/" + nodePath);
        if (view != null) {
            if (active) {
                view.active = active;
                if (view.name == "MainView" || view.name == "GameView") {
                    var top = cc.find("top", view);
                    if (top != null) {
                        top.active = true;
                    }
                    var goGame = cc.find("GoGame", view);
                    if (goGame != null) {
                        goGame.active = false;
                    }
                    view.runAction(cc.moveTo(0.5, cc.v2(0, 0)));
                }
                if (isPop) {
                    var Bg = cc.find("Bg", view);
                    Bg.scale = 0;
                    Bg.runAction(
                    /* cc.sequence( */
                    cc.scaleTo(0.5, 1).easing(cc.easeBounceOut(2))
                    /*     cc.callFunc(function () {
                            view.active = false;
                        }.bind(this), this) 
                    )*/
                    );
                } else {
                    view.opacity = 0;
                    view.runAction(cc.fadeIn(0.5));
                }
            } else {
                if (view.name == "MainView") {
                    var top = cc.find("top", view);
                    if (top != null) {
                        top.active = false;
                    }
                    view.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0, -cc.winSize.height)), cc.callFunc(function () {
                        view.active = true;
                    }.bind(this), this)));
                } else if (view.name == "GameView") {
                    view.runAction(cc.sequence(cc.moveTo(0.5, cc.v2(0, cc.winSize.height)), cc.callFunc(function () {
                        view.active = active;
                    }.bind(this), this)));
                }
                if (isPop) {
                    var Bg = cc.find("Bg", view);
                    Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                        view.active = false;
                    }.bind(this), this)));
                } else {
                    view.runAction(cc.fadeOut(0.5));
                }
            }
        }
    },


    openMainView: function openMainView(isReward) {
        if (window.mainScirpt != null) {
            window.mainScirpt.refreashVal();
            if (isReward) {
                this.scheduleOnce(function () {
                    window.gameApplication.flyReward(1, "starBig", window.mainScirpt.starts, null);
                }.bind(this), 1);
            }
        }
        this.setNodeActive("MainView", true);
        this.setNodeActive("GameView", false);
        this.openRankView(false);
    },

    openGameView: function openGameView() {
        this.setNodeActive("GameView", true);
        this.setNodeActive("MainView", false);
        this.openRankView(false);
    },

    openPopView: function openPopView(viewName, isOpen) {
        this.setNodeActive(viewName, isOpen, true);
    },

    openRankView: function openRankView(isOpen) {
        this.openPopView("RankView", isOpen);
    },

    openGiftView: function openGiftView(isOpen) {
        this.openPopView("GiftView", isOpen);
    },

    openSetting: function openSetting(isOpen) {
        this.openPopView("SettingView", isOpen);
    },

    //设置界面
    settingClick: function settingClick(event, type) {
        if (type == "1") {
            this.openSetting(true);
        } else if (type == "2") {
            this.openSetting(false);
        }
    },


    //显示是否观看视频的提示框
    showVideoView: function showVideoView(cb, isCount) {
        if (this.VideoView == null) {
            var view = cc.instantiate(this.VideoView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.VideoView = view;
        }
        this.VideoView.active = true;
        this.VideoView.setSiblingIndex(this.VideoView.parent.childrenCount);

        //弹出动画
        var Bg = this.VideoView.getChildByName("Bg");
        Bg.scale = 0;
        Bg.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBounceOut(2)));

        //旋转光
        var light = this.VideoView.getChildByName("Bg").getChildByName("Light");
        light.stopAllActions();
        light.runAction(cc.repeatForever(cc.rotateBy(1.1, 100)));

        var sureBtn = this.VideoView.getChildByName("Bg").getChildByName("Sure");
        var sureText = sureBtn.getChildByName("Text").getComponent(cc.Label);
        sureBtn.off(cc.Node.EventType.TOUCH_END);

        var viewCount = 0;
        this.checkDailyCount("video", false, function (val) {
            viewCount = 5 - val;
            if (viewCount > 0) {
                sureBtn.getComponent(cc.Button).interactable = true;
            } else {
                sureBtn.getComponent(cc.Button).interactable = false;
            }
            if (isCount) {
                sureText.string = "FREE(" + viewCount + ")";
            } else {
                sureText.string = "FREE";
                sureBtn.getComponent(cc.Button).interactable = true;
            }
            sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                if (viewCount > 0 || !isCount) {
                    window.gameApplication.soundManager.playSound("btn_click");
                    this.onVideoBtnClick(function (isCompleted) {
                        cb(isCompleted);
                        this.VideoView.active = !isCompleted;
                    }.bind(this), isCount);
                }
            }, this);
        }.bind(this));

        //按钮设置
        var laterBtn = this.VideoView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            cb(false);
            this.VideoView.active = false;
        }, this);
    },


    //显示是否观看视频的提示框
    showCoinView: function showCoinView(cb, isCount) {
        if (this.CoinView == null) {
            var view = cc.instantiate(this.CoinView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.CoinView = view;
        }
        this.CoinView.active = true;
        this.CoinView.setSiblingIndex(this.CoinView.parent.childrenCount);

        //弹出动画
        var Bg = this.CoinView.getChildByName("Bg");
        Bg.scale = 0;
        Bg.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBounceOut(2)));

        //旋转光
        var light = this.CoinView.getChildByName("Bg").getChildByName("Bg").getChildByName("Light");
        light.stopAllActions();
        light.runAction(cc.repeatForever(cc.rotateBy(1.1, 100)));

        //按钮设置
        var sureBtn = this.CoinView.getChildByName("Bg").getChildByName("Bg").getChildByName("Sure");
        var sureText = sureBtn.getChildByName("Text").getComponent(cc.Label);
        sureBtn.off(cc.Node.EventType.TOUCH_END);

        var viewCount = 0;
        this.checkDailyCount("coinVideo", false, function (val) {
            viewCount = 5 - val;
            if (viewCount > 0) {
                sureBtn.getComponent(cc.Button).interactable = true;
            } else {
                sureBtn.getComponent(cc.Button).interactable = false;
            }
            if (isCount) {
                sureText.string = "FREE(" + viewCount + ")";
            } else {
                sureText.string = "FREE";
                sureBtn.getComponent(cc.Button).interactable = true;
            }
            sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                if (viewCount > 0 || !isCount) {
                    window.gameApplication.soundManager.playSound("btn_click");
                    this.onVideoBtnClick(function (isCompleted) {
                        if (isCompleted) {
                            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                                this.CoinView.active = false;
                            }.bind(this), this)));
                        }
                        cb(isCompleted);
                    }.bind(this), isCount);
                }
            }, this);
        }.bind(this));

        var laterBtn = this.CoinView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            cb(false);
            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                this.CoinView.active = false;
            }.bind(this), this)));
        }, this);
    },


    //显示获取体力的提示框
    showHeartView: function showHeartView(cb, isCount) {
        if (this.HeartView == null) {
            var view = cc.instantiate(this.HeartView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.HeartView = view;
        }
        this.HeartView.active = true;
        this.HeartView.setSiblingIndex(this.HeartView.parent.childrenCount);

        //弹出动画
        var Bg = this.HeartView.getChildByName("Bg");
        Bg.scale = 0;
        Bg.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBounceOut(2)));

        //旋转光
        var light = this.HeartView.getChildByName("Bg").getChildByName("Bg").getChildByName("Light");
        light.stopAllActions();
        light.runAction(cc.repeatForever(cc.rotateBy(1.1, 100)));

        //按钮设置
        var sureBtn = this.HeartView.getChildByName("Bg").getChildByName("Bg").getChildByName("Video");
        var sureText = sureBtn.getChildByName("Text").getComponent(cc.Label);
        sureBtn.off(cc.Node.EventType.TOUCH_END);

        var viewCount = 0;
        this.checkDailyCount("heartVideo", false, function (val) {
            viewCount = 5 - val;
            if (viewCount > 0) {
                sureBtn.getComponent(cc.Button).interactable = true;
            } else {
                sureBtn.getComponent(cc.Button).interactable = false;
            }
            if (isCount) {
                sureText.string = "FREE(" + viewCount + ")";
            } else {
                sureText.string = "FREE";
                sureBtn.getComponent(cc.Button).interactable = true;
            }
            sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                if (viewCount > 0 || !isCount) {
                    window.gameApplication.soundManager.playSound("btn_click");
                    this.onVideoBtnClick(function (isCompleted) {
                        if (isCompleted) {
                            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                                this.HeartView.active = false;
                            }.bind(this), this)));
                        }
                        cb(isCompleted);
                    }.bind(this), isCount);
                }
            }, this);
        }.bind(this));

        var sureBtn1 = this.HeartView.getChildByName("Bg").getChildByName("Bg").getChildByName("Share");
        var sureText1 = sureBtn1.getChildByName("Text").getComponent(cc.Label);
        sureBtn1.off(cc.Node.EventType.TOUCH_END);

        var viewCount1 = 0;
        this.checkDailyCount("heartShare", false, function (val) {
            viewCount1 = 5 - val;
            if (viewCount1 > 0) {
                sureBtn1.getComponent(cc.Button).interactable = true;
            } else {
                sureBtn1.getComponent(cc.Button).interactable = false;
            }
            if (isCount) {
                sureText1.string = "FREE(" + viewCount1 + ")";
            } else {
                sureText1.string = "FREE";
                sureBtn1.getComponent(cc.Button).interactable = true;
            }
            sureBtn1.on(cc.Node.EventType.TOUCH_END, function (event) {
                if (viewCount1 > 0 || !isCount) {
                    window.gameApplication.soundManager.playSound("btn_click");
                    this.onShareBtnClick(function (isCompleted) {
                        if (isCompleted) {
                            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                                this.HeartView.active = false;
                            }.bind(this), this)));
                        }
                        cb(isCompleted);
                    }.bind(this), isCount);
                }
            }, this);
        }.bind(this));

        var laterBtn = this.HeartView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            cb(false);
            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                this.HeartView.active = false;
            }.bind(this), this)));
        }, this);
    },


    //显示获取体力的提示框
    showStepView: function showStepView(cb, isCount) {
        if (this.StepView == null) {
            var view = cc.instantiate(this.StepView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.StepView = view;
        }
        this.StepView.active = true;
        this.StepView.setSiblingIndex(this.StepView.parent.childrenCount);

        //弹出动画
        var Bg = this.StepView.getChildByName("Bg");
        Bg.scale = 0;
        Bg.runAction(cc.scaleTo(0.5, 1).easing(cc.easeBounceOut(2)));

        //按钮设置
        var sureBtn = this.StepView.getChildByName("Bg").getChildByName("Bg").getChildByName("Video");
        sureBtn.off(cc.Node.EventType.TOUCH_END);

        sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            this.onVideoBtnClick(function (isCompleted) {
                if (isCompleted) {
                    Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                        this.StepView.active = false;
                    }.bind(this), this)));
                }
                cb(isCompleted);
            }.bind(this), isCount);
        }, this);

        var sureBtn1 = this.StepView.getChildByName("Bg").getChildByName("Bg").getChildByName("Coin");
        sureBtn1.off(cc.Node.EventType.TOUCH_END);

        sureBtn1.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            SDK().getItem("coins", function (coin) {
                if (coin >= 100) {
                    coin = coin - 100;
                    SDK().setItem({ coins: coin });
                    cb(true);
                    Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                        this.StepView.active = false;
                    }.bind(this), this)));
                } else {
                    window.gameApplication.showCoinView(function (isCompleted) {
                        if (isCompleted) {
                            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                                this.StepView.active = false;
                            }.bind(this), this)));
                        }
                        cb(isCompleted);
                    }.bind(this), false);
                }
            }.bind(this));
        }, this);

        var laterBtn = this.StepView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            window.gameApplication.soundManager.playSound("btn_click");
            cb(false);
            Bg.runAction(cc.sequence(cc.scaleTo(0.3, 0).easing(cc.easeSineIn(2)), cc.callFunc(function () {
                this.StepView.active = false;
            }.bind(this), this)));
        }, this);
    },


    //视频奖励
    onVideoBtnClick: function onVideoBtnClick(cb, isCount) {
        SDK().showVideoAd(function (isCompleted) {
            if (null == isCompleted) {
                console.log("没有观看成功");
                this.fbFail(1);
                if (cb != null) {
                    cb(false);
                }
            } else if (isCompleted) {
                if (cb != null) {
                    cb(true);
                }
                if (isCount) {
                    this.checkDailyCount("video", true);
                }
            } else {
                console.log("没有观看成功");
                this.fbFail(1);
                if (cb != null) {
                    cb(false);
                }
            }
        }.bind(this));
    },


    //检查日常次数限制
    checkDailyCount: function checkDailyCount(key, isAdd, cb) {
        var myDate = new Date();
        var month = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
        var day = myDate.getDate(); //获取当前日(1-31)
        SDK().getItem(month + "_" + day + "_" + key, function (val) {
            if (val == null) {
                val = 0;
            }
            val = parseInt(val);
            if (isAdd) {
                val = val + 1;
                var param = {};
                param[month + "_" + day + "_" + key] = val;
                SDK().setItem(param);
            }
            if (cb != null) {
                cb(val);
            }
        });
    },


    //插屏广告按钮
    onGiftBtnClick: function onGiftBtnClick(cb) {
        SDK().showInterstitialAd(function (isCompleted) {
            if (null == isCompleted) {
                console.log("没有观看成功");
                this.fbFail(1);
            } else if (isCompleted) {
                cb(true);
            } else {
                console.log("没有观看成功");
                this.fbFail(1);
            }
        }.bind(this), true);
    },


    //显示是否分享的提示框
    showSharaView: function showSharaView(cb) {
        if (this.SharaView == null) {
            var view = cc.instantiate(this.SharaView_prefab);
            var Canvas = cc.find("Canvas");
            view.parent = Canvas;
            view.width = window.width;
            view.height = window.height;
            this.SharaView = view;
        }
        this.SharaView.active = true;
        var sureBtn = this.SharaView.getChildByName("Bg").getChildByName("Sure");
        sureBtn.off(cc.Node.EventType.TOUCH_END);
        sureBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.onShareBtnClick(function (isCompleted) {
                cb(isCompleted);
                if (isCompleted) {
                    this.SharaView.active = false;
                }
            }.bind(this));
            window.gameApplication.soundManager.playSound("btn_click");
        }, this);

        var laterBtn = this.SharaView.getChildByName("Bg").getChildByName("Later");
        laterBtn.off(cc.Node.EventType.TOUCH_END);
        laterBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.SharaView.active = false;
            window.gameApplication.soundManager.playSound("btn_click");
        }, this);
    },


    //分享按钮
    onShareBtnClick: function onShareBtnClick(cb) {
        SDK().getItem("all", function (score) {
            SDK().share(score, function (isCompleted) {
                if (isCompleted) {
                    //分享激励
                    console.log("share:" + score);
                    if (cb != null) {
                        cb(true);
                    }
                } else {
                    this.fbFail(2);
                }
                this.soundManager.audioSource.play();
                this.soundManager.audioSource.loop = true;
            }.bind(this));
        }.bind(this));
    },


    //FB失败界面
    fbFail: function fbFail(type) {
        var view = cc.instantiate(this.fbView_prefab);
        var Canvas = cc.find("Canvas");
        view.parent = Canvas;
        view.width = window.width;
        view.height = window.height;
        var btn = view.getChildByName("Okay");
        btn.off(cc.Node.EventType.TOUCH_END);
        btn.on(cc.Node.EventType.TOUCH_END, function (event) {
            this.fbView.active = false;
            btn.parent.destroy();
            window.gameApplication.soundManager.playSound("button");
        }, this);
        this.fbView = view;
        if (type == 1) {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = true;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = false;
        } else {
            this.fbView.getChildByName("Bg").getChildByName("VideoText").active = false;
            this.fbView.getChildByName("Bg").getChildByName("ShareText").active = true;
        }
        this.fbView.active = true;
    },


    //互推按钮事件
    popClick: function popClick(event, type) {
        SDK().switchGameAsync(type);
    },
    shake: function shake(node) {
        node.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.1, 5).easing(cc.easeIn(2)), cc.rotateTo(0.2, -5).easing(cc.easeIn(2)), cc.rotateTo(0.2, 5).easing(cc.easeIn(2)), cc.rotateTo(0.1, 0).easing(cc.easeIn(2)), cc.delayTime(0.5))));
    },
    scaleUpAndDowm: function scaleUpAndDowm(node) {
        node.runAction(cc.repeatForever(cc.sequence(cc.scaleTo(0.3, 1.1).easing(cc.easeIn(2)), cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)), cc.scaleTo(0.6, 1.1).easing(cc.easeIn(2)), cc.scaleTo(0.6, 0.9).easing(cc.easeIn(2)))));
    },


    //特效动画
    flyReward: function flyReward(num, name, target, start, cb) {
        window.gameApplication.soundManager.playSound("getCoin");
        //起点
        var begin = void 0;
        if (start != null) {
            begin = start.parent.convertToWorldSpaceAR(start.position);
            begin = this.effectView.convertToNodeSpaceAR(begin);
        } else {
            begin = cc.v2(0, 0);
        }
        //终点
        var dis = target.parent.convertToWorldSpaceAR(target.position);
        dis = this.effectView.convertToNodeSpaceAR(dis);
        for (var i = 0; i < num; i++) {
            var reward = this.rewardList.pop();
            if (reward == null) {
                reward = new cc.Node(i);
            }
            var sprite = reward.getComponent(cc.Sprite);
            if (sprite == null) {
                sprite = reward.addComponent(cc.Sprite);
            }
            reward.parent = this.effectView;
            reward.position = begin;
            sprite.spriteFrame = this.uiAtlas.getSpriteFrame(name);
            this.flyAnim(reward, dis, cb, i);
        }
    },
    flyAnim: function flyAnim(reward, dis, cb, i) {
        reward.scale = 0;
        this.scheduleOnce(function () {
            reward.runAction(cc.spawn(cc.moveTo(0.8, cc.v2(dis.x, dis.y)), cc.sequence(cc.scaleTo(0.4, 1.1), cc.scaleTo(0.4, 0),
            //用于只执行一次的
            cc.callFunc(function () {
                if (cb != null) {
                    cb();
                }
                this.rewardList.push(reward);
            }.bind(this), this))));
        }.bind(this), i * 0.1);
    }
}

// update (dt) {},
);

cc._RF.pop();