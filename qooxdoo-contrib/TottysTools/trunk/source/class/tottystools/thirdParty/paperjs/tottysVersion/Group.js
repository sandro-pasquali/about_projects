qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Group', {
    extend: tottystools.thirdParty.paperjs.tottysVersion.Item

    ,properties: {

    }

    ,construct: function(){
        this.base(arguments);
        this.__children = new qx.data.Array(); // ordered by the local z-index (first hidden, last show)
        this.__isLeaf = false;
    }


    ,events: {
    }

    ,members: {
        // begin get/set
        setRoot: function(){
            this.base(arguments);
            this.__updateChildrenRoot()
        }
        // end get/set





        // begin public
        ,addChild: function(item, index){
            if(this.__children.contains(item)){
                debugger;
                console.error('You cant add the same child twice.');
                return false;
            }
            if(index !== undefined){
                this.__children.insertAt(index, item);
            }else{
                this.__children.push(item);
            }
            var itemsParent = item.getParent()
            if(itemsParent){
                itemsParent.removeChild(item);
            }

            item.addListener('absZIndexChange', this.__onChildAbsZIndexChange, this);
            item.addListener('ZIndexChange', this.__onChildZIndexChange, this);
            item.setParent(this);
            item.setRoot(this.getRoot());
            this.__lastChildAddedIndex++;
            item.setZIndex(this.__lastChildAddedIndex);
        }



        ,removeChild: function(item){
            if(!this.__children.contains(item)){
                debugger;
                console.error('You cant remove a children that is not added.');
                return false;
            }
            var itemsParent = item.getParent();
            
            if(!itemsParent && itemsParent !== this){
                debugger;
                console.error('Im not the parent or has no parent');
                return false;
            }
            this.__children.remove(item);
            item.addListener('absZIndexChange', this.__onChildAbsZIndexChange, this);
            item.addListener('ZIndexChange', this.__onChildZIndexChange, this);
            item.setParent(null);
            item.setRoot(null);
            this.__lastChildAddedIndex--;
        }



        ,updateChildrenAbsZIndex: function(lastIndex){
            if(this.__children) {
                var graphic;
                var ZIndex;
                this.__children.forEach(function(child, index){
                    if(child.isLeaf()){
                        lastIndex++
                        ZIndex = lastIndex;
                        child.setAbsZIndex(ZIndex);
                    }else{
                        lastIndex = child.updateChildrenAbsZIndex(lastIndex);
                    }
                }, this);
            }
            return lastIndex;
        }
        // end public





        // begin apply
        // end apply





        // begin handlers
        ,__onChildAbsZIndexChange: function(e){
            this.__resortChildren();
        }



        ,__onChildZIndexChange: function(e){
            this.__resortChildren();
        }
        // end handlers





        // begin core
        ,__updateChildrenRoot: function(){
            if(this.__children) {
                var root = this.getRoot();
                this.__children.forEach(function(child, index){
                    child.setRoot(root);
                }, this);
            }
        }



        ,__resortChildren: function(){
            this.__children.sort(function(childA, childB){
                return childA.getZIndex() - childB.getZIndex();
            }, this);
        }
        // end core





        // begin booleans
        // end booleans

    }

});