qx.Class.define('tottystools.ComponentFactory', {
	extend: qx.core.Object,
	type: 'singleton',

	properties: {

	},



	statics: {
        /*
        How to use:
        Every context will need a new componentFactory special not-reusable singleton.
        The custom componentFactory will extend this and will look like this:
        
        qx.Class.define('ws._prototypes.gameplay.v01.ComponentFactory', {
            extend: tottystools.ComponentFactory,
            type: 'singleton',

            properties: {

            },



            statics: {
                __prefix: 'ws._prototypes.gameplay.v01'



                ,instance: tottystools.ComponentFactory.instance



                ,addRule: tottystools.ComponentFactory.addRule
            }

        });

        the __prefix value is the value of the root of the context
        */
        instance: function(input, args){
            var prefix = this.__prefix;
            if(!prefix){
                throw new Error('You must set a prefix in order to instance components.');
                return false;
            }
            var inputSegments = input.split(':');
            var classPathFromPrefix = inputSegments[0];

            var viewPostfix = 'V';
            var viewPath = [prefix, 'views', classPathFromPrefix + viewPostfix].join('.');
            var viewClass = qx.Class.getByName(viewPath); 
            
            var componentPostfix = 'C';
            var componentPath =  [prefix, 'components', classPathFromPrefix + componentPostfix].join('.');
            var componentClass = qx.Class.getByName(componentPath);

            if(!viewClass && !componentClass){
                alert('Check paths: ' + classPathFromPrefix);
                return;
            }

            if(viewClass){
                var view = new viewClass();
            }else{
                alert('View not found ' + viewPath);
            }
            var component = new componentClass(args || {});
            if(view){
                if(!component.setView){
                    alert('Component have no setView method: ' + componentPath);
                }
                component.setView(view);
            }
            if(!this.__rules){
                this.__rules = {};
            }
            var ruleFn = this.__rules[input];
            if(ruleFn){
                ruleFn(component, args);
            }
            component.init();
            return component;
        },



        addRule: function(classPathFromPrefix, fn){
            this.__rules[classPathFromPrefix] = fn;
        }
			
	}

});