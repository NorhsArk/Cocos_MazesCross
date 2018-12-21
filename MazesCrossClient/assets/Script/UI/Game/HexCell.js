// var Role = require("./Role");

cc.Class({
    extends: cc.Component,

    properties: {
        help_end:{
            default:null,
            type:cc.Node,
        },
        help_start:{
            default:null,
            type:cc.Node,
        },
        line_end:{
            default:null,
            type:cc.Node,
        },
        line_start:{
            default:null,
            type:cc.Node,
        },
        _axialCoordinate:{
            default:cc.v2(0,0),
            visible:false,
        },
        axialCoordinate:{
            get(){
                return this._axialCoordinate;
            },
            set(val){
                this._axialCoordinate = cc.v2(val.x,val.y);
                this.onUpdateAxialCoordinate();
            },
        },
        iceNode:{
            default:null,
            type:cc.Node,
        }, 
        isIce:{
            get(){
                return this.iceNode.active;
            }
        },
        leftTower:{
            default:null,
            type:cc.Node,
        },
        rightTower:{
            default:null,
            type:cc.Node,
        },
        bottomTower:{
            default:null,
            type:cc.Node,
        },
        topTower:{
            default:null,
            type:cc.Node,
        },
        hasTower:{
            get(){
                return this.leftTower.active || this.rightTower.active || this.bottomTower.active || this.topTower.active;
            }, 
        },
        coordinateText:{
            default:null,
            type:cc.Label,
        },
        //
        left:{
            default:null,
            type:cc.Node,
        },
        right:{
            default:null,
            type:cc.Node,
        },
        top:{
            default:null,
            type:cc.Node,
        },
        bottom:{
            default:null,
            type:cc.Node,
        },
        leftActive:{
            get(){
                return this.left.active;
            }
        },
        rightActive:{
            get(){
                return this.right.active;
            }
        },
        topActive:{
            get(){
                return this.top.active;
            }
        },
        bottomActive:{
            get(){
                return this.bottom.active;
            }
        },
    },  

    onLoad: function () {
        this.initHexcell ();
    },

    start () {

    },

    scaleChild(x,y){
        this.line_end.setScale(x,y);
        this.line_start.setScale(x,y);
        this.help_end.setScale(x,y);
        this.help_start.setScale(x,y);

        this.leftTower.getComponent("Tower").setScaleXY(x,y);
        this.topTower.getComponent("Tower").setScaleXY(x,y);
        this.rightTower.getComponent("Tower").setScaleXY(x,y);
        this.bottomTower.getComponent("Tower").setScaleXY(x,y);

    },

    showStartLine(nextNode)
    {
        if(nextNode == null){
            return;
        }
        this.line_start.active = true;

        //如果x相同，那么是上下
        if(this.axialCoordinate.x == nextNode.x){
            if(this.axialCoordinate.y > nextNode.y){
                this.line_start.setRotation(90);                
            }else{
                this.line_start.setRotation(-90);                
            }
        }else{
            if(this.axialCoordinate.x > nextNode.x){
                this.line_start.setRotation(180);                
            }else{
                this.line_start.setRotation(0);                
            }
        }
    },
    showEndLine(boforeNode)
    {
        if(boforeNode == null){
            return;
        }
        this.line_end.active = true;

        if(this.axialCoordinate.x == boforeNode.x){
            if(this.axialCoordinate.y > boforeNode.y){
                this.line_end.setRotation(90);                
            }else{
                this.line_end.setRotation(-90);                
            }
        }else{
            if(this.axialCoordinate.x > boforeNode.x){
                this.line_end.setRotation(180);                
            }else{
                this.line_end.setRotation(0);                
            }
        }
    },
    showLine(nextNode,boforeNode)
    {
        this.showStartLine(boforeNode);
        this.showEndLine(nextNode);
    },
    hideLine()
    {
        this.line_start.active = false;
        this.line_end.active = false;
    },

    showStartHelp(nextNode)
    {
        if(nextNode == null){
            return;
        }
        this.help_start.active = true;

        //如果x相同，那么是上下
        if(this.axialCoordinate.x == nextNode.x){
            if(this.axialCoordinate.y > nextNode.y){
                this.help_start.setRotation(90);                
            }else{
                this.help_start.setRotation(-90);                
            }
        }else{
            if(this.axialCoordinate.x > nextNode.x){
                this.help_start.setRotation(180);                
            }else{
                this.help_start.setRotation(0);                
            }
        }
    },

    showEndHelp(boforeNode)
    {
        if(boforeNode == null){
            return;
        }
        this.help_end.active = true;

        if(this.axialCoordinate.x == boforeNode.x){
            if(this.axialCoordinate.y > boforeNode.y){
                this.help_end.setRotation(90);                
            }else{
                this.help_end.setRotation(-90);                
            }
        }else{
            if(this.axialCoordinate.x > boforeNode.x){
                this.help_end.setRotation(180);                
            }else{
                this.help_end.setRotation(0);                
            }
        }
    },

    showHelp(nextNode,boforeNode)
    {
        this.showStartHelp(boforeNode);
        this.showEndHelp(nextNode);
    },

    hideHelpLine(){
        this.help_start.active = false;
        this.help_end.active = false;
    },

    setIce(isIce){
        this.iceNode.active = true;
    },

    setLeft(isShow){
        this.left.active = isShow;
    },

    setRight(isShow){
        this.right.active = isShow;
    },


    setTop(isShow){
        this.top.active = isShow;
    },

    setBottom(isShow){
        this.bottom.active = isShow;
    },

    setLeftTower(isShow){
        this.leftTower.active = isShow;
    },

    setRightTower(isShow){
        this.rightTower.active = isShow;
    },


    setTopTower(isShow){
        this.topTower.active = isShow;
    },

    setBottomTower(isShow){
        this.bottomTower.active = isShow;
    },

    initHexcell()
    {
        // coordinateText
        this.reset();
    },

    onUpdateAxialCoordinate()
    {
        this.coordinateText.string = parseInt(this.axialCoordinate.x)  + ","+parseInt(this.axialCoordinate.y) ;
        this.coordinateText.node.active = isDebug;
    },

    reset(isClear){//hide lines & remove base highlight
        var isClear = arguments[0] ? arguments[0] : false;
        // this.setBaseColor(isClear ? this.baseNormalColor : this.highlightColor);
        // this.isHighlighted = false;
        this.setLeft(false);
        this.setRight(false);
        this.setTop(false);
        this.setBottom(false);

        this.setLeftTower(false);
        this.setRightTower(false);
        this.setTopTower(false);
        this.setBottomTower(false);

    },


   
});
