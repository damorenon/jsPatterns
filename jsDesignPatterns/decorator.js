/*
Decorators are a structural design pattern that aim to promote code re-use. Similar to Mixins, they can be considered 
another viable alternative to object sub-classing.They can be used to modify existing systems where we wish to add 
additional features to objects without the need to heavily modify the underlying code using them.

The Decorator pattern isn't heavily tied to how objects are created but instead focuses on the problem of extending their 
functionality. Rather than just relying on prototypal inheritance, we work with a single base object and progressively add 
decorator objects which provide the additional capabilities. The idea is that rather than sub-classing, we add (decorate) 
properties or methods to a base object so it's a little more streamlined.

The biggest problem with interfaces is that, as there isn't built-in support for them in JavaScript, there is a danger of 
us attempting to emulate a feature of another language that may not be an ideal fit.
*/

//Example 1: Decorating Constructors With New Functionality
// A vehicle constructor
function Vehicle( vehicleType ){
    // some sane defaults
    this.vehicleType = vehicleType || "car";
    this.model = "default";
    this.license = "00000-000";
}
// Test instance for a basic vehicle
var testInstance = new Vehicle( "car" );
console.log( testInstance ); //vehicle:car, model:default, license:00000-000
// Lets create a new instance of vehicle, to be decorated
var truck = new Vehicle( "truck" );
// New functionality we're decorating vehicle with
truck.setModel = function( modelName ){
    this.model = modelName;
};
truck.setColor = function( color ){
    this.color = color;
};
// Test the value setters and value assignment works correctly
truck.setModel( "CAT" );
truck.setColor( "blue" );
console.log( truck ); // vehicle:truck, model:CAT, color:blue
// Demonstrate "vehicle" is still unaltered
var secondInstance = new Vehicle( "car" );
console.log( secondInstance ); //vehicle:car, model:default, license:00000-000


//-----------------------------------------------------------------------------------
//Example 2: Decorating Objects With Multiple Decorators
// The constructor to decorate
function MacBook() {
  this.cost = function () { return 997; };
  this.screenSize = function () { return 11.6; };
}
// Decorator 1
function memory( macbook ) {
  var v = macbook.cost();
  macbook.cost = function() {
    return v + 75;
  };
}
// Decorator 2
function engraving( macbook ){
  var v = macbook.cost();
  macbook.cost = function(){
    return v + 200;
  };
}
// Decorator 3
function insurance( macbook ){
  var v = macbook.cost();
  macbook.cost = function(){
     return v + 250;
  };
}
//Instance
var mb = new MacBook();
memory( mb );
engraving( mb );
insurance( mb );
// Outputs:
console.log( mb.cost() ); // 1522
console.log( mb.screenSize() ); // 11.6


//-----------------------------------------------------------------------------------
/*
Variation:
->Interfaces: they're self-documenting and promote reusability. In theory, interfaces also make code more stable by 
ensuring changes to them must also be made to the objects implementing them.
*/

// Create interfaces using a pre-defined Interface constructor that accepts an interface name and skeleton methods to expose.
// In our reminder example summary() and placeOrder() represent functionality the interface should support
var reminder = new Interface( "List", ["summary", "placeOrder"] );
var properties = {
  name: "Remember to buy the milk",
  date: "05/06/2016",
  actions:{
    summary: function (){
      return "Remember to buy the milk, we are almost out!";
   },
    placeOrder: function (){
      return "Ordering milk from your local grocery store";
    }
  }
};
// Now create a constructor implementing the above properties and methods
function Todo( config ){
  // State the methods we expect to be supported as well as the Interface instance being checked against
  Interface.ensureImplements( config.actions, reminder );
  this.name = config.name;
  this.methods = config.actions;
}
// Create a new instance of our Todo constructor
var todoItem = new Todo( properties );
// Finally test to make sure these function correctly
console.log( todoItem.methods.summary() ); // Remember to buy the milk, we are almost out!
console.log( todoItem.methods.placeOrder() ); // Ordering milk from your local grocery store


//-----------------------------------------------------------------------------------
/*
PROS:
-Developers enjoy using this pattern as it can be used transparently and is also fairly flexible - as we've seen, objects 
can be wrapped or "decorated" with new behavior and then continue to be used without needing to worry about the base 
object being modified. 
-In a broader context, this pattern also avoids us needing to rely on large numbers of subclasses to get the same benefits.

CONS:
-If poorly managed, it can significantly complicate our application architecture as it introduces many small, but similar 
objects into our namespace. The concern here is that in addition to becoming hard to manage, other developers unfamiliar 
with the pattern may have a hard time grasping why it's being used.
*/