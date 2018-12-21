"use strict";
cc._RF.push(module, '5a326YqAwhD+IfA3lH1oKVk', 'MainView');
// Script/UI/MainView.js

"use strict";

var _vm = require("vm");

var stageColor = [cc.color(248, 181, 81, 255), cc.color(174, 93, 161, 255), cc.color(50, 177, 108, 255), cc.color(54, 46, 43, 255), cc.color(0, 0, 0, 255), cc.color(0, 160, 233, 255)];
var gray = cc.color(229, 229, 229, 255);
cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Label
        },
        hearts: {
            default: null,
            type: cc.Node
        },
        starts: {
            default: null,
            type: cc.Node
        },
        coins: {
            default: null,
            type: cc.Node
        },
        content: {
            default: null,
            type: cc.Node
        },
        scrollView: {
            default: null,
            type: cc.ScrollView
        },
        stageItem: {
            default: null,
            type: cc.Node
        },
        missionSpriteAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        missions: {
            default: null
        },
        gameApplication: {
            default: null,
            type: Object
        },
        missionNodes: {
            default: []
        },
        curIdx: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        minIdx: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        maxIdx: {
            default: 0,
            type: cc.Integer,
            visible: false
        },
        uiAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },
        reTime: {
            default: 0,
            type: cc.Float,
            visible: false
        },
        reviveBtn: {
            default: null,
            type: cc.Button
        },
        reviveTime: {
            default: null,
            type: cc.Label
        },
        reviveNum: {
            default: null,
            type: cc.Label
        }
    },

    onLoad: function onLoad() {
        this.reTime = 300;
        SDK().getItem("reHeart", function (count) {
            this.reviveNum.string = count;
        }.bind(this));
        this.reviveHeartCount();
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
        window.mainScirpt = this;
        this.gameApplication = cc.find("GameApplication").getComponent("GameApplication");
        this.init();

        this.scrollView.node.on("scroll-to-bottom", this.scorllToBottom, this);

        this.scrollView.node.on("scroll-to-top", this.scorllToTop, this);

        //scrollView.scrollToOffset(cc.p(maxScrollOffset.x / 2, 0), 0.1);

        this.minIdx = null;
        this.maxIdx = null;
    },

    scorllToBottom: function scorllToBottom(event) {
        if (this.minIdx > 0) {
            this.initStage(this.minIdx - 10);
        }
    },
    scorllToTop: function scorllToTop(event) {
        if (this.maxIdx < 540) {
            this.initStage(this.maxIdx + 10);
        }
    },
    init: function init() {
        if (this.missions == null || Object.keys(this.missions).length <= 0) {
            this.gameApplication.getMissions(function (results) {
                this.missions = results;
                this.initContents();
            }.bind(this));
        } else {
            this.initContents();
        }

        SDK().getItem("all", function (score) {
            this.starts.getComponent(cc.Label).string = score.toString();
        }.bind(this));
    },
    onEnable: function onEnable() {
        if (this.missions != null && Object.keys(this.missions).length > 0) {
            this.initContents();
        }
        this.refreashVal();
    },
    refreashVal: function refreashVal() {
        if (this.starts == null) {
            return;
        }
        SDK().getItem("all", function (score) {
            this.starts.getComponent(cc.Label).string = score.toString();
        }.bind(this));

        SDK().getItem("hearts", function (heart) {
            this.hearts.getComponent(cc.Label).string = heart.toString();
        }.bind(this));

        SDK().getItem("coins", function (coin) {
            this.coins.getComponent(cc.Label).string = coin.toString();
        }.bind(this));
    },


    //初始化地图
    initContents: function initContents() {
        this.content.active = false;
        if (window.lastPlay != null) {
            this.initStage(window.lastPlay);
            this.content.active = true;
        } else {
            SDK().getItem("curIdx", function (val) {
                if (val == null) {
                    val = 0;
                }
                window.curIdx = val;
                this.initMissionItem(val);
                this.content.active = true;
            }.bind(this));
        }
    },


    //第一次加载关卡
    initMissionItem: function initMissionItem(val) {
        var initMission;
        if (val >= 10) {
            this.initStage(val - 10);
        }
        this.initStage(val);
        if (val < 540) {
            this.initStage(val + 10);
        }
        this.scheduleOnce(function () {
            this.menuClick(null, "goCur");
        }.bind(this), 2);
    },


    //加载或刷新一段关卡
    initStage: function initStage(val) {
        var curMission = this.judgeType(val);
        //console.log(val);
        //console.log(curMission);
        var mission = this.missions[curMission.type];
        var bigStage = curMission.bigStage;

        var cannonNode = this.missionNodes[bigStage];
        if (cannonNode == null) {
            cannonNode = cc.instantiate(this.stageItem);
        }

        cannonNode.parent = this.content;
        cannonNode.name = "" + bigStage;
        cannonNode.tag = curMission.type;

        //获取大关是否解锁
        SDK().getItem("lock_" + bigStage, function (lockCount) {
            var islock = false;
            if (lockCount > 0) {
                islock = false;
            }
            if (bigStage == 0) {
                islock = false;
            }
            //获取每十关的小关卡并初始化
            for (var i = 0; i < 10; i = i + 1) {
                //获取单个小关卡并计算小关卡是第几关
                var item = cc.find("Bg/Stage" + i, cannonNode);
                var val = i + bigStage;

                //判断章节和关卡
                var mlInfo = this.judgeML(curMission, i);
                //console.log(mlInfo)

                item.tag = val;

                //如果该小关不存在则隐藏
                if (mlInfo.lid > mission.stars) {
                    item.active = false;
                } else {
                    item.active = true;

                    //获取当前小关卡的所有组件
                    var small = cc.find("Small", item).getComponent(cc.Sprite);
                    var num = cc.find("Num", small.node).getComponent(cc.Label);
                    var curPoint = cc.find("CurPoint", small.node);
                    var lock = cc.find("Lock", small.node);

                    //设置关卡名
                    if (val % 10 == 0) {
                        num.string = "";
                        if (val == 0) {
                            num.string = "";
                        }
                    } else {
                        num.string = val;
                    }

                    //判断是否是当前关卡
                    if (val == window.curIdx) {
                        curPoint.active = true;
                        curPoint.runAction(cc.repeatForever(cc.sequence(cc.moveBy(0.5, cc.v2(0, 20)), cc.moveBy(0.5, cc.v2(0, -20)))));
                        //预加载关卡
                        var mid = mlInfo.mid;
                        var lid = mlInfo.lid;
                        if (mid != null && mid > 0 && lid != null && lid > 0) {
                            //预加载上下两关
                            var arr = [];
                            if (lid > 1) {
                                arr.push(lid - 1);
                            }
                            arr.push(lid);
                            if (lid < 100) {
                                arr.push(lid + 1);
                            }
                            arr.forEach(function (tmp_lid) {
                                var tmp_path = "conf/level_detail/b_" + 1 + "/" + mid + "/" + tmp_lid;
                                window.gameApplication.getConf(tmp_path, null);
                            });
                        }
                    } else {
                        curPoint.stopAllActions();
                        curPoint.active = false;
                    }

                    //设置图标的样式
                    if (val == bigStage) {
                        small.spriteFrame = this.uiAtlas.getSpriteFrame(curMission.type + "Big");
                        small.node.color = cc.color(255, 255, 255, 255);
                    } else {
                        small.node.color = gray;
                    }

                    //是否解锁
                    if (!islock) {
                        lock.active = false;

                        //封装关卡信息
                        var info = {};
                        info.mid = mlInfo.mid;
                        info.lid = mlInfo.lid;
                        info.bigStage = curMission.bigStage;
                        info.idx = i;

                        //初始化按钮事件
                        if (val <= window.curIdx || true) {
                            this.initStageClick(info, item, islock);
                        }
                        this.checkstagePass(mlInfo, val, small, curMission);
                    } else {
                        lock.active = true;
                        //解绑点击函数
                        item.off(cc.Node.EventType.TOUCH_END);
                        if (val % 10 == 0) {
                            lock.active = false;
                            var info = {};
                            info.mid = mlInfo.mid;
                            info.lid = mlInfo.lid;
                            info.bigStage = curMission.bigStage;
                            info.idx = i;
                            this.initStageClick(info, item, islock);
                        }
                    }
                }
            }
            cannonNode.active = true;
            this.missionNodes[bigStage] = cannonNode;

            if (bigStage > this.maxIdx || this.maxIdx == null) {
                this.maxIdx = bigStage;
            }
            if (bigStage < this.minIdx || this.minIdx == null) {
                this.minIdx = bigStage;
                cannonNode.setSiblingIndex(0);
            }
        }.bind(this));
    },


    //判断小关卡是否过关
    checkstagePass: function checkstagePass(mlInfo, val, small, curMission) {
        //判断是否过关
        SDK().getItem("1_" + mlInfo.mid + "_" + mlInfo.lid, function (star) {
            //console.log(mlInfo.mid, mlInfo.lid, star)
            if (star > 0) {
                if (val % 10 != 0) {
                    small.node.color = stageColor[curMission.type];
                }
            }
        }.bind(this));
    },
    initStageClick: function initStageClick(stageInfo, item, islock) {
        var goGame = cc.find("GoGame", this.node);
        item.off(cc.Node.EventType.TOUCH_END);
        //绑定点击函数
        item.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (goGame != null) {
                goGame.active = true;
            }
            this.gameApplication.soundManager.playSound("btn_click");
            var idx = event.target.tag;
            //被锁住的大关卡的解锁
            if (idx % 10 == 0 && idx != 0 && islock) {
                this.gameApplication.showSharaView(function (isComplited) {
                    if (isComplited) {
                        var param = {};
                        param["lock_" + stageInfo.bigStage] = 1;
                        SDK().setItem(param, function () {
                            this.initStage(stageInfo.bigStage);
                        }.bind(this));
                    }
                    if (goGame != null) {
                        goGame.active = false;
                    }
                }.bind(this));
            } else {
                SDK().getItem("hearts", function (heart) {
                    //体力充足
                    if (heart > 0) {
                        //消耗一个体力
                        heart = heart - 1;
                        SDK().setItem({ hearts: heart });
                        if (this.hearts != null) {
                            this.hearts.getComponent(cc.Label).string = heart;
                        }
                        window.gameApplication.flyReward(1, "heartSprite", item, this.hearts, function () {
                            this.goGame(stageInfo, item, islock);
                        }.bind(this));
                    } else {
                        //体力不足需要获得
                        window.gameApplication.showHeartView(function (isComplited) {
                            if (isComplited) {
                                heart = 4;
                                if (this.hearts != null) {
                                    this.hearts.getComponent(cc.Label).string = heart;
                                }
                                SDK().setItem({ hearts: heart });
                                window.gameApplication.flyReward(1, "heartSprite", item, this.hearts, function () {
                                    this.goGame(stageInfo, item, islock);
                                }.bind(this));
                            } else {
                                if (goGame != null) {
                                    goGame.active = false;
                                }
                            }
                        }.bind(this), false);
                    }
                }.bind(this));
            }
        }, this);
    },
    goGame: function goGame(stageInfo, item, islock) {
        //开始游戏
        window.bid = 1;
        window.mid = stageInfo.mid;
        window.lid = stageInfo.lid;
        this.gameApplication.openGameView();
    },


    //判断关卡类型
    judgeType: function judgeType(stage) {
        var count = 0;
        var disVal = 60;
        var isFix = false;

        //如果关卡大于300时，直接不要第六章节
        if (stage >= 300) {
            stage = stage - 300;
            isFix = true;
            disVal = 50;
        }
        while (stage >= disVal) {
            stage = stage - disVal;
            count = count + 1;
        }
        stage = Math.floor(stage / 10);

        var param = {};
        param.type = stage;
        param.count = count;
        param.bigStage = stage * 10 + count * disVal;
        if (isFix) {
            param.bigStage = param.bigStage + 300;
        }
        return param;
    },


    //根据关卡数判断mid 和 lid
    judgeML: function judgeML(curMission, i) {
        var info = {};
        info.mid = curMission.type + 1;
        var fixCount = 0;
        if (curMission.bigStage >= 300) {
            fixCount = 5;
        }
        info.lid = 1 + i + (fixCount + curMission.count) * 10;
        return info;
    },
    hideAllItem: function hideAllItem() {
        if (this.content.childrenCount > 0) {
            //如果有child，destroy
            this.content.children.forEach(function (n) {
                n.active = false;
                n.destroy();
            });
        }
    },
    menuClick: function menuClick(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        if (type == "addHeart") {
            window.gameApplication.showHeartView(function (isComplited) {
                if (isComplited) {
                    SDK().getItem("hearts", function (heart) {
                        heart = heart + 5;
                        window.gameApplication.flyReward(5, "heartSprite", window.mainScirpt.hearts, null);
                        if (this.hearts != null) {
                            this.hearts.getComponent(cc.Label).string = heart;
                        }
                        SDK().setItem({ hearts: heart });
                    }.bind(this), false);
                }
            }.bind(this), false);
        } else if (type == "addCoin") {
            window.gameApplication.showCoinView(function (isCompleted) {
                if (isCompleted) {
                    SDK().getItem("coins", function (coin) {
                        coin = coin + 100;
                        window.gameApplication.flyReward(10, "coin", window.mainScirpt.coins, null);
                        if (this.coins != null) {
                            this.coins.getComponent(cc.Label).string = coin;
                        }
                        SDK().setItem({ coins: coin });
                    }.bind(this), false);
                }
            }.bind(this), false);
        } else if (type == "goCur") {
            var curMission = this.judgeType(window.curIdx);
            var bigStage = curMission.bigStage;
            var cannonNode = this.missionNodes[bigStage];
            if (cannonNode == null) {
                return;
            }
            var height = 995;
            var fix = window.curIdx - curMission.bigStage;
            height = height * (-fix + 5) / 10;
            var maxScrollOffset = this.scrollView.getMaxScrollOffset();
            this.scrollView.scrollToOffset(cc.p(0, maxScrollOffset.y - cannonNode.y + height), 0.5);
        } else if (type == "reHeart") {
            if (parseInt(this.reviveNum.string) == 0) {
                return;
            }
            this.reviveNum.string = 0;
            SDK().getItem("reHeart", function (count) {

                //将可获得的体力置零
                SDK().setItem({ reHeart: 0 }, function () {

                    //增加体力
                    SDK().getItem("hearts", function (Heart) {
                        Heart = parseInt(Heart);
                        Heart = Heart + count;
                        if (Math.abs(this.node.y - 0) < 10) {
                            window.gameApplication.flyReward(count, "heartSprite", window.mainScirpt.hearts, this.reviveBtn.node, function () {
                                if (null != window.mainScirpt.hearts) {
                                    window.mainScirpt.hearts.getComponent(cc.Label).string = Heart.toString();
                                }
                            }.bind(this));
                        }
                        SDK().setItem({ hearts: Heart }, null);
                    }.bind(this));
                }.bind(this));
            }.bind(this));
        }
    },
    reviveHeartCount: function reviveHeartCount() {
        if (this.reTime <= 0) {
            this.reTime = 300;
            SDK().getItem("reHeart", function (count) {
                count = count + 1;
                this.reviveNum.string = count;
                SDK().setItem({ reHeart: count });
            }.bind(this));
        } else {
            var temp = this.reTime;
            var tempMin = temp / 60;
            var min = temp / 60 < 10 ? "0" + Math.floor(temp / 60) : "" + Math.floor(temp / 60);
            var sec = temp % 60 < 10 ? "0" + Math.floor(temp % 60) : "" + Math.floor(temp % 60);
            if (temp <= 0) {
                min = "00";
                sec = "00";
            }
            this.reviveTime.string = min + ":" + sec;
        }
        this.scheduleOnce(function () {
            this.reviveHeartCount();
        }.bind(this), 1);
    },
    update: function update(dt) {
        this.reTime = this.reTime - dt;
    }
});

cc._RF.pop();