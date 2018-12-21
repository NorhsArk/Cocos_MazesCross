(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Script/UI/LevelView.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f23f1EV0cJDq6BQzHk3MAdR', 'LevelView', __filename);
// Script/UI/LevelView.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Label
        },
        starts: {
            default: null,
            type: cc.Node
        },
        pageView: {
            default: null,
            type: cc.PageView
        },
        content: {
            default: null,
            type: cc.Node
        },
        levelItem: {
            default: null,
            type: cc.Node
        },
        levelPage: {
            default: null,
            type: cc.Node
        },
        levels: {
            default: {}
        },
        bid: {
            default: 0,
            type: cc.Integer
        },
        mid: {
            default: 0,
            type: cc.Integer
        },
        _lastOpenLid: {
            default: 0,
            type: cc.Integer
        },
        lastOpenLid: {
            get: function get() {
                return this._lastOpenLid;
            },
            set: function set(val) {
                this._lastOpenLid = val;
                this.updateCurrpage();
            }
        },
        gameApplication: {
            default: null,
            type: Object
        },
        lastLid: {
            default: 0,
            type: cc.Integer
        }
    },

    onLoad: function onLoad() {
        this.gameApplication = cc.find("GameApplication").getComponent("GameApplication");
    },

    start: function start() {},
    init: function init(bid, mid) {
        this.title.string = "";

        if (this.levels == null || Object.keys(this.levels).length <= 0 || this.bid != bid || this.mid != mid) {
            this.bid = bid;
            this.mid = mid;
            // cc.log("conf/Level/level_" + bid + '_' + mid)
            var path = "conf/level_list/level_" + bid + '_' + mid;
            this.gameApplication.getConf(path, function (results) {
                // cc.log("results:",results);
                this.levels = results;
                this.initContents();
            }.bind(this));
        } else {
            this.bid = bid;
            this.mid = mid;
            this.initContents();
        }

        var self = this;
        SDK().getItem(bid + "_" + mid, function (score) {
            self.starts.getComponent(cc.Label).string = score.toString();

            //预加载上下两关
            var tmpId = score + 1;
            var arr = [];
            arr.push(tmpId);

            if (tmpId > 1) {
                arr.push(tmpId - 1);
            }
            arr.forEach(function (tmp_lid) {
                var tmp_path = "conf/level_detail/b_" + bid + "/" + mid + "/" + tmp_lid;
                // cc.log("------tmp_path:",tmp_path);
                self.gameApplication.getConf(tmp_path, null);
            });
        }.bind(this));
    },
    initContents: function initContents() {
        var self = this;
        self.hideAllItem();

        this.title.string = self.levels.title;
        this.lastLid = 0;

        this.bid = self.levels.bid;
        this.mid = self.levels.mid;
        var idx = 1;
        self.levels.levels.forEach(function (level) {
            self.initLevels(level, idx);
            idx++;
        });
        this.pageView._updatePageView();
    },
    initLevels: function initLevels(level, idx) {
        var _this = this;

        if (idx < 1 || idx > 4) {
            return;
        }

        var pageNode = cc.instantiate(this.levelPage);
        pageNode.active = true;
        // cc.log("pageNode:",pageNode);
        this.pageView.addPage(pageNode);

        var pageContent = pageNode.getChildByName("content");
        // cc.log("path",path)
        var total_level = level['total_level'];

        var _loop = function _loop(i) {
            // var itemNode = cc.instantiate(this.levelItem);
            // itemNode.parent = pageContent;
            var i_str = i.toString();

            var itemNode = pageContent.getChildByName(i_str);

            if (i > level['total_level']) {
                itemNode.active = false;
            } else {
                var lid = (idx - 1) * 25 + i;
                itemNode.tag = lid;

                //重置
                _this.setItem(itemNode, 0, false, lid);

                self = _this;

                //判断是否解锁

                SDK().getItem(self.bid + "_" + self.mid + "_" + lid, function (score) {
                    // console.log("++++++++++score:",lid,score);
                    var isOpen = false;
                    if (lid <= self.lastLid + 1 || score > 0) {
                        isOpen = true;
                        self.setItem(itemNode, score, isOpen, lid);
                    } else if (openAllLevel) {
                        self.setItem(itemNode, score, true, lid);
                    }

                    if (score > 0) {
                        self.lastLid = lid;
                    }
                }, itemNode, lid);
            }
        };

        for (var i = 1; i <= 25; i++) {
            var self;

            _loop(i);
        }
    },
    setItem: function setItem(node, score, isOpen, lid) {
        // cc.log("node:",node,isOpen)
        cc.find("unlock", node).active = isOpen;
        cc.find("lock", node).active = !isOpen;
        cc.find("unlock/text", node).getComponent(cc.Label).string = lid;
        cc.find("lock/text", node).getComponent(cc.Label).string = lid;

        node.active = true;
        // cc.find("stars/1",node).active = score>=1;
        // cc.find("stars/2",node).active = score>=2;
        // cc.find("stars/3",node).active = score>=3;

        if (isOpen) {
            this.lastOpenLid = lid;
        }
    },
    updateCurrpage: function updateCurrpage() {
        var pageAt = Math.ceil(this.lastOpenLid / 30) - 1;
        pageAt = pageAt >= 0 ? pageAt : 0;
        // setCurrentPageIndex
        this.pageView.scrollToPage(pageAt, false);
    },
    hideAllItem: function hideAllItem() {
        this.pageView.removeAllPages();
    },
    onBackBtnClicked: function onBackBtnClicked() {
        this.hideAllItem();
        this.gameApplication.openMainView();
        this.gameApplication.soundManager.playSound("btn_click");
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
        //# sourceMappingURL=LevelView.js.map
        