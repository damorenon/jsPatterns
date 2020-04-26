/*
-The Factory pattern is another creational pattern concerned with the notion of creating objects. It doesn't 
explicitly require us to use a constructor. Instead, a Factory can provide a generic interface for creating objects, 
where we can specify the type of factory object we wish to be created.
-This is particularly useful if the object creation process is relatively complex, e.g. if it strongly 
depends on dynamic factors or application configuration.
*/

// ----- Types.js - Constructors used behind the scenes
// A constructor for defining new cars
function Car(options) {
  // some defaults
  this.doors = options.doors || 4;
  this.state = options.state || "brand new";
  this.color = options.color || "silver";
}
// A constructor for defining new trucks
function Truck(options){
  this.state = options.state || "used";
  this.wheelSize = options.wheelSize || "large";
  this.color = options.color || "blue";
}
 
// ----- FactoryExample.js: Define a skeleton vehicle factory
function VehicleFactory() {}
// Define the prototypes and utilities for this factory. Our default vehicleClass is Car
VehicleFactory.prototype.vehicleClass = Car;
// Our Factory method for creating new Vehicle instances
VehicleFactory.prototype.createVehicle = function ( options ) {
  switch(options.vehicleType){
    case "car":
      this.vehicleClass = Car;
      break;
    case "truck":
      this.vehicleClass = Truck;
      break;
    //defaults to VehicleFactory.prototype.vehicleClass (Car)
  }
  return new this.vehicleClass(options);
};
// Create an instance of our factory that makes cars
var carFactory = new VehicleFactory();
var car = carFactory.createVehicle({vehicleType: "car", color: "yellow", doors: 6 });
// Test to confirm our car was created using the vehicleClass/prototype Car
console.log( car instanceof Car ); // Outputs: true
console.log( car ); // Outputs: Car object of color "yellow", doors: 6 in a "brand new" state

// ----- Approach #1: Modify a VehicleFactory instance to use the Truck class
var movingTruck = carFactory.createVehicle({
    vehicleType: "truck",
    state: "like new",
    color: "red",
    wheelSize: "small" 
});
// Test to confirm our truck was created with the vehicleClass/prototype Truck. 
console.log( movingTruck instanceof Truck ); //Outputs: true
console.log( movingTruck ); // Outputs: Truck object of color "red", a "like new" state and a "small" wheelSize

// ----- Approach #2: Subclass VehicleFactory to create a factory class that builds Trucks
function TruckFactory () {}
TruckFactory.prototype = new VehicleFactory();
TruckFactory.prototype.vehicleClass = Truck;
var truckFactory = new TruckFactory();
var myBigTruck = truckFactory.createVehicle({
    state: "omg..so bad.",
    color: "pink",
    wheelSize: "so big"
});
// Confirms that myBigTruck was created with the prototype Truck
console.log( myBigTruck instanceof Truck ); // Outputs: true
// Outputs: Truck object with the color "pink", wheelSize "so big" and state "omg. so bad"
console.log( myBigTruck );


//-----------------------------------------------------------------------------------
/*
The Factory pattern can be especially useful when applied to the following situations:
-When our object or component setup involves a high level of complexity
-When we need to easily generate different instances of objects depending on the environment we are in
-When we're working with many small objects or components that share the same properties
-When composing objects with instances of other objects that need only satisfy an API contract (aka, duck typing) 
to work. This is useful for decoupling.
*/


//-----------------------------------------------------------------------------------
/*
-It is also useful to be aware of the Abstract Factory pattern, which aims to encapsulate a group of individual factories 
with a common goal. It separates the details of implementation of a set of objects from their general usage.
-An Abstract Factory should be used where a system must be independent from the way the objects it creates are generated or 
it needs to work with multiple types of objects.
*/
var abstractVehicleFactory = (function () {
    // Storage for our vehicle types
    var types = {};
    return {
        getVehicle: function ( type, customizations ) {
            var Vehicle = types[type];
            return (Vehicle ? new Vehicle(customizations) : null);
        },
        registerVehicle: function ( type, Vehicle ) {
            var proto = Vehicle.prototype;
            // only register classes that fulfill the vehicle contract
            if ( proto.drive && proto.breakDown ) {
                types[type] = Vehicle;
            }
            return abstractVehicleFactory;
        }
    };
})();
// Usage:
abstractVehicleFactory.registerVehicle("car", Car);
abstractVehicleFactory.registerVehicle("truck", Truck);
// Instantiate a new car based on the abstract vehicle type
var car = abstractVehicleFactory.getVehicle("car", {
    color: "lime green",
    state: "like new" 
});
// Instantiate a new truck in a similar manner
var truck = abstractVehicleFactory.getVehicle("truck", {
    wheelSize: "medium",
    color: "neon yellow" 
});