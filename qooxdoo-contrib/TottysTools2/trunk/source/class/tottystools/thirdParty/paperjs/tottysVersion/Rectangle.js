qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Rectangle', {
    extend: tottystools.thirdParty.paperjs.tottysVersion.Path

    ,properties: {

    }

    /*
    size: {
         width: x
        ,height: y
    }
    */
    ,construct: function(size){
        this.base(arguments);
        this.__isLeaf = true;
        this.setSize(size);
        this.__graphic = new this.__paper.Path.Rectangle(size);
        this.getRoot().addChild(this.__graphic);
        this.setFillColor('red');
    }

    ,members: {
        // begin public
        getSize: function(){
            return this.__size;
        }



        ,setSize: function(size){
            this.__size = size;
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