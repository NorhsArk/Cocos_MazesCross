(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/RankView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '04fa0UaF89AfJ9fdL6pdcUD', 'RankView', __filename);
// Script/UI/RankView.js

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

cc.Class({
    extends: cc.Component,

    properties: {
        //榜单界面
        worldBtn: {
            default: null,
            type: cc.Node
        },
        friendBtn: {
            default: null,
            type: cc.Node
        },
        worldList: {
            default: null,
            type: cc.Node
        },
        friendList: {
            default: null,
            type: cc.Node
        },
        worldContent: {
            default: null,
            type: cc.Node
        },
        friendContent: {
            default: null,
            type: cc.Node
        },
        //头像储存
        headSpriteList: {
            default: {},
            visible: false
        },
        //储存用户信息列表
        worldPlayer: {
            default: [],
            visible: false
        },
        friendPlayer: {
            default: [],
            visible: false
        },
        //储存用户UI列表
        worldUIPlayer: {
            default: [],
            visible: false
        },
        friendUIPlayer: {
            default: [],
            visible: false
        },
        prefab_player: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onEnable: function onEnable() {
        this.LoadRank();
    },


    //按钮点击事件
    menuClick: function menuClick(event, type) {
        window.gameApplication.soundManager.playSound("btn_click");
        if (type == "openRank") {
            window.gameApplication.openRankView(true);
        } else if (type == "closeRank") {
            window.gameApplication.openRankView(false);
        }
    },


    //加载榜单
    LoadRank: function LoadRank() {
        SDK().getFriendsRank(2, 20, 0, function (list) {
            this.GetFriendRank(list);
        }.bind(this));
        /* SDK().getRank(2, 50, 0, function (list) {
            this.GetWorldRank(list);
        }.bind(this)); */
    },


    //好友邀请列表
    GetFriendRank: function GetFriendRank(list) {
        this.friendPlayer = list;
        for (var i = 0; i < this.friendPlayer.length; i = i + 1) {
            var playerBar;
            var Head;
            var Name;
            var No;
            var Score;
            var playBtn;
            if (i >= this.friendUIPlayer.length) {
                playerBar = cc.instantiate(this.prefab_player);
                Head = playerBar.getChildByName("Head").getComponent(cc.Sprite);
                Name = playerBar.getChildByName("Name").getComponent(cc.Label);
                No = playerBar.getChildByName("No").getComponent(cc.Label);
                Score = playerBar.getChildByName("Score").getChildByName("Num").getComponent(cc.Label);
                playBtn = playerBar.getChildByName("Play");
                this.friendUIPlayer[i] = {};
                this.friendUIPlayer[i].playerBar = playerBar;
                this.friendUIPlayer[i].Head = Head;
                this.friendUIPlayer[i].Name = Name;
                this.friendUIPlayer[i].No = No;
                this.friendUIPlayer[i].Score = Score;
                this.friendUIPlayer[i].playBtn = playBtn;
            } else {
                playerBar = this.friendUIPlayer[i].playerBar;
                Head = this.friendUIPlayer[i].Head;
                Name = this.friendUIPlayer[i].Name;
                No = this.friendUIPlayer[i].No;
                Score = this.friendUIPlayer[i].Score;
                playBtn = this.friendUIPlayer[i].playBtn;
            }
            playerBar.parent = this.friendContent;
            playerBar.active = false;
            /* //背景色单双数显示
            if (i % 2 == 0) {
                playerBar.color = cc.color(248, 181, 81, 255);
            } else {
                playerBar.color = cc.color(254, 152, 0, 255);
            } */

            //加载头像
            this.LoadSprite(this.friendPlayer[i].headUrl, Head, this.headSpriteList[this.friendPlayer[i].id]);
            //名字
            Name.string = this.friendPlayer[i].name;
            Name.node.active = true;
            //排名
            No.string = this.friendPlayer[i].No;
            No.node.active = true;
            //分数
            Score.string = this.friendPlayer[i].score;
            Score.node.active = true;

            //是否为自己
            if (this.friendPlayer[i].id == SDK().getSelfInfo().id) {
                playBtn.active = false;
            } else {
                playBtn.active = true;
            }
            //按钮初始化
            playBtn.tag = this.friendPlayer[i].id;
            playBtn.off(cc.Node.EventType.TOUCH_END);
            playBtn.on(cc.Node.EventType.TOUCH_END, function (event) {
                SDK().playWith(event.target.tag, null, function (isCompleted) {
                    if (isCompleted) {
                        SDK().getItem("coins", function (coin) {
                            coin = coin + 20;
                            window.gameApplication.flyReward(2, "coin", window.mainScirpt.coins, function () {
                                if (this.node.active) {
                                    window.gameApplication.openGameView(true);
                                }
                                if (window.mainScirpt.coins != null) {
                                    window.mainScirpt.coins.getComponent(cc.Label).string = coin;
                                }
                            }.bind(this));
                            SDK().setItem({ coins: coin });
                        }.bind(this), false);
                    }
                }.bind(this));
            }.bind(this), this);
        }
        if (this.friendPlayer.length < this.friendUIPlayer.length) {
            for (var i = this.friendPlayer.length; i < this.friendUIPlayer.length; i = i + 1) {
                this.friendUIPlayer[i].playerBar.active = false;
            }
        }
    },


    //世界排行榜
    GetWorldRank: function GetWorldRank(list) {
        this.worldPlayer = list;
        var isOnRank = false;
        for (var i = 0; i < this.worldPlayer.length; i = i + 1) {
            if (this.LoadRankData(i, this.worldPlayer[i])) {
                isOnRank = true;
            }
        }
        //如果自己不在榜单上就将自己加载最后
        var listLength = this.worldPlayer.length;
        if (!isOnRank) {
            listLength = listLength + 1;
            SDK().getRankScore(2, function (info) {
                this.LoadRankData(listLength - 1, info);
            }.bind(this));
        }
        //隐藏多余的榜单
        if (listLength < this.worldUIPlayer.length) {
            for (var i = this.worldPlayer.length; i < this.worldUIPlayer.length; i = i + 1) {
                this.worldUIPlayer[i].playerBar.active = false;
            }
        }
    },


    //将玩家信息加载到第I排
    LoadRankData: function LoadRankData(i, playerData) {
        var isOnRank = false;
        var playerBar;
        var mainBg;
        var No;
        var Score;
        var Head;
        if (i >= this.worldUIPlayer.length) {
            playerBar = cc.instantiate(this.prefab_player);
            mainBg = playerBar.getComponent(cc.Sprite);
            No = playerBar.getChildByName("No").getComponent(cc.Label);
            Score = playerBar.getChildByName("Score").getChildByName("Num").getComponent(cc.Label);
            Head = playerBar.getChildByName("HeadMask").getChildByName("Head").getComponent(cc.Sprite);
            var Name = playerBar.getChildByName("Name");
            Name.active = false;
            this.worldUIPlayer[i] = {};
            this.worldUIPlayer[i].playerBar = playerBar;
            this.worldUIPlayer[i].mainBg = mainBg;
            this.worldUIPlayer[i].No = No;
            this.worldUIPlayer[i].Score = Score;
            this.worldUIPlayer[i].Head = Head;
        } else {
            playerBar = this.worldUIPlayer[i].playerBar;
            mainBg = this.worldUIPlayer[i].mainBg;
            No = this.worldUIPlayer[i].No;
            Score = this.worldUIPlayer[i].Score;
            Head = this.worldUIPlayer[i].Head;
        }
        //背景色单双数显示
        if (i % 2 == 0) {
            playerBar.color = cc.color(248, 181, 81, 255);
        } else {
            playerBar.color = cc.color(254, 152, 0, 255);
        }
        No.node.active = true;
        Score.node.active = true;
        playerBar.name = playerData.id;
        playerBar.parent = this.worldContent;
        //是否为自己
        if (playerData.id == SDK().getSelfInfo().id) {
            isOnRank = true;
        }
        //隐藏play按钮
        var playBtn = playerBar.getChildByName("Play");
        playBtn.active = false;
        //加载名次
        No.string = playerData.no;
        //加载分数
        Score.string = playerData.score;
        //加载头像
        this.LoadSprite(playerData.headUrl, Head, this.headSpriteList[playerData.id]);
        return isOnRank;
    },


    //根据URL加载头像并到对应的sprite上
    LoadSprite: function LoadSprite(url, sprite, saver) {
        if (saver == null) {
            cc.loader.load(url, function (err, texture) {
                saver = new cc.SpriteFrame(texture);
                sprite.spriteFrame = saver;
                sprite.node.parent.active = true;
            });
        } else {
            sprite.spriteFrame = saver;
            sprite.node.parent.active = true;
        }
    }
}

// update (dt) {},
);

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
        //# sourceMappingURL=RankView.js.map
        