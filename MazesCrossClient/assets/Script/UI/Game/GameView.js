var Utils = require("../../Utils/Utils");
var HexCell = require("./HexCell");
var Role = require("./Role");
var Enemy = require("./Enemy");
var Tower = require("./Tower");

var colors = [
    "#5d3eaf",
    "#4ba3e8",
    "#9d9e9d",
    "#67798a",
    "#f19b38"
];


var hexTileHeight = 100;    //actually the width of the hex tile graphic (distance between the pointy opposite corners)
var sideLength; //this is the lendth of one side of the hexagon or the length of a corner to centre of the hexagon

cc.Class({
    extends: cc.Component,

    properties: {
        shootings: {
            default: [],
            type: [cc.Node],
        },
        invAgain: {
            default: null,
            type: cc.Node,
        },
        mission: {
            default: null,
        },
        gm: {
            default: null,
            type: cc.Node,
        },
        title: {
            default: null,
            type: cc.Label,
        },
        star1: {
            default: null,
            type: cc.Node,
        },
        star2: {
            default: null,
            type: cc.Node,
        },
        star3: {
            default: null,
            type: cc.Node,
        },
        moves: {
            default: null,
            type: cc.Label,
        },
        best: {
            default: null,
            type: cc.RichText,
        },
        tileBox: {
            default: null,
            type: cc.Node,
        },
        iceBox: {
            default: null,
            type: cc.Node,
        },
        maxValidMoves: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        movesLeft: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        moved: {
            default: 0,
            type: cc.Integer,
            visible: false,
        },
        leaveSteps: {
            default: null,
            type: cc.Node,
        },
        //grid size colum x row
        levelDimensions: {
            default: cc.v2(0, 0),
            visible: false,
        },
        //position of the full grid
        gridOffset: {
            default: cc.v2(0, 0),
            visible: false,
        },
        hexCellPrefab: {
            default: null,
            type: cc.Node,
        },
        icePrefab: {
            default: null,
            type: cc.Node,
        },
        rolePrefab: {
            default: null,
            type: cc.Node,
        },
        enemyPrefab: {
            default: null,
            type: cc.Node,
        },
        enemyPrefab1: {
            default: null,
            type: cc.Node,
        },
        enemyPrefab2: {
            default: null,
            type: cc.Node,
        },
        endPrefab: {
            default: null,
            type: cc.Node,
        },
        //list of all the cells in the grid
        allCells: {
            default: [],
            type: [HexCell],
        },
        allTowers: {
            default: [],
            type: [Tower],
        },
        myRole: {
            default: null,
            type: Role,
        },
        enemys: {
            default: []
        },
        helplines: {
            default: []
        },
        stepsLines: {
            default: []
        },
        endObj: {
            default: null,
            type: Role,
        },

        selectedLines: {
            default: [],
        },

        mouseIsDown: false,
        userInputEnabled: false,
        gameOver: false,

        prevTilePosition: {
            default: cc.v2(-1000, -1000),
            visible: false,
        },
        mouseOffsetPos: {
            default: cc.v2(0, 0),
            visible: false,
        },
        touchPos: {
            default: cc.v2(0, 0),
            visible: false,
        },

        movePlus: {
            get: function () {
                //t,l,d,r
                return [
                    cc.v2(0, 1), //top
                    cc.v2(-1, 0), //left
                    cc.v2(0, -1), //down
                    cc.v2(1, 0)  //right
                ];
            }
        },

        helpPath: {
            default: [],
        },
        helpShaked: {
            default: [],
        },
        helpBtn: {
            default: null,
            type: cc.Node,
        },
        helpCountLabel: {
            default: null,
            type: cc.Label,
        },
        _helpCount: {
            default: 0,
            type: cc.Integer,
        },
        helpCount: {
            get: function () {
                return this._helpCount;
            },
            set: function (v) {
                this._helpCount = v;
                this.helpCountLabel.string = v.toString();

                var param = {};
                param["my_help"] = this._helpCount > 0 ? this._helpCount : -1;
                SDK().setItem(param, null);

                this.helpBtn.getChildByName("icon").active = true;
                this.helpBtn.getChildByName("num").active = true;

            },
        },
        shareFriendTip: {
            default: null,
            type: cc.Node,
        },
        adSprite: {
            default: null,
            type: cc.Sprite,
        },
        receiveGiftNode: {
            default: null,
            type: cc.Node,
        },
        giftBtn: {
            default: null,
            type: cc.Node,
        },
        preBtn: {
            default: null,
            type: cc.Node,
        },
        nextBtn: {
            default: null,
            type: cc.Node,
        },
        endView: {
            default: null,
            type: cc.Node,
        },
        endView_Stars: {
            default: null,
            type: cc.Node,
        },
        endView_title: {
            default: null,
            type: cc.Label,
        },
        endView_text: {
            default: null,
            type: cc.RichText,
        },
        gameApplication: {
            default: null,
            type: Object
        },
        isMoving: false,
        //最后行走方向
        lastDirection: {
            default: -1,
            type: cc.Integer,
        },
        turnBackCount: {
            default: 0,
            type: cc.Integer,
        },
        timesNode: {
            default: null,
            type: cc.Node,
        },
        timesVal: {
            default: null,
            type: cc.Label,
        },
        timesLeft: {
            default: 0,
            type: cc.Integer,
        },
        timeOutflowCB: {
            default: null
        },
        timeIsUpNode: {
            default: null,
            type: cc.Node,
        },
        timeIsUpEndNode: {
            default: null,
            type: cc.Node,
        },
        gotMoreTime: false,
        opad_game_id: null,


    },

    onLoad: function () {
        this.node.width = cc.winSize.width;
        this.node.height = cc.winSize.height;
    },

    plusMoreHelp() {
        this.helpCount += plusHelp;
    },

    clearHelp() {
        this.helpCount = 0;
    },

    clearData() {
        SDK().clearData();
    },

    onEnable() {
        this.scheduleOnce(function () {
            this.init();
        }, 0.7)

        //注册流行事件
        this.unschedule(this.shootingStars);
        this.schedule(this.shootingStars, 4);
    },

    //流行事件
    shootingStars() {
        for (var i = 0; i < this.shootings.length; i = i + 1) {
            this.shootAnim(this.shootings[i]);
        }
    },

    //流行动画
    shootAnim(node) {
        var delay = cc.random0To1() * 3;
        node.x = cc.winSize.width + 100;
        node.y = Utils.GetRandomNum(cc.winSize.height * 0.5, cc.winSize.height * 2);
        this.scheduleOnce(function () {
            node.runAction(cc.moveBy(0.5, cc.v2(-(cc.winSize.width * 2.5), -(cc.winSize.width * 2.5))));
        }.bind(this), delay)
    },

    start() {
        var gameApplicationNode = cc.find("GameApplication");
        if (gameApplicationNode != null) {
            this.gameApplication = gameApplicationNode.getComponent("GameApplication");
        }

        if (typeof this.gameApplication === 'undefined' || this.gameApplication == null) {
            this.onBackBtnClicked();
            return;
        }

        this.gm.active = false


        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            this.onMouseDown(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            this.onMouseMove(event);
        }, this);

        // this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
        //     this.onMouseUp(event);
        // }, this);

        // this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
        //     this.onMouseUp(event);
        // }, this);
    },


    onDisable() {
        this.clear();
    },

    clear() {

        this.unschedule(this.timeOutflow);

        this.clearTile();

        this.allCells.splice(0, this.allCells.length);
        this.allTowers.splice(0, this.allTowers.length);
        this.selectedLines.splice(0, this.selectedLines.length);
        this.enemys.splice(0, this.enemys.length);
        this.helplines.splice(0, this.helplines.length);
        this.myRole = null;
        this.helpShaked.splice(0, this.helpShaked.length);

        if (this.helpPath != null && this.helpPath.length > 0) {
            this.helpPath.splice(0, this.helpPath.length);
        }

        // Xuanyou.Util.DestroyAllChilds (tileBox);

        hexTileHeight = 100;
        this.mouseIsDown = false;
        this.gameOver = false;
        this.movesLeft = 0;
        this.moved = 0;
        this.turnBackCount = 0;
        this.lastDirection = -1;
        this.isMoving = false;

        // this.filling = 0;
        // this.filling_str = "0";
        this.currentLineColor = 0;
        this.oldCurrentLineColor = 0;

        // this.m_Num = 0;
        // this.m_tweenNum = 0;
    },

    clearTile() {
        // cc.log("this.tileBox.childrenCount:"+this.tileBox.childrenCount)
        if (this.tileBox.childrenCount > 0) {
            //如果有child，destroy
            for (var i = 0; i < this.tileBox.childrenCount; i++) {
                var n = this.tileBox.children[i];
                if (n != null) {
                    n.active = false;
                    n.destroy();
                }
            }
        }

        if (this.iceBox.childrenCount > 0) {
            //如果有child，destroy
            for (var i = 0; i < this.iceBox.childrenCount; i++) {
                var n = this.iceBox.children[i];
                if (n != null) {
                    n.active = false;
                    n.destroy();
                }
            }
        }
    },


    init() {
        //cc.warn("____________________conf/level_detail/b_" + bid + "/" + mid + "/" + lid + ".json");

        var self = this;
        this.selectedLines = [];
        this.enemys = [];
        this.helplines = [];
        this.helpPath = [];
        this.myRole = null;
        this.isMoving = false;

        this.endView.active = false;
        this.timeIsUpNode.active = false;
        this.gotMoreTime = false;
        if (bid != null && bid > 0 && mid != null && mid > 0 && lid != null && lid > 0) {
            var path = "conf/level_detail/b_" + bid + "/" + mid + "/" + lid;
            this.gameApplication.getConf(path, function (results) {
                this.mission = results;
                this.initGame();
            }.bind(this));

            //预加载上下两关
            var arr = [];
            if (lid > 1) {
                arr.push(lid - 1);
            }
            if (lid < 100) {
                arr.push(lid + 1);
            }
            arr.forEach(function (tmp_lid) {
                var tmp_path = "conf/level_detail/b_" + bid + "/" + mid + "/" + tmp_lid;
                self.gameApplication.getConf(tmp_path, null);
            });

            //init HelpBtn
            this.initHelpBtn();

        } else {
            this.onBackBtnClicked();
        }
    },

    initHelpBtn() {
        var self = this;
        SDK().getItem("my_help", function (count) {
            if (count == 0) {
                self.helpCount = 5;
            } else if (count == -1) {
                self.helpCount = 0;
            } else {
                self.helpCount = count;
            }
        }.bind(this));
    },

    initGame() {
        var curIdx = this.judgeIdx(mid, lid);
        window.lastPlay = curIdx;
        this.timeIsUpNode.active = false;
        this.timeIsUpEndNode.active = false;
        this.gotMoreTime = false;
        this.leaveSteps.active = false;
        this.endView.active = false;
        this.clear();

        // cc.log("this.mission:",this.mission)

        var lines = this.mission['lines'];
        var linesCount = lines.length;

        this.turnBackCount = 0;
        this.helpShaked.splice(0, this.helpShaked.length);

        this.lastDirection = -1;


        var path = "conf/level_list/level_" + bid + '_' + mid;
        this.gameApplication.getConf(path, function (results) {
            var levelInfo = results;
            this.title.string = levelInfo['title'] + " " + lid;
        }.bind(this));


        // this.moves.string = "<color=#ff0000>0</c>/"+this.mission['moves'];
        this.moves.string = "0/" + linesCount;



        //判断是否有上一关
        this.preBtn.active = false;
        this.nextBtn.active = false;

        //最好成绩
        SDK().getItem(bid + "_" + mid + "_" + lid + "_moves", function (best) {
            if (best <= 0) {
                this.best.string = "-";
            } else {
                this.best.string = best.toString();
            }
        }.bind(this));


        //初始化格子
        var grid = cc.v2(this.mission['x'], this.mission['y']);
        this.createGrid(grid, this.mission["walls"], this.mission["ice"], this.mission["tower"], function () {

            this.scheduleOnce(function () {
                //初始化球的位置
                this.createRole(this.mission['start'], this.mission['end']);

                //初始化帮助
                this.initHelpPath(Utils.cloneObj(this.mission["lines"]));

                var enemy = this.mission['enemy'];
                if (enemy.length > 0) {
                    this.createEnemy(this.mission['enemy']);
                }

                //初始化步数模式
                if (mid == 1) {
                    this.moved = 0;
                    this.maxValidMoves = this.getSteps();
                    this.maxValidMoves = this.maxValidMoves + 5;
                    this.movesLeft = this.maxValidMoves;
                    this.leaveSteps.active = true;
                    this.updateUI();
                }


                //初始化时间模式
                if (mid == 3) {
                    // cc.log("初始化时间模式")
                    var t = 12;
                    if (lid <= 5) {
                        t = 12;
                    } else if (lid <= 20) {
                        t = 15;
                    } else if (lid <= 45) {
                        t = 20;
                    } else if (lid <= 75) {
                        t = 25;
                    } else {
                        t = 30;
                    }

                    this.timesLeft = t;
                    this.timesNode.active = true;
                    this.timesVal.string = t.toString()

                    var interval = 1;
                    var repeat = t;
                    var delay = 1;

                    this.schedule(this.timeOutflow, interval, repeat, delay);
                } else {
                    this.timesLeft = -1;
                    this.timesNode.active = false;
                }
            }.bind(this), 0.5)
        }.bind(this));
    },

    initHelpPath(helpPath) {
        //cc.log("initHelpPath:",helpPath);
        // this.helpPath = helpPath;
        // cc.log("+++++++++++==mid:",mid)
        if (mid != 2 && mid != 4 && mid != 6) {
            this.helpPath = helpPath;
            //cc.log("______", this.helpPath)
        } else {
            //cc.log("_______________")
            this.helpPath = [];
            this.helpPath.push(this.myRole.axialCoordinate);

            var test = 0;
            while (helpPath.length > 0) {
                for (var i = 0; i < helpPath.length; i++) {
                    var path = helpPath[i];
                    // cc.log("_____check:",path);

                    if (path != null) {
                        path = this.checkXY(path, 0, 0);
                        var canMovePath = this.checkMovePos(path);
                        // cc.log("canMovePath:",canMovePath);
                        // cc.log("this.helpPath[this.helpPath.length-1]:",this.helpPath[this.helpPath.length-1]);
                        for (var j = 0; j < canMovePath.length; j++) {

                            var testV2 = this.helpPath[this.helpPath.length - 1];
                            if (canMovePath[j].x == testV2.x && canMovePath[j].y == testV2.y) {
                                this.helpPath.push(helpPath[i]);
                                helpPath.splice(i, 1)
                                break;
                            }
                        }
                    }


                }
                test++;


                if (test >= 500) {
                    // cc.log("helpPath:",JSON.stringify(helpPath));
                    helpPath.splice(0, helpPath.length);
                    helpPath = [];
                }
            }
        }

        this.stepsLines = this.helpPath;

        // cc.log("____________this.helpPath:",this.helpPath);


    },

    timeOutflow() {
        //时间模式
        // cc.log("时间模式:",this.timesLeft)
        var self = this;
        if (this.timesLeft > 0) {
            this.timesLeft--;
            if (this.timesLeft < 10 && this.timesLeft > 1) {
                this.schedule(function () {
                    self.gameApplication.soundManager.playSound("clock");
                }, 0.5, 2, 0);
            }

            this.timesNode.active = true;
            this.timesVal.string = this.timesLeft.toString();
            if (this.timesLeft < 10) {
                this.timesVal.node.color = cc.hexToColor("#ef3a40");
            } else {
                this.timesVal.node.color = cc.hexToColor("#ffffff");
            }

            if (this.timesLeft == 0) {
                this.gameOver = true;

                if (this.gotMoreTime) {
                    this.timeIsUpNode.active = false;
                    this.timeIsUpEndNode.active = true;
                } else {

                    if (SDK().hasVideoAd() || true) {
                        // console.log("_______________1")
                        this.timeIsUpNode.active = true;
                    }
                    this.timeIsUpEndNode.active = false;
                }

                this.stopAllAction();
            }
        }
    },

    getMoreTime(event, type) {
        event.target.getComponent(cc.Button).interactable = false;
        //看视频
        if (type == 1) {
            window.gameApplication.onVideoBtnClick(function (isCompleted) {
                if (isCompleted) {
                    this.addTime();
                    this.timeIsUpNode.active = false;
                }
                event.target.getComponent(cc.Button).interactable = true;
            }.bind(this), false);
        }
        //用金币
        else if (type == 2) {
            SDK().getItem("coins", function (coin) {
                if (coin >= 100) {
                    coin = coin - 100;
                    SDK().setItem({ coins: coin })
                    this.addTime();

                } else {
                    window.gameApplication.showCoinView(function (isCompleted) {
                        if (isCompleted) {
                            this.addTime();
                        }
                    }.bind(this), false)
                }
                event.target.getComponent(cc.Button).interactable = true;
            }.bind(this))
        }
    },

    addTime() {
        this.timesLeft = 10;
        this.timesNode.active = true;
        this.timesVal.string = "10"

        var interval = 1;
        var repeat = 10;
        var delay = 1;

        this.timeIsUpNode.active = false;
        this.gotMoreTime = true;
        this.gameOver = false;
        this.unschedule(this.timeOutflow);
        this.schedule(this.timeOutflow, interval, repeat, delay);
    },

    getMoreTimeInv(event) {
        var self = this;
        SDK().getItem("all", function (score) {
            SDK().share(score, function (isCompleted) {
                if (isCompleted) {
                    self.timesLeft = 10;
                    self.timesNode.active = true;
                    self.timesVal.string = "10"

                    var interval = 1;
                    var repeat = 10;
                    var delay = 1;

                    self.gotMoreTime = true;
                    self.gameOver = false;
                    self.unschedule(this.timeOutflow);
                    self.schedule(self.timeOutflow, interval, repeat, delay);
                } else {
                    self.showInvAgain(3, event);
                }
                event.target.getComponent(cc.Button).interactable = true;
            }.bind(this));
        }.bind(this));
    },



    restarGame(delay) {
        this.myRole.node.stopAllActions();
        this.unschedule(this.timeOutflow);
        this.timesVal.node.color = cc.hexToColor("#ffffff");

        this.timeIsUpNode.active = false;
        this.gotMoreTime = false;
        this.endView.active = false;
        this.selectedLines.splice(0, this.selectedLines.length);
        this.enemys.splice(0, this.enemys.length);
        this.helplines.splice(0, this.helplines.length);
        this.helpPath.splice(0, this.helpPath.length);
        this.helpShaked.splice(0, this.helpShaked.length);
        this.isMoving = false;


        //清除当前数据
        this.movesLeft = this.maxValidMoves;
        this.moved = 0;
        this.turnBackCount = 0;

        this.lastDirection = -1;

        if (delay != null && delay > 0) {
            this.scheduleOnce(function () {
                this.gameOver = false;
                this.myRole = null;
                this.initGame();
            }, delay)
        } else {
            this.gameOver = false;
            this.myRole = null;
            this.initGame();
        }
    },

    //获取步数
    getSteps() {
        var lines = [];
        var helpStart = null;
        var helpIdx = 0;
        if (helpStart == null) {
            helpStart = this.checkXY(this.stepsLines[0], 0, 0);
            helpIdx = 0;
        }

        lines.push(cc.v2(helpStart.x, helpStart.y));

        //获得路线
        var stepCount = 1;

        while (helpIdx < this.stepsLines.length) {
            var isContinue = true;
            while (helpIdx < this.stepsLines.length && isContinue) {
                helpStart = this.checkXY(this.stepsLines[helpIdx], 0, 0);
                lines.push(cc.v2(helpStart.x, helpStart.y));
                var hc = this.getCellByCoordinate(helpStart);
                if (hc) {
                    var canMove = this.checkCanMoveCount(this.checkMove(helpStart));
                    if (canMove > 2 && lines.length > 1) {
                        isContinue = false;
                        stepCount++;
                    }
                }
                helpIdx++;
            }
        }

        //console.log(stepCount);
        return stepCount;
    },

    help() {
        if (this.gameOver || this.myRole == null) {
            return;
        }
        //判断已走的路径有没有途径点（找到起点）
        if (this.helpPath.length <= 0) {
            return;
        }

        var helpStart = null;
        var helpIdx = 0;
        if (this.selectedLines.length > 0) {
            for (var i = this.helpPath.length - 1; i >= 0; i--) {
                var tmpPath = this.checkXY(this.helpPath[i], 0, 0);
                var path = cc.v2(tmpPath.x, tmpPath.y);
                for (var j = this.selectedLines.length - 1; j >= 0; j--) {
                    var selected = this.selectedLines[j];
                    if (helpStart == null && path.equals(selected)) {
                        helpStart = path;
                        helpIdx = i;
                        break;
                    }
                }
            }
        }

        // cc.log("helpStart:",helpStart)
        if (helpStart == null) {
            helpStart = this.checkXY(this.helpPath[0], 0, 0);
            helpIdx = 0;
        }
        // cc.log("helpStart:",helpStart)

        this.showHelpLine(helpStart, helpIdx);
    },


    showHelpLine(helpStart, helpIdx) {
        if (this.helpPath.length <= 0) {
            return;
        }
        // cc.log("helpIdx:",helpIdx);

        var self = this;

        var startV2 = cc.v2(helpStart.x, helpStart.y);
        // cc.log("startV2:",startV2);
        if (this.helplines.length > 0) {
            startV2 = this.helplines[this.helplines.length - 1];
        }

        //如果startV2已经在heleLines里了，那么从helpLines最后一个节点开始
        // for(var i = this.helpPath.length-1;i >= 0;i--){
        for (var i = 0; i < this.helpPath.length; i++) {
            var v2 = this.helpPath[i];
            // cc.log("__v2:",v2)
            if (startV2.equals(v2)) {
                startV2 = cc.v2(v2.x, v2.y);
                helpIdx = i;
                // cc.log("edit_startV2:",startV2);
                // cc.log("__helpIdx:",helpIdx);
                break;
            }
        }
        // cc.log("this.helpPath.length-1:",this.helpPath.length-1)
        if (helpIdx < this.helpPath.length - 1) {
            this.helpCount--;
        }


        // var helplines = [];

        if (this.helplines.length <= 0) {
            if (!startV2.equals(this.myRole.axialCoordinate) && Utils.isNeighbors(startV2, this.myRole.axialCoordinate)) {
                self.helplines.push(cc.v2(this.myRole.axialCoordinate.x, this.myRole.axialCoordinate.y));
            }
            self.helplines.push(cc.v2(startV2.x, startV2.y));
            // cc.log("__self.helplines:",self.helplines);
        }

        //获得路线
        var isContinue = true;
        while (++helpIdx < this.helpPath.length && isContinue) {
            helpStart = this.checkXY(this.helpPath[helpIdx], 0, 0);
            self.helplines.push(cc.v2(helpStart.x, helpStart.y));
            var hc = self.getCellByCoordinate(helpStart);
            //console.log("helpStart:", helpStart);
            //console.log("hc:", hc);
            if (hc) {
                var canMove = this.checkCanMoveCount(this.checkMove(helpStart));
                if (canMove > 2 && self.helplines.length > 1 && !hc.isIce && self.helplines.length > self.selectedLines.length) {
                    isContinue = false;
                }
            }
        }

        // cc.log("self.helplines:",self.helplines);
        //绘制路线
        if (self.helplines.length > 1) {

            // for(var i = 0;i < this.allCells.length;i++){
            //     var hc = this.allCells[i];
            //     hc.hideHelpLine();
            // }

            for (var i = 0; i < self.helplines.length; i++) {
                var tmp_coordinate = self.helplines[i];
                var hc = self.getCellByCoordinate(tmp_coordinate);
                if (hc) {
                    if (i == 0) {
                        hc.showStartHelp(self.helplines[i + 1]);
                    } else if (i == self.helplines.length - 1) {
                        hc.showEndHelp(self.helplines[self.helplines.length - 2]);
                    } else {
                        hc.showHelp(self.helplines[i - 1], self.helplines[i + 1]);
                    }

                }
            }
        }

        // cc.log("self.helplines:",self.helplines);

    },


    update(dt) {
        if (this.gameOver) {
            return;//stop game
        }
        // cc.log("this.enemys.length:",this.enemys.length)
        if (this.enemys.length > 0) {

            //移动
            for (var i = 0; i < this.enemys.length; i++) {
                var enemy = this.enemys[i];
                this.roundMove(enemy);
            }
        }

        //炮塔发射子弹
        if (this.allTowers.length > 0) {
            for (var i = 0; i < this.allTowers.length; i++) {
                var tower = this.allTowers[i];
                this.towerShoot(tower);
            }
        }


    },

    //炮塔发射子弹
    towerShoot(tower) {
        if (!tower.isShooting) {
            tower.isShooting = true;
            tower.bubble.active = true;
            var canMove = this.checkMove(tower.bubbleAxialCoordinate);

            var direction = -1;
            if ((tower.direction != -1 && canMove[tower.direction])) {
                direction = tower.direction;
            }

            if (direction == -1) {
                // cc.log("打到墙了，再往前移动半个格子",canMove,tower)
                // var movePlus = this.movePlus[tower.direction];
                // var hcPos = cc.pCompMult(cc.v2(0.2,0.2),cc.pCompMult(cc.v2(hexTileHeight,hexTileHeight),movePlus));
                // var a1 = cc.moveBy(tower['s']*0.3*0.3,hcPos.x ,hcPos.y);
                //cb
                var cb1 = cc.callFunc(function () {
                    //播放炸开动画
                    tower.bubble.getComponent("NormalAnimation").play();
                }, this);
                var delay0 = cc.delayTime(1.0);

                var cb2 = cc.callFunc(function () {
                    //重置
                    tower.bubbleAxialCoordinate = tower.axialCoordinate;
                    tower.bubble.position = cc.pCompMult(tower.node.getPosition(), cc.v2(0.5, 0.5));
                    tower.bubble.opacity = 0;
                }, this);
                //TODO，等待多少秒后，再次发射
                var delay = cc.delayTime(tower['delay']);
                var cb4 = cc.callFunc(function () {
                    //重置
                    tower.isShooting = false;
                    tower.bubble.opacity = 255;
                }, this);

                var seq = cc.sequence(cb1, delay0, cb2, delay, cb4);
                tower.bubble.runAction(seq);
            } else {
                // cc.log("hexTileHeight:",hexTileHeight)
                // var scale = hexTileHeight;
                var scale = hexTileHeight / 100;

                var nextPos = tower.bubbleAxialCoordinate.add(this.movePlus[direction]);
                var hc = this.getCellByCoordinate(nextPos);

                // cc.log("nextPos",nextPos);
                // var hcPos = tower.bubble.getPosition();
                // var movePlus = this.movePlus[direction];
                // hcPos = hcPos.add(cc.pCompMult(cc.v2(hexTileHeight,hexTileHeight),nextPos));
                //  cc.log("_______movePlus:",cc.pCompMult(cc.v2(hexTileHeight,hexTileHeight),movePlus))

                // var hcPos = cc.pCompMult(cc.v2(hexTileHeight,hexTileHeight),this.movePlus[direction]);
                // var hcPos = tower.bubble.convertToNodeSpaceAR(worldPosition);

                let worldPosition = this.tileBox.convertToWorldSpaceAR(hc.node.getPosition());
                var hcPos_tmp = tower.node.convertToNodeSpaceAR(worldPosition);

                var hcPos;
                // hcPos = hc.node.convertToWorldSpaceAR(hcPos)
                // hcPos = tower.bubble.convertToNodeSpaceAR(hcPos);
                // cc.log("++++++++++++worldPosition:",worldPosition)
                // cc.log("++++++++++++hcPos:",hcPos)
                // cc.log("direction:",direction)

                if (direction == 1) {
                    hcPos = cc.v2(hcPos_tmp.y * -1, hcPos_tmp.x * -1);
                } else if (direction == 2) {
                    hcPos = cc.v2(hcPos_tmp.x * -1, hcPos_tmp.y * -1);
                } else if (direction == 3) {
                    hcPos = cc.v2(hcPos_tmp.y, hcPos_tmp.x);
                } else {
                    hcPos = cc.v2(hcPos_tmp.x, hcPos_tmp.y);
                }

                var a1 = cc.moveTo(tower['s'] * 0.3, hcPos.y, hcPos.x);
                //cb
                var cb1 = cc.callFunc(function () {
                    //更新位置
                    tower.bubbleAxialCoordinate = nextPos;
                    tower.isShooting = false;
                }, this);

                var seq = cc.sequence(a1, cb1);
                tower.bubble.runAction(seq);

            }
        }
    },

    //怪物自动移动
    roundMove(enemy) {
        if (!enemy.isMoving) {
            enemy.isMoving = true;
            var canMove = this.checkMove(enemy.axialCoordinate);

            var direction = -1;

            if ((enemy.direction != -1 && canMove[enemy.direction] && this.checkMoveDirectionCount(canMove, enemy.direction) == 1) || (enemy.direction != -1 && canMove[enemy.direction] && Math.random() > 0.6)) {
                direction = enemy.direction;
            } else {
                while (direction == -1) {
                    var idx = Utils.GetRandomNum(0, 3);
                    if (canMove[idx]) {
                        direction = idx;
                    }
                }
            }

            enemy.direction = direction;

            var nextPos = enemy.axialCoordinate.add(this.movePlus[direction]);
            var hc = this.getCellByCoordinate(nextPos);

            var hcPos = hc.node.getPosition();
            var a1 = cc.moveTo(1, hcPos.x, hcPos.y);
            //cb
            var cb1 = cc.callFunc(function () {

                //更新位置
                enemy.axialCoordinate = nextPos;
                enemy.isMoving = false;
            }, this);

            var seq = cc.sequence(a1, cb1);
            enemy.node.runAction(seq);
        }

    },

    /**
     * 当屏幕点击
    */
    onMouseDown(event) {
        if (this.gameOver || this.myRole == null) {
            return;
        }
        this.mouseIsDown = true;
        this.touchPos = this.tileBox.convertToNodeSpaceAR(event.getLocation());
    },

    onMouseMove(event) {
        if (this.gameOver || this.myRole == null) {
            return;
        }
        if (this.mouseIsDown) {
            var movePos = this.tileBox.convertToNodeSpaceAR(event.getLocation());

            var offsetX = movePos.x - this.touchPos.x;
            var offsetY = movePos.y - this.touchPos.y;

            if (Math.abs(offsetX) < 30 && Math.abs(offsetY) < 30) {
                return;
            }

            //根据X方向与Y方向的偏移量大小的判断  
            if (Math.abs(offsetX) > Math.abs(offsetY)) {
                if (offsetX < 0) {
                    // cc.log("左")
                    this.doAction(1, true);   //左
                }
                else {
                    // cc.log("右")
                    this.doAction(3, true);   //右边
                }
            }
            else {
                if (offsetY > 0) {
                    this.doAction(0, true);   //上
                }
                else {
                    this.doAction(2, true);//下
                }
            }

            this.mouseIsDown = false;
        }
    },


    getCellByCoordinate(_coordinate) {
        for (var i = 0; i < this.allCells.length; i++) {
            var hc = this.allCells[i];
            if (hc.axialCoordinate.equals(_coordinate)) {
                return hc;
            }
        }
        return null;
    },

    stopAllAction() {
        cc.log("stopAllAction")
    },

    die() {
        this.unschedule(this.timeOutflow);
        this.gameOver = true;
        //播放死亡动画
        this.myRole.playDie();
        this.gameApplication.soundManager.playSound("error");
        this.scheduleOnce(function () {
            this.gameApplication.openMainView();
        }.bind(this), 1)
    },

    showGameOver() {

        //预加载下一关
        if (bid != null && bid > 0 && mid != null && mid > 0 && lid != null && lid > 0) {
            var arr = [];
            if (lid < 100) {
                arr.push(lid + 1);
            }
            arr.forEach(function (tmp_lid) {
                var tmp_path = "conf/level_detail/b_" + bid + "/" + mid + "/" + tmp_lid;
                window.gameApplication.getConf(tmp_path, null);
            });
        }

        this.gameApplication.soundManager.playSound("gamewin");

        this.unschedule(this.timeOutflow);
        this.timeIsUpNode.active = false;

        // cc.log("_______________showGameOver");
        var self = this;
        this.gameOver = true;
        this.endView.active = true;

        this.stopAllAction();

        var curr_star = 0;

        if (this.turnBackCount <= 0) {
            curr_star = 3;
        } else if (this.turnBackCount <= 6) {
            curr_star = 2;
        } else {
            curr_star = 1;
        }

        if (curr_star == 3) {
            this.endView_title.string = "GREAT";
        } else if (curr_star == 2) {
            this.endView_title.string = "GOOD";
        } else {
            this.endView_title.string = "CLEAR";
        }
        this.endView_title.string = "COMPLETED";

        this.endView_text.string = "You finish with " + this.moved + " moves";
        this.giftBtn.active = true;


        //最好成绩
        SDK().getItem(bid + "_" + mid + "_" + lid, function (star) {
            //console.log(bid + "_" + mid + "_" + lid)
            //设置最后玩的关卡
            SDK().getItem("curIdx", function (idx) {
                var curIdx = this.judgeIdx(mid, lid);
                //console.log(curIdx)
                if (curIdx + 1 > idx) {
                    var param = {};
                    window.curIdx = curIdx + 1;
                    param.curIdx = window.curIdx;
                    SDK().setItem(param, function () {
                        window.mainScirpt.initStage(window.curIdx);
                    }.bind(this));
                }
            }.bind(this))

            //如果当前星星大于历史最高，那么保存
            if (star < 1) {
                var param = {};
                param[bid + "_" + mid + "_" + lid] = 1;
                var saveCount = 0;
                SDK().setItem(param, function () {
                    saveCount++;
                    if (saveCount >= 2) {
                        this.scheduleOnce(function () {
                            this.endView.active = false;
                            var curIdx = this.judgeIdx(mid, lid);
                            window.mainScirpt.initStage(curIdx);
                            this.gameApplication.openMainView(true);
                            if (curIdx % 10 == 0 && curIdx != 0) {
                                window.timeGiftScript.showTimeGiftView(2);
                            }
                        }.bind(this), 1)
                    }
                }.bind(this));

                //保存个人星星
                var plusStar = curr_star - star;
                SDK().getItem("all", function (score) {
                    score += 1;
                    SDK().setRankScore(2, score, "{}", null);
                    SDK().setItem({ all: score }, function () {
                        saveCount++;
                        if (saveCount >= 2) {
                            this.scheduleOnce(function () {
                                this.endView.active = false;
                                var curIdx = this.judgeIdx(mid, lid);
                                window.mainScirpt.initStage(curIdx);
                                this.gameApplication.openMainView(true);
                                if (curIdx % 10 == 0 && curIdx != 0) {
                                    window.timeGiftScript.showTimeGiftView(2);
                                }
                            }.bind(this), 1)
                        }
                    }.bind(this));
                }.bind(this));

                //保存mid关卡的星星
                SDK().getItem(bid + "_" + mid, function (score) {
                    score += 1;
                    var param = {};
                    param[bid + "_" + mid] = score;
                    SDK().setItem(param, null);
                }.bind(this));
            } else {
                this.scheduleOnce(function () {
                    this.endView.active = false;
                    this.gameApplication.openMainView();
                }.bind(this), 1)
            }
        }.bind(this));


        SDK().getItem(bid + "_" + mid + "_" + lid + "_moves", function (best) {
            if (self.moved < best || best <= 0) {
                //保存历史最小步数
                var param = {};
                param[bid + "_" + mid + "_" + lid + "_moves"] = self.moved;
                SDK().setItem(param, null);
            }
        }.bind(this));

        this.gameApplication.playTimes++;
    },

    //判断所在关卡
    judgeIdx(mid, lid) {
        var idx = 0;
        if (lid >= 50) {
            lid = lid - 50;
            idx = 300;
            idx = idx + ((mid - 1) * 10) + (Math.floor((lid - 1) / 10) * 50) + lid % 10;
        } else {
            idx = ((mid - 1) * 10) + (Math.floor((lid - 1) / 10) * 60) + (lid - 1) % 10;
        }
        return idx;
    },

    onOpAdClicked() {
        if (this.opad_game_id != null) {
            SDK().switchGameAsync(this.opad_game_id);
        }
        // SDK().onOpAdBtnClicked();
    },


    checkWin() {
        var isWin = this.myRole.axialCoordinate.equals(this.endObj.axialCoordinate);
        if (isWin) {
            // cc.log("到达终点，游戏结束");
            this.showGameOver();
        }
        return isWin;
    },

    moveEnd() {
        this.isMoving = false;


        //检查胜利
        if (!this.checkWin()) {
            var canMove = this.checkMove();
            this.gameApplication.soundManager.playSound("done");

            //检查当前是否在冰上，并且前方可以走
            var hc = this.getCellByCoordinate(this.myRole.axialCoordinate);
            if (hc.isIce && canMove[this.lastDirection]) {
                //继续行走
                this.doAction(this.lastDirection, true);
            } else {
                //检查箭头
                this.moved++;
                this.movesLeft--;
                if (this.turnBackCount > 0 && this.turnBackCount % 2 == 0 && !Utils.inArray(this.turnBackCount, this.helpShaked)) {
                    this.helpBtnShake();
                    this.helpShaked.push(this.turnBackCount);
                }
                this.myRole.setArrow(canMove[0], canMove[1], canMove[2], canMove[3]);
            }
        }

        this.updateUI();
    },

    addSelectedLines(coordinate) {
        var self = this;
        if (this.selectedLines.length >= 2 && coordinate.equals(this.selectedLines[this.selectedLines.length - 2])) {
            var tmp_coordinate = this.selectedLines.pop();
            var hc = this.getCellByCoordinate(tmp_coordinate);
            hc.hideLine();

        } else {
            this.selectedLines.push(cc.v2(coordinate.x, coordinate.y));
        }

        if (this.selectedLines.length > 1) {

            this.scheduleOnce(function () {
                //绘制路线
                for (var i = 0; i <= self.selectedLines.length - 1; i++) {
                    var tmp_coordinate = self.selectedLines[i];
                    var hc = self.getCellByCoordinate(tmp_coordinate);
                    hc.hideLine();
                }
                for (var i = 0; i <= self.selectedLines.length - 1; i++) {
                    var tmp_coordinate = self.selectedLines[i];
                    var hc = self.getCellByCoordinate(tmp_coordinate);
                    if (i == 0) {
                        hc.showStartLine(self.selectedLines[i + 1]);
                    } else if (i == self.selectedLines.length - 1) {
                        hc.showEndLine(self.selectedLines[self.selectedLines.length - 2]);
                    } else {
                        hc.showLine(self.selectedLines[i - 1], self.selectedLines[i + 1]);
                    }
                }
            }, 0.08)


        }

    },

    //移动
    doAction(direction, manual) {
        if (this.isMoving || this.gameOver) {
            return;
        }

        this.isMoving = true;
        this.myRole.hideArrow();
        var self = this;
        var canMove = this.checkMove();

        if (!manual && this.checkMoveDirectionCount(canMove, direction) > 1) {
            //遇到路口停止
            // cc.log("遇到路口停止",this.checkMoveDirectionCount(canMove,direction))
            this.moveEnd();
            return;
        }

        if (canMove[direction]) {
            var nextPos = this.myRole.axialCoordinate.add(this.movePlus[direction]);
            var hc = this.getCellByCoordinate(nextPos);

            // cc.log("可以移动到",nextPos)
            if (hc != null) {

                //检查是否走回头路
                var isTurnBack = false;
                if (direction == 0) {

                    isTurnBack = this.lastDirection == 2;
                } else if (direction == 3) {
                    isTurnBack = this.lastDirection == 1;
                } else if (direction == 1) {

                    isTurnBack = this.lastDirection == 3;
                } else {
                    isTurnBack = this.lastDirection == 0;
                }
                if (isTurnBack) {
                    this.turnBackCount++;
                }


                this.lastDirection = direction;

                var hcPos = hc.node.getPosition();
                var a1 = cc.moveTo(0.12, hcPos.x, hcPos.y);
                //cb
                var cb1 = cc.callFunc(function () {

                    //更新位置
                    self.myRole.axialCoordinate = nextPos;
                    self.isMoving = false;
                    if (!self.checkWin()) {
                        self.doAction(direction, false);
                    }
                }, this);

                //路线
                this.addSelectedLines(nextPos);

                var seq = cc.sequence(a1, cb1);
                self.myRole.node.runAction(seq);
            }

        } else {
            this.gameApplication.soundManager.playSound("done");

            if (this.checkMoveDirectionCount(canMove, direction) == 1) {
                direction = this.getkMoveDirection(canMove, direction);
                // cc.log("遇到路口，但只有一个路径。改变路径：",direction)   
                if (!this.checkWin()) {
                    var hc = this.getCellByCoordinate(this.myRole.axialCoordinate);
                    if (!hc.isIce) {
                        this.isMoving = false;
                        self.doAction(direction, true);
                    } else {
                        this.moveEnd();
                    }
                }
            } else {
                // cc.log("不能移动",direction)    
                this.moveEnd();
            }
        }
    },

    //获取唯一可以移动的路径
    getkMoveDirection(canMove, direction) {
        var c;
        //t,l,d,r
        if (direction == 0) {
            c = 2;
        } else if (direction == 3) {
            c = 1;
        } else if (direction == 1) {
            c = 3;
        } else {
            c = 0;
        }
        var count = 0;
        for (var i = 0; i < canMove.length; i++) {
            var v = canMove[i];
            if (v && i != c)
                return i;
        };
    },

    checkCanMoveCount(canMove) {
        var c;
        var count = 0;
        for (var i = 0; i < canMove.length; i++) {
            var v = canMove[i];
            if (v)
                count++;
        };
        return count;
    },


    //获取可以移动的方向，不算direction的反方向
    checkMoveDirectionCount(canMove, direction) {
        var c;
        //t,l,d,r
        if (direction == 0) {
            c = 2;
        } else if (direction == 3) {
            c = 1;
        } else if (direction == 1) {
            c = 3;
        } else {
            c = 0;
        }
        var count = 0;
        for (var i = 0; i < canMove.length; i++) {
            var v = canMove[i];
            if (v && i != c)
                count++;
        };
        return count;
    },

    //检查可以移动的方向
    checkMove(axialCoordinate) {
        if (axialCoordinate == null) {
            axialCoordinate = this.myRole.axialCoordinate;
        }

        var neighbors = Utils.getNeighborsOBJ(axialCoordinate);
        var t = true, l = true, d = true, r = true;

        var hc = this.getCellByCoordinate(axialCoordinate);
        if (hc != null) {
            if (hc.leftActive) {
                l = false;
            }
            if (hc.rightActive) {
                r = false;
            }
            if (hc.topActive) {
                t = false;
            }
            if (hc.bottomActive) {
                d = false;
            }
        }

        if (t) {
            var tc = this.getCellByCoordinate(neighbors.t);
            if (tc != null && tc.bottomActive) {
                t = false;
            }
        }

        if (d) {
            var dc = this.getCellByCoordinate(neighbors.b);
            if (dc != null && dc.topActive) {
                d = false;
            }
        }

        if (l) {
            var lc = this.getCellByCoordinate(neighbors.l);
            if (lc != null && lc.rightActive) {
                l = false;
            }
        }

        if (r) {
            var rc = this.getCellByCoordinate(neighbors.r);
            if (rc != null && rc.leftActive) {
                r = false;
            }
        }

        return [t, l, d, r]


    },

    checkMovePos(axialCoordinate) {
        if (axialCoordinate == null) {
            axialCoordinate = this.myRole.axialCoordinate;
        }

        var neighbors = Utils.getNeighborsOBJ(axialCoordinate);
        var t = neighbors.t, l = neighbors.l, d = neighbors.b, r = neighbors.r;

        var hc = this.getCellByCoordinate(axialCoordinate);
        if (hc != null) {
            if (hc.leftActive) {
                l = cc.v2(-1, -1);
            }
            if (hc.rightActive) {
                r = cc.v2(-1, -1);
            }
            if (hc.topActive) {
                t = cc.v2(-1, -1);
            }
            if (hc.bottomActive) {
                d = cc.v2(-1, -1);
            }
        }

        if (t) {
            var tc = this.getCellByCoordinate(neighbors.t);
            if (tc != null && tc.bottomActive) {
                t = cc.v2(-1, -1);
            }
        }

        if (d) {
            var dc = this.getCellByCoordinate(neighbors.b);
            if (dc != null && dc.topActive) {
                d = cc.v2(-1, -1);
            }
        }

        if (l) {
            var lc = this.getCellByCoordinate(neighbors.l);
            if (lc != null && lc.rightActive) {
                l = cc.v2(-1, -1);
            }
        }

        if (r) {
            var rc = this.getCellByCoordinate(neighbors.r);
            if (rc != null && rc.leftActive) {
                r = cc.v2(-1, -1);
            }
        }

        return [t, l, d, r]


    },

    createEnemy(enemys) {
        var scale = hexTileHeight / 100;

        if (enemys.length <= 0) {
            return;
        }

        for (var i = 0; i < enemys.length; i++) {
            var enemy = enemys[i];
            var hc = this.getCellByCoordinate(cc.v2(enemy.x, enemy.y));

            var enemy_GO;
            var random = Math.random();
            if (random < 0.33) {
                enemy_GO = cc.instantiate(this.enemyPrefab);
            } else if (random < 0.66) {
                enemy_GO = cc.instantiate(this.enemyPrefab1);
            } else {
                enemy_GO = cc.instantiate(this.enemyPrefab2);
            }
            enemy_GO.parent = this.tileBox;
            enemy_GO.setScale(scale);
            enemy_GO.setPosition(hc.node.getPosition());
            enemy_GO.active = true;

            //auto color colors
            // enemy_GO.getChildByName("enemy").color = cc.hexToColor(colors[Utils.GetRandomNum(0,colors.length-1)]);

            var enemy = enemy_GO.getComponent(Enemy);
            enemy.axialCoordinate = hc.axialCoordinate;
            this.enemys.push(enemy);
        }
    },

    createRole(start, end) {
        var scale = hexTileHeight / 100;

        start = this.checkXY(start, 0, 0);
        end = this.checkXY(end, 0, 0);

        var hc = this.getCellByCoordinate(cc.v2(start.x, start.y));
        var hc1 = this.getCellByCoordinate(cc.v2(end.x, end.y));

        var role_GO = cc.instantiate(this.rolePrefab);
        role_GO.parent = this.tileBox;
        role_GO.setScale(scale);
        role_GO.setPosition(hc.node.getPosition());
        role_GO.active = true;

        var role = role_GO.getComponent(Role);
        this.myRole = role;
        this.myRole.init();
        this.myRole.axialCoordinate = hc.axialCoordinate;
        this.selectedLines.push(cc.v2(hc.axialCoordinate.x, hc.axialCoordinate.y));
        var canMove = this.checkMove();
        this.myRole.setArrow(canMove[0], canMove[1], canMove[2], canMove[3]);

        var end_GO = cc.instantiate(this.endPrefab);
        end_GO.parent = this.tileBox;
        end_GO.setScale(scale);
        end_GO.setPosition(hc1.node.getPosition());
        end_GO.active = true;
        this.endNode = end_GO;

        var endObj = end_GO.getComponent(Role);
        this.endObj = endObj;
        this.endObj.axialCoordinate = hc1.axialCoordinate;

        this.myRole.gameView = this;
        this.myRole.setDark(mid == 4);

    },

    //发送碰撞即死亡
    collisionCallback() {
        // cc.log(this)
        this.die();
    },

    //初始化格子
    createGrid(_levelDimensions, walls, ices, towers, cb) {
        this.gridOffset.x = 0;
        this.gridOffset.y = 0;
        var maxL = Math.max(_levelDimensions.x, _levelDimensions.y);
        // cc.log ("maxL:" + maxL);
        var winSize = cc.director.getWinSize();
        var tileBoxSize = this.tileBox.getContentSize();
        var tileBoxHeight = tileBoxSize.height;
        var hexH = winSize.width;
        hexTileHeight = (hexH - (lineWidth - lineWidth * _levelDimensions.x)) / _levelDimensions.x;
        // cc.log("hexTileHeight:",hexTileHeight);

        var nowHeight = (hexTileHeight * _levelDimensions.y);

        // cc.log("hexTileHeight:",hexTileHeight);
        // cc.log("tileBoxHeight:",tileBoxHeight);
        // cc.log("nowHeight:",nowHeight);
        // 1065    1335.1789638932496
        if (tileBoxHeight < nowHeight) {
            hexH = tileBoxSize.height;
            var testHexTileHeight = (hexH - (lineWidth - lineWidth * _levelDimensions.y)) / _levelDimensions.y;
            // cc.log("testHexTileHeight:",testHexTileHeight);
            if (testHexTileHeight < hexTileHeight) {
                hexTileHeight = testHexTileHeight;
                this.gridOffset.x = (winSize.width - (_levelDimensions.x * hexTileHeight) + _levelDimensions.x * lineWidth) * 0.5;
            }
            // cc.log("hexTileHeight:",hexTileHeight);
            // cc.log("winSize.width:",winSize.width);
            // cc.log("this.levelDimensions.x:",this.levelDimensions.x);
            // cc.log("this.levelDimensions.x * hexTileHeight:",this.levelDimensions.x * hexTileHeight);

        }

        // cc.log("tileBox:",this.tileBox.getContentSize());

        sideLength = hexTileHeight;
        // cc.log ("sideLength:" + sideLength);

        var sizeW = sideLength;
        var sizeH = sideLength;

        this.levelDimensions = _levelDimensions;

        var hexTile;
        var hc;
        var axialPoint = cc.v2(0, 0);
        var screenPoint = cc.v2(0, 0);

        var test = (tileBoxSize.height - (this.levelDimensions.y * hexTileHeight) + this.levelDimensions.y * lineWidth) * 0.5
        this.gridOffset.y = (tileBoxSize.height * -1) + test;

        //loop through the rows & columns 

        for (var i = 0; i < this.levelDimensions.x; i++) {
            for (var j = 0; j < this.levelDimensions.y; j++) {
                axialPoint.x = i;
                axialPoint.y = j;
                // cc.log("axialPoint:",axialPoint);
                //convert offset points to axial points
                // axialPoint = Utils.offsetToAxial(axialPoint);
                // cc.log("axialPoint:",axialPoint);

                //convert axial points to screen points
                screenPoint = Utils.axialToScreen(axialPoint, sideLength);
                // cc.log ("screenPoint:" ,screenPoint);
                //add the grid offset value to position the grid
                screenPoint.x += this.gridOffset.x;
                screenPoint.y += this.gridOffset.y;

                // cc.log ("screenPoint:" + screenPoint.x+"___"+screenPoint.y);
                //place new hextile
                hexTile = cc.instantiate(this.hexCellPrefab);
                hexTile.parent = this.tileBox;

                hexTile.setPosition(screenPoint.add(cc.v2(0, 1000)));
                hexTile.setContentSize(cc.size(sizeW, sizeW));
                hexTile.active = true;

                var self = this;
                if (j % 2 == 0) {
                    hexTile.runAction(cc.sequence(
                        cc.moveTo(0.2 + (0.05 * axialPoint.y), screenPoint.x, screenPoint.y),
                        cc.callFunc(function () {
                            self.gameApplication.soundManager.playSound("uplock");
                        })
                    ));
                    // hexTile.runAction(cc.moveTo(0.2+(0.05*axialPoint.y), screenPoint.x,screenPoint.y));
                } else {
                    hexTile.runAction(cc.moveTo(0.2 + (0.05 * axialPoint.y), screenPoint.x, screenPoint.y));
                }



                //we will identify hextile by name
                hexTile.name = "grid" + i.toString() + "_" + j.toString();
                hexTile.zIndex = 0;

                hc = hexTile.getComponent(HexCell);
                hc.scaleChild(sizeW / 100, sizeW / 100);

                // //store the converted axial coordinate inside the hexcell for easier reference
                hc.axialCoordinate = axialPoint;
                // //add to the list
                this.allCells.push(hc);
            }
        }

        if (walls == null || walls.length <= 0) {
            return;
        }

        var self = this;
        var wx = 0, wy = 0, dx = 0, dy = 0;
        for (var i = 0; i < walls.length; i++) {
            // for(var i =0;i<20;i++){
            var wall = walls[i];
            var tmp_w1 = self.checkXY(wall['w1'], wx, wy);
            var tmp_d1 = self.checkXY(wall['d1'], dx, dy);
            var w1;
            var d1;

            // dx = d1.x;
            // dy = d1.y; 
            // cc.log("w1:",w1);
            // cc.log("w1-x:"+tmp_w1.x+",w1-y:"+tmp_w1.y+"_____d1-x:"+tmp_d1.x+",d1-y:"+tmp_d1.y);
            //设置
            var hc;
            if (tmp_w1.x < tmp_d1.x || tmp_w1.y > tmp_d1.y) {
                w1 = tmp_w1;
                d1 = tmp_d1;
            } else {
                w1 = tmp_d1;
                d1 = tmp_w1;
            }

            if (hc = this.getCellByCoordinate(cc.v2(w1.x, w1.y - 1))) {
                if (w1.x == d1.x) {
                    //画竖线
                    // cc.log("setLeft")
                    hc.setLeft(true);
                } else {
                    // cc.log("setTop")
                    hc.setTop(true);

                }
            } else if (hc = this.getCellByCoordinate(cc.v2(w1.x, w1.y))) {
                if (w1.x == d1.x) {
                    // cc.log("setRight")       
                    hc.setRight(true);
                } else {
                    // cc.log("setBottom")       
                    hc.setBottom(true);

                }
            } else if (hc = this.getCellByCoordinate(cc.v2(w1.x - 1, w1.y - 1))) {
                // cc.log("hchchchchc",hc)
                if (w1.x == d1.x) {
                    // cc.log("seRight")       
                    hc.setRight(true);
                } else {
                    // cc.log("setBottom")       
                    hc.setBottom(true);

                }
            }
        };

        //播放动画
        this.scheduleOnce(function () {

            this.scheduleOnce(function () {
                if (ices != null && ices.length > 0) {
                    for (var i = 0; i < ices.length; i++) {
                        var ice = ices[i];
                        var hc = this.getCellByCoordinate(cc.v2(ice.x, ice.y));

                        if (hc != null) {
                            hc.setIce(true);
                            var iceNode = cc.instantiate(this.icePrefab);
                            iceNode.parent = this.iceBox;

                            iceNode.setPosition(hc.node.getPosition());
                            iceNode.setContentSize(hc.node.getContentSize());
                            iceNode.active = true;

                            iceNode.setScale(0.3, 0.3);
                            iceNode.runAction(cc.scaleTo(0.35, 1, 1))
                        }
                    }
                }
            }.bind(this),1)


            // cc.log("towers:",towers)
            if (towers != null && towers.length > 0) {
                for (var i = 0; i < towers.length; i++) {
                    var tower = towers[i];
                    // cc.log("tower:",tower)


                    var tmp_w1 = self.checkXY(tower['w1'], wx, wy);
                    var tmp_d1 = self.checkXY(tower['d1'], dx, dy);
                    var w1;
                    var d1;

                    // dx = d1.x;
                    // dy = d1.y; 
                    // cc.log("w1:",w1);
                    //设置
                    var hc = null;
                    if (tmp_w1.x < tmp_d1.x || tmp_w1.y > tmp_d1.y) {
                        w1 = tmp_w1;
                        d1 = tmp_d1;
                    } else {
                        w1 = tmp_d1;
                        d1 = tmp_w1;
                    }

                    // cc.log("w1-x:"+tmp_w1.x+",w1-y:"+tmp_w1.y+"_____d1-x:"+tmp_d1.x+",d1-y:"+tmp_d1.y);

                    if (tower['direction'] == 1) {
                        hc = this.getCellByCoordinate(cc.v2(Math.max(w1.x, d1.x) - 1, d1.y));
                        if (hc == null) {
                            hc = this.getCellByCoordinate(cc.v2(Math.max(w1.x, d1.x), d1.y));
                        }
                    }
                    else if (tower['direction'] == 3) {
                        hc = this.getCellByCoordinate(cc.v2(Math.max(w1.x, d1.x), d1.y));
                        if (hc == null) {
                            hc = this.getCellByCoordinate(cc.v2(Math.max(w1.x, d1.x) - 1, d1.y));
                        }
                    }
                    else if (tower['direction'] == 0) {
                        hc = this.getCellByCoordinate(cc.v2(w1.x, Math.min(w1.y, d1.y)));
                        if (hc == null) {
                            hc = this.getCellByCoordinate(cc.v2(w1.x, Math.max(w1.y, d1.y)));
                        }
                    }
                    else if (tower['direction'] == 2) {
                        hc = this.getCellByCoordinate(cc.v2(w1.x, Math.max(w1.y, d1.y) - 1));
                        if (hc == null) {
                            hc = this.getCellByCoordinate(cc.v2(w1.x, Math.max(w1.y, d1.y)));
                        }
                    }

                    if (hc != null) {
                        if (w1.x == d1.x) {
                            //画竖线
                            if (tower['direction'] == 1) {
                                hc.setRightTower(true);
                                this.pushTower(hc.rightTower, hc.axialCoordinate, tower);
                            } else {
                                hc.setLeftTower(true);
                                this.pushTower(hc.leftTower, hc.axialCoordinate, tower);
                            }
                        } else {
                            if (tower['direction'] == 0) {
                                hc.setTopTower(true);
                                this.pushTower(hc.topTower, hc.axialCoordinate, tower);
                            } else {
                                hc.setBottomTower(true);
                                this.pushTower(hc.bottomTower, hc.axialCoordinate, tower);
                            }
                        }

                        hc.node.zIndex = 1;
                    }
                }
            }

            if (cb) {
                cb();
            }
        }.bind(this), 0.5 + (0.05 * this.levelDimensions.y));
    },

    //将tower push到this.allTowers
    pushTower(node, axialCoordinate, config) {
        var tower = node.getComponent(Tower);
        tower.axialCoordinate = axialCoordinate;
        tower.init(config);
        this.allTowers.push(tower)
    },


    checkXY(dict, x, y) {
        // if(dict['x'] == null && dict['y'] == null){
        //     return null;
        // }
        // cc.log("dict:",dict);
        if (dict['x'] == null) {
            dict['x'] = y;
        }
        if (dict['y'] == null) {
            dict['y'] = x;
        }

        return dict;
    },

    updateUI() {

        // JsonObject act = new JsonObject() { 
        //     { "type", "updateUI" },
        // };
        // DoLuaAction (act.ToString());

        //
        this.moves.string = this.movesLeft + "/" + this.maxValidMoves;
        if (this.movesLeft <= 0 && mid == 1) {
            this.gameOver = true;
            window.gameApplication.showStepView(function (isOk) {
                if (isOk) {
                    this.gameOver = false;
                    this.movesLeft = 5;
                    this.updateUI();
                } else {
                    this.gameApplication.openMainView();
                }
            }.bind(this), false)
        }
    },

    setStar(node, score, f) {
        // var isFill = score >= f;
        // node.getChildByName("empty").active = !isFill;
        // node.getChildByName("fill").active = isFill;
    },

    onBackBtnClicked(event) {
        if (this.gameApplication != null) {
            this.gameApplication.soundManager.playSound("btn_click");
        }

        this.gameApplication.openMainView();
    },

    onNextBtnClicked(event) {
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        this.scheduleOnce(function () {
            btn.interactable = true;
        }, 1);

        // cc.log("onNextBtnClicked")
        this.gameApplication.soundManager.playSound("btn_click");
        this.nextGame(btn);
    },

    onPreviousBtnClicked(event) {
        // cc.log("onPreviousBtnClicked")
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        this.scheduleOnce(function () {
            btn.interactable = true;
        }, 1);

        this.gameApplication.soundManager.playSound("btn_click");
        this.prevGame();
    },

    onReStarBtnClicked(event) {
        this.timeIsUpNode.active = false;
        var btn = event.target.getComponent(cc.Button);
        btn.interactable = false;
        this.scheduleOnce(function () {
            btn.interactable = true;
        }, 0.2);
        window.gameApplication.soundManager.playSound("btn_click");
        window.gameApplication.openMainView();
    },

    onHelpBtnClicked(event) {

        if (this.gameOver || this.myRole == null) {
            return;
        }
        if (this.helpPath.length <= 0) {
            return;
        }
        if (this.helpCount > 0) {
            window.gameApplication.soundManager.playSound("btn_click");
            this.help();
        } else {
            window.gameApplication.soundManager.playSound("btn_click");
            this.shareFriendTip.active = true;
        }
    },



    onWatchVideoBtnClicked(event) {
        // this.gameApplication.soundManager.playSound("btn_click");

        // cc.log("onWatchVideoBtnClicked");
        event.target.getComponent(cc.Button).interactable = false;

        var self = this;
        SDK().showVideoAd(function (isCompleted) {
            if (isCompleted) {
                self.helpCount = plusHelp;
            } else {
                cc.log("播放视频广告失败")
            }

            event.target.getComponent(cc.Button).interactable = true;
            self.shareFriendTip.active = false;

        }.bind(this));
    },

    onShareInvBtnClicked(event) {
        // cc.log("onWatchVideoBtnClicked");
        // event.target.getComponent(cc.Button).interactable = false;
        this.gameApplication.soundManager.playSound("btn_click");

        var self = this;
        this.gameApplication.soundManager.playSound("done");
        SDK().getItem("all", function (score) {
            SDK().share(score, function (isCompleted) {
                if (isCompleted) {
                    self.helpCount = plusHelp;
                    console.log("邀请成功")
                } else {
                    console.log("邀请失败")
                    self.showInvAgain(1, event);
                }
                event.target.getComponent(cc.Button).interactable = true;
                self.shareFriendTip.active = false;
            });

        }.bind(this));
    },

    showInvAgain(type, event) {
        var self = this;
        this.invAgain.active = true;
        var btn = cc.find("box/btn_4", this.invAgain).getComponent(cc.Button);
        btn.node.on('click', function () {
            if (type == 1) {
                self.onShareInvBtnClicked(event);
            } else if (type == 2) {
                self.onShareBtnClicked(event);
            } else if (type == 3) {
                self.getMoreTimeInv(event);
            }
            self.invAgain.active = false;
        }, this);
    },

    onCloseWatchVideoTipClicked() {
        this.gameApplication.soundManager.playSound("btn_click");
        this.shareFriendTip.active = false;
    },


    onShareBtnClicked(event) {
        var self = this;
        this.gameApplication.soundManager.playSound("btn_click");
        event.target.getComponent(cc.Button).interactable = false;
        event.target.active = true;

        this.gameApplication.soundManager.playSound("done");
        SDK().getItem("all", function (score) {
            SDK().share(score, function (isCompleted) {
                event.target.getComponent(cc.Button).interactable = true;
                event.target.active = true;
                if (!isCompleted) {
                    self.showInvAgain(2, event);
                }

            });

        }.bind(this));
    },

    helpBtnShake() {
        this.helpBtn.getComponent("AnimFunc").shake();
    },

    onGiftBtnClicked() {
        this.receiveGiftNode.active = false;
    },



    onPlayInterstitialGiftBtnClicked(event) {
        // event.target.getComponent(cc.Button).interactable = false;
        var self = this;

        self.gameApplication.soundManager.playSound("done");
        SDK().showInterstitialAd(function (isCompleted) {
            self.helpCount += 1;
            // event.target.getComponent(cc.Button).interactable = true;
            self.receiveGiftNode.active = true;
            self.giftBtn.active = false;
            console.log("_______OKOK")
        }, true);
    }

});
