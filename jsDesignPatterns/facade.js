/*
-This structural pattern provides a convenient higher-level interface to a larger body of code, hiding its true underlying complexity. 
Think of it as simplifying the API being presented to other developers, something which almost always improves usability.
-A Facade's advantages include ease of use and often a small size-footprint in implementing the pattern.
*/

//This is an unoptimized code example, but here we're utilizing a Facade to simplify an interface for listening to events cross-browser:
var addMyEvent = function( el,ev,fn ){
   if (el.addEventListener) {
        el.addEventListener(ev,fn, false);
    } else if (el.attachEvent) {
        el.attachEvent("on" + ev, fn);
    } else {
        el["on" + ev] = fn;
    }
};

//In a similar manner, we're all familiar with jQuery's $(document).ready(..). Internally, this is actually being powered by a 
//method called bindReady(), which is doing this:
bindReady: function() {
    //...
    if ( document.addEventListener ) {
    	// Use the handy event callback
    	document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
    	// A fallback to window.onload, that will always work
    	window.addEventListener( "load", jQuery.ready, false );
    // If IE event model is used
    } else if ( document.attachEvent ) {
    	document.attachEvent( "onreadystatechange", DOMContentLoaded );
    	// A fallback to window.onload, that will always work
    	window.attachEvent( "onload", jQuery.ready );
    //...
	}
	//...
}


//-----------------------------------------------------------------------------------
/*
Facades can also be integrated with other patterns such as the Module pattern. As we can see below, our instance 
of the module patterns contains a number of methods which have been privately defined. A Facade is then used to 
supply a much simpler API to accessing these methods:
*/
var module = (function() {
    var _private = {
        i: 5,
        get: function() {
            console.log( "current value:" + this.i);
        },
        set: function( val ) {
            this.i = val;
        },
        run: function() {
            console.log( "running" );
        },
        jump: function(){
            console.log( "jumping" );
        }
    };
    return {
        facade: function( args ) {
            _private.set(args.val);
            _private.get();
            if ( args.run ) {
                _private.run();
            }
        }
    };
}());
// Outputs: "current value: 10" and "running"
module.facade({run: true, val: 10});


/*
Facades generally have few disadvantages, but one concern worth noting is performance. Namely, one must determine whether there 
is an implicit cost to the abstraction a Facade offers to our implementation and if so, whether this cost is justifiable.
When using the pattern, try to be aware of any performance costs involved and make a call on whether they are worth the level 
of abstraction offered.
*/
