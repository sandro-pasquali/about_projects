qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Image', {
    extend: tottystools.thirdParty.paperjs.tottysVersion.Item

    ,properties: {

    }

    ,construct: function(image){
        this.base(arguments);
        this.__isLeaf = true;
        this.setImage(image);
        this.__graphic = new this.__paper.Raster(image);
        this.getRoot().addChild(this.__graphic);
    }

    ,members: {
        // begin public
        getImage: function(){
            return this.__image;
        }



        ,setImage: function(image){
            this.__image = image;
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