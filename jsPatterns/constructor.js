// *** Each of the following options will create a new empty object:
var newObject = {};
var newObject2 = Object.create( Object.prototype );
var newObject3 = new Object(); //also creates object wrapper for a specific value, or empty object if no value

//-----------------------------------------------------------------------------------



// *** Four ways in which keys and values can be assigned to an object:

// ----- ECMAScript 3 compatible approaches
// -- 1. Dot syntax
newObject.someKey = "Hello World"; // Set properties
var value = newObject.someKey; // Get properties
 
// -- 2. Square bracket syntax
newObject["someKey2"] = "Hello World"; // Set properties
var value = newObject["someKey2"]; // Get properties
 
// ----- ECMAScript 5 only compatible approaches
// For more information see: http://kangax.github.com/es5-compat-table/
 
// -- 3. Object.defineProperty
// Set properties
Object.defineProperty( newObject, "someKey3", {
    value: "for more control of the property's behavior",
    writable: true,
    enumerable: true,
    configurable: true
});
 
// -- 4. Object.defineProperties
// Set properties
Object.defineProperties( newObject, {
  "someKey4": {
    value: "Hello World",
    writable: true
  },
  "anotherKey": {
    value: "Foo bar",
    writable: false
  }
});
 
// Getting properties for 3. and 4. can be done using any of the options in 1. and 2.

//-----------------------------------------------------------------------------------



// *** These methods can even be used for inheritance. Usage:
var person = {
	"car": "Delorean",
	"dateOfBirth": "1981",
	"hasBeard": false
};
// Create a race car driver that inherits from the person object
var driver = Object.create( person );
// Set some properties for the driver
Object.defineProperty( driver, "topSpeed", {
    value: "100mph",
    writable: true,
    enumerable: true,
    configurable: true
});
console.log( driver.dateOfBirth ); // Get an inherited property (1981)
console.log( driver.topSpeed ); // Get the property we set (100mph)

//-----------------------------------------------------------------------------------


// *** Basic contructors:
//"this" references the new object that's being created.
function Car( model, year, miles ) {
  this.model = model;
  this.year = year;
  this.miles = miles;
  this.toString = function () {
    return this.model + " has done " + this.miles + " miles";
  };
}
// Usage:
// We can create new instances of the car
var civic = new Car( "Honda Civic", 2009, 20000 );
var mondeo = new Car( "Ford Mondeo", 2010, 5000 );
// and then open our browser console to view the output of the toString() method being called on these objects
console.log( civic.toString() );
console.log( mondeo.toString() );

//The above is a simple version of the constructor pattern but it does suffer from some problems

//-----------------------------------------------------------------------------------


//Constructors with prototypes:
function Car2( model, year, miles ) {
  this.model = model;
  this.year = year;
  this.miles = miles;
}
// Note here that we are using Object.prototype.newMethod rather than Object.prototype so as to avoid redefining the prototype object
Car2.prototype.toString = function () {
  return this.model + " has done " + this.miles + " miles";
};
// Usage:
var civic = new Car2( "Honda Civic", 2009, 20000 );
var mondeo = new Car2( "Ford Mondeo", 2010, 5000 );
console.log( civic.toString() );
console.log( mondeo.toString() );

//Above, a single instance of toString() will now be shared between all of the Car objects.

