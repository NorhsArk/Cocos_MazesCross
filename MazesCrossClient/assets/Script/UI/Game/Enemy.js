var HexCell = require("./HexCell");

cc.Class({
    extends: cc.Component,

    properties: {
        emeny:{
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
            },
        },
    },  

    onLoad: function () {
    },

    start () {
      
    },
    /**
    * 移动
    */  
    moveTo()    
    {

    }
   
});
