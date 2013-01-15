qx.Class.define('tottystools.thirdParty.paperjs.TottyInjectsPaper', {
    extend: qx.core.Object,
    type: 'singleton',

    properties: {

    },



    statics: {
        inject: function(paper){
            var Item = paper.Item;

            paper.Item.inject({
                __scale: 1 
                

                ,setAbsScale: function(scale){
                    this.scale(scale / this.__scale);
                    this.__scale = scale;
                }


                ,getAbsScale: function(){
                    return this.__scale;
                }


                ,setRelPosition: function(point){
                    this.__relPosition = point;
                    this.updateRelPosition();
                }


                ,getRelPosition: function(){
                    if(!this.__relPosition){
                        this.__relPosition = {x: 0, y: 0};
                    }
                    return this.__relPosition;
                }


                ,updateRelPosition: function(){
                    var parent = this.parent;
                    var relPosition = this.getRelPosition();
                    if(parent && !isNaN(parent.position.x) && !isNaN(parent.position.y)){
                            this.position = {
                                 x: parent.position.x + relPosition.x
                                ,y: parent.position.y + relPosition.y
                            }
                    }else{
                        this.position = relPosition;
                    }
                    if(this._children) {
                        for(var i = 0, l = this._children.length; i < l; i++){
                            this._children[i].updateRelPosition()
                        }  
                    }
                }
            })



            // paper.Group.inject({
            //     _changed: function(flags){
            //         if(this._children) {
            //             for(var i = 0, l = this._children.length; i < l; i++){
            //                 this._children[i].__updateRelPosition()
            //             }  
            //         }
            //     }
            // })
        }  
    }

});