var HexCell = require("./HexCell");

cc.Class({
    extends: cc.Component,

    properties: {
        bubble:{
            default:null,
            type:cc.Node,
        },
        bubbleAxialCoordinate:{
            default:cc.v2(0,0),
            visible:false,
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
                this._axialCoordinate       = cc.v2(val.x,val.y);
                this.bubbleAxialCoordinate  = cc.v2(val.x,val.y);
            },
        },
        isShooting:false,
        direction:{
            default:-1,
            type:cc.Integer,
            visible:false,
        },
        f:{
            default:0,
            type:cc.Integer,
            visible:false,
        },
        s:{
            default:0,
            type:cc.Integer,
            visible:false,
        },
        delay:{
            default:0,
            type:cc.Integer,
            visible:false,
        },
        size:{
            default:cc.size(0,0),
            type:cc.Size,
            visible:false,
        },
        scaleX:{
            default:1,
            type:cc.Integer,
            visible:false,
        },
        scaleY:{
            default:1,
            type:cc.Integer,
            visible:false,
        },

    },  

    init(config){
        this.direction = config.direction;
        this.f = config.f;
        this.s = config.s;
        this.delay = config.delay;
        this.isShooting = false;
        this.bubble.active = false;
        this.node.setContentSize(this.size);
        // cc.log("this.scaleX,this.scaleY:",this.scaleX,this.scaleY)
        this.bubble.setScale(this.scaleX,this.scaleY);
    },

    setScaleXY(x,y){
        this.size = cc.size(34*x,51*y);
        this.scaleX = x;
        this.scaleY = y;
    },

    onLoad: function () {
    },

    start () {

    },
   
});
