qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Circle', {
    extend: tottystools.thirdParty.paperjs.tottysVersion.Path

    ,properties: {

    }

    ,construct: function(radius){
        this.base(arguments);
        this.__graphic = new this.__paper.Path.Circle(this.__position, radius);
        this.getRoot().addChild(this.__graphic);
        this.setFillColor('red');
    }

    ,members: {
        // begin public
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