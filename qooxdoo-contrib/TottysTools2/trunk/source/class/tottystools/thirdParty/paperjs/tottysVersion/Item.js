qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Item', {
    extend: qx.core.Object

    ,properties: {

    }

    ,construct: function(){
        this.__paper = tottystools.thirdParty.paperjs.Paper.paper();
        this.__children = new qx.data.Array(); // ordered by the local z-index (first hidden, last show)
        this.__absPosition = {x: 0, y: 0};
        this.__position = {x: 0, y: 0};
        this.__scale = 1;
        this.__lastChildAddedIndex = -1;

    }


    ,events: {
         absZIndexChange: 'qx.event.type.Event'
        ,ZIndexChange: 'qx.event.type.Event'
        ,mousedown: 'qx.event.type.Data'
    }

    ,members: {
        INFO_getChildrenZIndex: function(){
            var output = {'Name': ['ZIndex', 'AbsZIndex', 'array index'].join(', ')};
            this.__children.forEach(function(item, index){
                output[item.name] = [item.getZIndex(), item.getAbsZIndex(), index].join(', ');
            }, this);
            return output;
            /*var output = [['Name', 'ZIndex', 'AbsZIndex'].join(', ')];
            this.__children.forEach(function(item, index){
                output.push([item.name, item.getZIndex(), item.getAbsZIndex()].join(', '));
            }, this);
            return output;*/
        }



        // begin get/set
        ,getProject: function(){
            return this.__project();
        }



        ,setProject: function(project){
            if(this.__project === project){
                throw new Error('Same project');
            }
            if(this.__project){
                this.__project.removeChild(this);
            }
            this.__project = project;
            if(project){
                this.__project.addChild(this);
            }
        }


        
        /*
        Paper graphic in this case might be a Group or Layer
        object from the paper.js library.
        */
        // ,setRoot: function(paperGraphic){
        //     var graphic = this.getGraphic();
        //     if(graphic){
        //         if(paperGraphic === null && this.__root){
        //             graphic.remove();
        //         }else{
        //             paperGraphic.addChild(graphic);
        //             var that = this;
        //             var paper = this.__paper;
        //             var graphic = this.__graphic;
        //             var tool = new paper.Tool();
        //             tool.activate();
        //             tool.distanceThreshold = 1;
        //             tool.onMouseDown = function(e){
        //                 debugger;
        //                 var hitResult = paper.project.hitTest(e.point);
        //                 if(hitResult !== null && hitResult.item !== null && hitResult.item === graphic){
        //                     that.fireDataEvent('mousedown', e);
        //                 }
        //             };
        //         }
        //     }
        //     this.__root = paperGraphic;
        // }



        // relative ZIndex to it's parent
        ,getZIndex: function(){
            return this.__ZIndex;
        }



        ,setZIndex: function(ZIndex){
            this.__ZIndex = ZIndex;
            this.fireEvent('ZIndexChange');
        }



        ,getAbsZIndex: function(){
            if(this.__absZIndex === undefined){
                this.__absZIndex = 0;
            }
            return this.__absZIndex;
        }



        ,setAbsZIndex: function(absZIndex){
            this.__absZIndex = absZIndex;
            if(this.getGraphic()){
                this.getRoot().insertChild(absZIndex, this.getGraphic());
            }
            this.fireEvent('absZIndexChange');
        }



        ,getGraphic: function(){
            return this.__graphic;
        }



        ,getParent: function(){
            return this.__parent;
        }



        ,setParent: function(parent){
            this.__parent = parent;
            this.updateAbsPosition();
        }



        /*
        The relative position to it's parent
        */
        ,getPosition: function(){
            return this.__position;
        }
               


        ,setPosition: function(point){
            this.__position = point;
            this.updateAbsPosition();
        }



        ,getAbsPosition: function(){
            return this.__absPosition;
        }



        ,setAbsPosition: function(point){
            this.__absPosition = point;
        }



        ,getScale: function(){
            return this.__scale;
        }
               


        ,setScale: function(scale){
            this.__graphic.scale(scale / this.__scale);
            this.__scale = scale;
        }


        ,isLeaf: function(){
            return this.__isLeaf;
        }
        // end get/set





        // begin public
        ,translate: function(point){
            var oldPosition = this.getPosition()
            var newPosition = {
                 x: oldPosition.x + point.x
                ,y: oldPosition.y + point.y
            }
            this.setPosition(newPosition);
        }



        ,updateAbsPosition: function(){
            var parent = this.getParent();
            var absPosition;
            var relPosition = this.getPosition();
            if(parent){
                var parentAbsPosition = parent.getAbsPosition();
                absPosition = {
                     x: parentAbsPosition.x + relPosition.x
                    ,y: parentAbsPosition.y + relPosition.y
                }
            }else{
                absPosition = relPosition;
            }
            this.setAbsPosition(absPosition);
            if(this.__graphic){
                this.__graphic.setPosition(absPosition);
            }
            if(this.__children) {
                this.__children.forEach(function(child){
                    child.updateAbsPosition();
                }, this);
            }
        }
        // end public





        // begin apply
        // end apply





        // begin handlers
        // end handlers





        // begin core
        // end core





        // begin booleans
        // end booleans

    }

});