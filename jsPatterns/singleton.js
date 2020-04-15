
//Classically, the Singleton pattern can be implemented by creating a class with a method that creates a new instance 
//of the class if one doesn't exist. In the event of an instance already existing, it simply returns a reference to that object.

var mySingleton = (function () {
  // Instance stores a reference to the Singleton
  var instance;
  function init() {
    // Singleton
    // Private methods and variables
    function privateMethod(){
        console.log( "I am private" );
    }
    var privateVariable = "Im also private";
    var privateRandomNumber = Math.random();
    return {
      // Public methods and variables
      publicMethod: function () {
        console.log( "The public can see me!" );
      },
      publicProperty: "I am also public",
      getRandomNumber: function() {
        return privateRandomNumber;
      }
    };
  };
  return {
    // Get the Singleton instance if one exists
    // or create one if it doesn't
    getInstance: function () {
      if ( !instance ) {
        instance = init();
      }
      return instance;
    }
  };
})();
 
// -- Bad singleton
var myBadSingleton = (function () {
  // Instance stores a reference to the Singleton
  var instance;
  function init() {
    // Singleton
    var privateRandomNumber = Math.random();
    return {
      getRandomNumber: function() {
        return privateRandomNumber;
      }
    };
  };
  return {
    // Always create a new Singleton instance
    getInstance: function () {
      instance = init();
      return instance;
    }
  };
})();
 
// Usage:
var singleA = mySingleton.getInstance();
var singleB = mySingleton.getInstance();
console.log( singleA.getRandomNumber() === singleB.getRandomNumber() ); // true
 
var badSingleA = myBadSingleton.getInstance();
var badSingleB = myBadSingleton.getInstance();
console.log( badSingleA.getRandomNumber() !== badSingleB.getRandomNumber() ); // true
 
// Note: as we are working with random numbers, there is a mathematical possibility both numbers will be the same,
// however unlikely. The above example should otherwise still be valid.

//-----------------------------------------------------------------------------------


// When the sole instance should be extensible by subclassing, and clients should be able to use an extended instance without modifying their code.
mySingleton.getInstance = function(){
  if ( this._instance == null ) {
    if ( isFoo() ) {
       this._instance = new FooSingleton();
    } else {
       this._instance = new BasicSingleton();
    }
  }
  return this._instance;
};

//It is important to note the difference between a static instance of a class (object) and a Singleton: whilst a Singleton can be implemented
//as a static instance, it can also be constructed lazily, without the need for resources nor memory until this is actually needed.

//-----------------------------------------------------------------------------------


//In practice, the Singleton pattern is useful when exactly one object is needed to coordinate others across a system.
// Here is one example with the pattern being used in this context:

var SingletonTester = (function () {
  // options: an object containing configuration options for the singleton. e.g var options = { name: "test", pointX: 5};
  function Singleton( options ) {
    // set options to the options supplied or an empty object if none are provided
    options = options || {};
    // set some properties for our singleton
    this.name = "SingletonTester";
    this.pointX = options.pointX || 6;
    this.pointY = options.pointY || 10;
  }
  // our instance holder
  var instance;
  // an emulation of static variables and methods
  var _static = {
    name: "SingletonTester",
    // Method for getting an instance. It returns
    // a singleton instance of a singleton object
    getInstance: function( options ) {
      if( instance === undefined ) {
        instance = new Singleton( options );
      }
      return instance;
    }
  };
  return _static;
})();
 
var singletonTest = SingletonTester.getInstance({
  pointX: 5
});
 
// Log the output of pointX just to verify it is correct. Outputs: 5
console.log( singletonTest.pointX );