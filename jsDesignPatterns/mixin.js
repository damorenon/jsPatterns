/*
Mixins are classes which offer functionality that can be easily inherited by a sub-class or group of sub-classes 
for the purpose of function re-use.

Sub-classing is a term that refers to inheriting properties for a new object from a base or superclass object. 
In traditional object-oriented programming, a class B is able to extend another class A. Here we consider A a 
superclass and B a subclass of A. As such, all instances of B inherit the methods from A. B is however still 
able to define its own methods, including those that override methods originally defined by A.
Should B need to invoke a method in A that has been overridden, we refer to this as method chaining. 
Should B need to invoke the constructor A (the superclass), we call this constructor chaining.

In JavaScript, we can look at inheriting from Mixins as a means of collecting functionality through extension. 
Each new object we define has a prototype from which it can inherit further properties. Prototypes can inherit 
from other object prototypes but, even more importantly, can define properties for any number of object instances. 
We can leverage this fact to promote function re-use.
*/

var myMixins = {
	moveUp: function(){
		console.log( "move up" );
	},
	moveDown: function(){
    	console.log( "move down" );
	},
	stop: function(){
    	console.log( "stop! in the name of love!" );
	}
};

/*
We can then easily extend the prototype of existing constructor functions to include this behavior using a helper such as 
the Underscore.js _.extend() method:
*/
// A skeleton carAnimator constructor
function CarAnimator(){
  this.moveLeft = function(){
    console.log( "move left" );
  };
}
// A skeleton personAnimator constructor
function PersonAnimator(){
  this.moveRandomly = function(){ /*..*/ };
}
// Extend both constructors with our Mixin
_.extend( CarAnimator.prototype, myMixins );
_.extend( PersonAnimator.prototype, myMixins );
 
// Create a new instance of carAnimator
var myAnimator = new CarAnimator();
myAnimator.moveLeft(); // move left
myAnimator.moveDown(); // move down
myAnimator.stop(); // stop! in the name of love!


//-----------------------------------------------------------------------------------
// Other example. Define a simple Car constructor
var Car = function ( settings ) {
    this.model = settings.model || "no model provided";
    this.color = settings.color || "no colour provided";
};
// Mixin
var Mixin = function () {};
Mixin.prototype = {
    driveForward: function () {
        console.log( "drive forward" );
    },
    driveBackward: function () {
        console.log( "drive backward" );
    },
    driveSideways: function () {
        console.log( "drive sideways" );
    }
};
// Extend an existing object with a method from another
function augment( receivingClass, givingClass ) {
    // only provide certain methods
    if ( arguments[2] ) {
        for ( var i = 2, len = arguments.length; i < len; i++ ) {
            receivingClass.prototype[arguments[i]] = givingClass.prototype[arguments[i]];
        }
    }
    // provide all methods
    else {
        for ( var methodName in givingClass.prototype ) {
            // check to make sure the receiving class doesn't have a method of the same name as the one currently being processed
            if ( !Object.hasOwnProperty.call(receivingClass.prototype, methodName) ) {
                receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            }
            // Alternatively (check prototype chain as well):
            // if ( !receivingClass.prototype[methodName] ) {
            // receivingClass.prototype[methodName] = givingClass.prototype[methodName];
            // }
        }
    }
}
// Augment the Car constructor to include "driveForward" and "driveBackward"
augment( Car, Mixin, "driveForward", "driveBackward" );
// Create a new Car
var myCar = new Car({
    model: "Ford Escort",
    color: "blue"
});
// Test to make sure we now have access to the methods
myCar.driveForward(); // drive forward
myCar.driveBackward(); // drive backward

// We can also augment Car to include all functions from our mixin
// by not explicitly listing a selection of them
augment( Car, Mixin );
var mySportsCar = new Car({
    model: "Porsche",
    color: "red"
});
mySportsCar.driveSideways(); // drive sideways


//-----------------------------------------------------------------------------------
/*
PROS:
-Mixins assist in decreasing functional repetition and increasing function re-use in a system.

CONS:
-The downsides to Mixins are a little more debatable. Some developers feel that injecting 
functionality into an object prototype is a bad idea as it leads to both prototype pollution 
and a level of uncertainty regarding the origin of our functions.
*/