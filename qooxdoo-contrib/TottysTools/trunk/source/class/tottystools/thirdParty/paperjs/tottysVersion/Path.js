qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Path', {
    extend: tottystools.thirdParty.paperjs.tottysVersion.Item

    ,properties: {

    }

    ,construct: function(){
        this.base(arguments);
        this.__isLeaf = true;
    }

    ,members: {
        // begin public
        getFillColor: function(){
            return this.__fillColor;
        }



        ,setFillColor: function(fillColor){
            this.__fillColor = fillColor;
            this.__updateGraphic();
        }
        // end public





        // begin apply
        // end apply





        // begin handlers
        // end handlers





        // begin core
        ,__updateGraphic: function(){
            var graphic = this.__graphic;
            graphic.fillColor = this.getFillColor();
        }
        // end core





        // begin booleans
        // end booleans
    }

});