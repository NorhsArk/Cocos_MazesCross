import { isNull } from "util";

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
        selectView: {
            default: null,
            type: cc.ScrollView,
        },
        curLang: {
            default: null,
            type: cc.Label,
        },
        musicSprite: {
            default: null,
            type: cc.Sprite,
        },
        selectContent: {
            default: null,
            type: cc.Node,
        },
        selectItem: {
            default: null,
            type: cc.Node,
        },
        musicOn: {
            default: null,
            type: cc.SpriteFrame,
        },
        musicOff: {
            default: null,
            type: cc.SpriteFrame,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.initToggle();
    },

    initToggle() {
        SDK().getItem("curLang", function (idx) {
            if (idx == null) {
                idx = 0;
            }
            for (var i = 0; i < window.langArr.length; i = i + 1) {
                var newItem = cc.instantiate(this.selectItem);
                newItem.tag = i;
                newItem.parent = this.selectContent;
                //初始化状态
                newItem.toggle = newItem.getComponent(cc.Toggle);
                if (i != idx) {
                    newItem.toggle.isChecked = false;
                } else {
                    newItem.toggle.isChecked = true;
                    this.curLang.string = window.langArr[i];
                }
                //初始化名字
                var name = cc.find("Name", newItem).getComponent(cc.Label);
                name.string = window.langArr[i];
                //初始化处理事件
                newItem.on('toggle', this.languageSelect, this);

                newItem.active = true;
            }
        }.bind(this))
    },

    languageSelect(event) {
        var item = event.target;
        if (item.toggle.isChecked) {
            this.curLang.string = window.langArr[item.tag];
            SDK().setItem({ curLang: item.tag },function(){
                cc.director.loadScene("loadLanguage");
            }.bind(this));
        }
    },

    menuClick(event, type) {
        if (type == "music") {
            if (window.gameApplication.soundManager.isOpen) {
                this.musicSprite.spriteFrame = this.musicOff;
                window.gameApplication.soundManager.setIsOpen(false);
            } else {
                this.musicSprite.spriteFrame = this.musicOn;
                window.gameApplication.soundManager.setIsOpen(true);
            }
        } else if (type == "select") {
            var length = 400;
            if (Math.abs(this.selectView.node.height - length) < 0.01) {
                window.gameApplication.lerpACtion(length, -length, 0.5, function (ob) {
                    this.selectView.node.height = ob.x;
                    if (Math.abs(this.selectView.node.height - 0) < 1) {
                        this.selectView.node.height = 0;
                    }
                }.bind(this))
            } else if (Math.abs(this.selectView.node.height - 0) < 0.01) {
                window.gameApplication.lerpACtion(0, length, 0.5, function (ob) {
                    this.selectView.node.height = ob.x;
                    if (Math.abs(this.selectView.node.height - length) < 1) {
                        this.selectView.node.height = length;
                    }
                }.bind(this))
            }
        }
    },

    start() {

    },

    // update (dt) {},
});
