/*
-The GoF refer to the prototype pattern as one which creates objects based on a template of an existing object through cloning.
-We can think of the prototype pattern as being based on prototypal inheritance where we create objects which act as prototypes 
for other objects.
-One of the benefits of using the prototype pattern is that we're working with the prototypal strengths JavaScript has to offer 
natively rather than attempting to imitate features of other languages.

Object.create allows us to easily implement advanced concepts such as differential inheritance where objects are able to directly 
inherit from other objects. 
*/

var myCar = {
  name: "Ford Escort",
  drive: function () {
    console.log( "Weeee. I'm driving!" );
  },
  panic: function () {
    console.log( "Wait. How do you stop this thing?" );
  }
};
// Use Object.create to instantiate a new car
var yourCar = Object.create( myCar );
// Now we can see that one is a prototype of the other
console.log( yourCar.name );


//-----------------------------------------------------------------------------------
//Object.create also allows us to initialise object properties using the second supplied argument.
var vehicle = {
  getModel: function () {
    console.log( "The model of this vehicle is.." + this.model );
  }
};
 
var car = Object.create(vehicle, {
  "id": {
    value: MY_GLOBAL.nextId(),
    // writable:false, configurable:false by default
    enumerable: true
  },
  "model": {
    value: "Ford",
    enumerable: true
  }
});


//-----------------------------------------------------------------------------------
/*
If we wish to implement the prototype pattern without directly using Object.create, we can simulate the pattern as per the above 
example as follows: (This alternative does not allow the user to define read-only properties in the same manner)
*/
var vehiclePrototype = {
  init: function ( carModel ) {
    this.model = carModel;
  },
  getModel: function () {
    console.log( "The model of this vehicle is.." + this.model);
  }
};
 
function vehicle( model ) {
  function F() {};
  F.prototype = vehiclePrototype;
  var f = new F();
  f.init( model );
  return f;
}
 
var car = vehicle( "Ford Escort" );
car.getModel();


//-----------------------------------------------------------------------------------
//Other alternative:
var beget = (function () {
    function F() {}
    return function ( proto ) {
        F.prototype = proto;
        return new F();
    };
})();