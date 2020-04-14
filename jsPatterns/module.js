
// *** Object Literal
//Object literals don't require instantiation using the new operator but shouldn't be used at the start of a statement as the opening { may be 
//interpreted as the beginning of a block. Outside of an object, new members may be added to it using assignment as follows myModule.property = "someValue";
var myObjectLiteral = {
    variableKey: variableValue,
    functionKey: function () {
      // ...
    }
};

//-----------------------------------------------------------------------------------
//Modules typically help in keeping the units of code for a project both cleanly separated and organized.
//Using object literals can assist in encapsulating and organizing your code
var myModule = {
  myProperty: "someValue",
  // object literals can contain properties and methods. e.g we can define a further object for module configuration:
  myConfig: {
    useCaching: true,
    language: "en"
  },
  // a very basic method
  saySomething: function () {
    console.log( "Where in the world is Paul Irish today?" );
  },
  // output a value based on the current configuration
  reportMyConfig: function () {
    console.log( "Caching is: " + ( this.myConfig.useCaching ? "enabled" : "disabled") );
  },
  // override the current configuration
  updateMyConfig: function( newConfig ) {
    if ( typeof newConfig === "object" ) {
      this.myConfig = newConfig;
      console.log( this.myConfig.language );
    }
  }
};
// Outputs: Where in the world is Paul Irish today?
myModule.saySomething();
// Outputs: Caching is: enabled
myModule.reportMyConfig();
// Outputs: fr
myModule.updateMyConfig({
  language: "fr",
  useCaching: false
});
// Outputs: Caching is: disabled
myModule.reportMyConfig();

//In JavaScript, the Module pattern is used to further emulate the concept of classes in such a way that we're able to include both 
//public/private methods and variables inside a single object, thus shielding particular parts from the global scope. What this results 
//in is a reduction in the likelihood of our function names conflicting with other functions defined in additional scripts on the page.

//The Module pattern encapsulates "privacy", state and organization using closures. This gives us a clean solution for shielding logic 
//doing the heavy lifting whilst only exposing an interface we wish other parts of our application to use.


//-----------------------------------------------------------------------------------

//Module pattern by creating a module which is self-contained.
var testModule = (function () {
  var counter = 0;
  return {
    incrementCounter: function () {
      return counter++;
    },
    resetCounter: function () {
      console.log( "counter value prior to reset: " + counter );
      counter = 0;
    }
  };
})();
// Usage:
// Increment our counter
testModule.incrementCounter();
// Check the counter value and reset
// Outputs: counter value prior to reset: 1
testModule.resetCounter();

//-----------------------------------------------------------------------------------

//A template should be:
var myNamespace = (function () {
  var myPrivateVar, myPrivateMethod;
  // A private counter variable
  myPrivateVar = 0;
  // A private function which logs any arguments
  myPrivateMethod = function( foo ) {
      console.log( foo );
  };
  return {
    // A public variable
    myPublicVar: "foo",
    // A public function utilizing privates
    myPublicFunction: function( bar ) {
      // Increment our private counter
      myPrivateVar++;
      // Call our private method using bar
      myPrivateMethod( bar );
    }
  };
})();
//Consider this won't work:
console.log(myNamespace.myPrivateVar); //Outputs: undefined, not part of public API
console.log(myPrivateVar); //Outputs: undefined, is not in global scope

//-----------------------------------------------------------------------------------

// *** VARIATIONS

// --- import mixins
// Global module: passing globals as arguments to the module
var myModule = (function ( jQ, _ ) {
    function privateMethod1(){
        jQ(".container").html("test");
    }
    function privateMethod2(){
      console.log( _.min([10, 5, 100, 2, 1000]) );
    }
    return{
        publicMethod: function(){
            privateMethod1();
        }
    };
// Pull in jQuery and Underscore
})( jQuery, _ );
myModule.publicMethod();


// --- exports
// Global module
var myModule = (function () {
  // Module object
  var module = {},
    privateVariable = "Hello World";
  function privateMethod() {
    // ...
  }
  module.publicProperty = "Foobar";
  module.publicMethod = function () {
    console.log( privateVariable );
  };
  return module;
})();


// --- jQuery
//A library function is defined which declares a new library and automatically binds up 
//the init function to document.ready when new libraries (i.e. modules) are created.
function library( module ) {
  $( function() {
    if ( module.init ) {
      module.init();
    }
  });
  return module;
}
var myLibrary = library(function () {
  return {
    init: function () {
      // module implementation
    }
  };
}());

//-----------------------------------------------------------------------------------

//PROS:
// 1. Easier for developers that comes from object-oriented background
// 2. Supports private data

//CONS:
// 1. hard to change visibility
// 2. Methods added in a later point can't access to private parts
// 3. hart to create unit tests for private parts