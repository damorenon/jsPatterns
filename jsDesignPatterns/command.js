/*
-The general idea behind the Command pattern is that it provides us a means to separate the responsibilities of issuing commands from 
anything executing commands, delegating this responsibility to different objects instead.
-We can think of the relationship between an abstract class and a concrete class, where an abstract class defines an interface, but 
doesn't necessarily provide implementations for all of its member functions. It acts as a base class from which others are derived.
A derived class which implements the missing functionality is called a concrete class.
-Implementation wise, simple command objects bind together both an action and the object wishing to invoke the action. They consistently
include an execution operation (such as run() or execute()). All Command objects with the same interface can easily be swapped as needed 
and this is considered one of the larger benefits of the pattern.
*/

/*
A car purchase service. imagine if the core API behind the carManager changed. This would require all objects directly accessing these 
methods within our application to also be modified. This could be viewed as a layer of coupling which effectively goes against the OOP 
methodology of loosely coupling objects as much as possible. Instead, we could solve this problem by abstracting the API away further.
*/
(function(){
  var carManager = {
    // request information
    requestInfo: function( model, id ){
      return "The information for " + model + " with ID " + id + " is foobar";
    },
    // purchase the car
    buyVehicle: function( model, id ){
      return "You have successfully purchased Item " + id + ", a " + model;
    },
    // arrange a viewing
    arrangeViewing: function( model, id ){
      return "You have successfully booked a viewing of " + model + " ( " + id + " ) ";
    }
  };
})();

//Here is what we would like to be able to achieve:
carManager.execute( "buyVehicle", "Ford Escort", "453543" );

//As per this structure we should now add a definition for the carManager.execute method as follows:
carManager.execute = function ( name ) {
    return carManager[name] && carManager[name].apply( carManager, [].slice.call(arguments, 1) );
};

//Our final sample calls would thus look as follows:
carManager.execute( "arrangeViewing", "Ferrari", "14523" );
carManager.execute( "requestInfo", "Ford Mondeo", "54323" );
carManager.execute( "requestInfo", "Ford Escort", "34232" );
carManager.execute( "buyVehicle", "Ford Escort", "34232" );