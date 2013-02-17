/* Layers :
    dom -> indexing ->
*/
function Toi() {
    // turning arguments into an array
    var args = Array.prototype.slice.call(arguments),
        // the last argument is the callback
        callback = args.pop(),
        // modules can be passed as an array or as individual parameters
        modules = (args[0] && typeof args[0] === 'string') ? args[0] : args,
        i;

    //console.log('args[0]',args[0]);
    //console.log('arguments',arguments,'args',args,'callback',callback,'modules',modules,'this',this);

    // make sure the function is called
    // as a constructor
    if (!(this instanceof Toi)) {
        return new Toi(modules, callback);
    }
    
    // add properties to this as needed:
    // REPLACE
    this.a = 1;
    this.b = 2;

    //console.log('modules',modules,'Toi.modules',Toi.modules);

    // now add modules to the core 'this' object
    // no modules or "*" both mean "use all modules"
    if (!modules || modules==='*') {
        modules = [];
        for (i in Toi.modules) {
            if (Toi.modules.hasOwnProperty(i)) {
               modules.push(i);
            }
        }
        //console.log('new modules',modules);
    }

    // initialize the required modules
    for (i=0;i<modules.length;i++) {
        //console.log('Toi.modules[modules[i]]',Toi.modules[modules[i]]);
        Toi.modules[modules[i]](this);
    }

    // call the callback
    callback(this);
};
Toi.prototype = {
    name:'nodemawb',
    version:'0.2',
    getName:function() {
        return this.name;
    }
};
String.prototype.replaceAt = function(index, character) {
    return this.substr(0,index) + character + this.substr(index+character.length);
}
Toi.modules = {};
