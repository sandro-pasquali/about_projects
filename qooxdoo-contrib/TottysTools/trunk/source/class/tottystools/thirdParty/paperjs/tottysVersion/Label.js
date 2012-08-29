qx.Class.define('tottystools.thirdParty.paperjs.tottysVersion.Label', {
    extend: tottystools.thirdParty.paperjs.tottysVersion.Path

    ,properties: {

    }

    ,construct: function(value){
        this.base(arguments);
        this.__graphic = new this.__paper.PointText(this.__position);
        this.setValue(value);
        this.__graphic.paragraphStyle.justification = 'center';
        this.getRoot().addChild(this.__graphic);
        this.setFillColor('black');
    }

    ,members: {
        // begin public
        getValue: function(){
            return this.__value;
        }



        ,setValue: function(value){
            this.__value = value;
            this.__graphic.content = value;
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