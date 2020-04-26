/*
If it appears a system has too many direct relationships between components, it may be time to have a central point 
of control that components communicate through instead. The Mediator promotes loose coupling by ensuring that instead 
of components referring to each other explicitly, their interaction is handled through this central point. This can 
help us decouple systems and improve the potential for component reusability.

A real-world analogy could be a typical airport traffic control system. A tower (Mediator) handles what planes can 
take off and land because all communications (notifications being listened out for or broadcast) are done from the 
planes to the control tower, rather than from plane-to-plane. A centralized controller is key to the success of this 
system and that's really the role a Mediator plays in software design.

When it comes to the Mediator and Event Aggregator patterns (Publish/subscriber), there are some times where it may 
look like the patterns are interchangeable due to implementation similarities. However, the semantics and intent of 
these patterns are very different.
*/

//A Mediator is an object that coordinates interactions (logic and behavior) between multiple objects. 
//It makes decisions on when to call which objects, based on the actions (or inaction) of other objects and input.
var mediator = {};

var orgChart = {
  addNewEmployee: function(){
    // getEmployeeDetail provides a view that users interact with
    var employeeDetail = this.getEmployeeDetail();
    // when the employee detail is complete, the mediator (the 'orgchart' object) decides what should happen next
    employeeDetail.on("complete", function(employee){
      // set up additional objects that have additional events, which are used by the mediator to do additional things
      var managerSelector = this.selectManager(employee);
      managerSelector.on("save", function(employee){
        employee.save();
      });
    });
  },
  // ...
}

/*
The similarities boil down to two primary items: events and third-party objects.
The difference is why these two patterns are both using events. 

-The event aggregator, as a pattern, is designed to deal with events. 
-The mediator, though, only uses them because it’s convenient.

-In the case of an event aggregator, the third party object is there only to facilitate the pass-through of events 
from an unknown number of sources to an unknown number of handlers. 
-In the case of the mediator, though, the business logic and workflow is aggregated into the mediator itself. 

-An event aggregator facilitates a “fire and forget” model of communication. The object triggering the event doesn’t 
care if there are any subscribers. It just fires the event and moves on. A mediator, though, might use events to make 
decisions, but it is definitely not “fire and forget”. 
-A mediator pays attention to a known set of input or activities so that it can facilitate and coordinate additional 
behavior with a known set of actors (objects).

-In general, an event aggregator is used when you either have too many objects to listen to directly, 
or you have objects that are entirely unrelated.
-A mediator is best applied when two or more objects have an indirect working relationship, and business 
logic or workflow needs to dictate the interactions and coordination of these objects.
*/

//-----------------------------------------------------------------------------------
/*
In this example, when the MenuItem with the right model is clicked, the “menu:click:foo” event will be triggered. 
An instance of the “MyWorkflow” object, assuming one is already instantiated, will handle this specific event and 
will coordinate all of the objects that it knows about, to create the desired user experience and workflow.

We now have a clean separation between the menu and the workflow through an event aggregator and we are still 
keeping the workflow itself clean and maintainable through the use of a mediator.
*/
var MenuItem = MyFrameworkView.extend({
  events: {
    "click .thatThing": "clickedIt"
  },
  clickedIt: function(e){
    e.preventDefault();
    // assume this triggers "menu:click:foo"
    MyFramework.trigger("menu:click:" + this.model.get("name"));
  }
});
 
// ... somewhere else in the app
var MyWorkflow = function(){
  MyFramework.on("menu:click:foo", this.doStuff, this);
};
MyWorkflow.prototype.doStuff = function(){
  // instantiate multiple objects here.
  // set up event handlers for those objects.
  // coordinate all of the objects into a meaningful workflow.
};


//-----------------------------------------------------------------------------------
/*
PROS:
The largest benefit of the Mediator pattern is that it reduces the communication channels needed between 
objects or components in a system from many to many to just many to one. Adding new publishers and 
subscribers is relatively easy due to the level of decoupling present.

CONS:
Perhaps the biggest downside of using the pattern is that it can introduce a single point of failure. Placing a Mediator 
between modules can also cause a performance hit as they are always communicating indirectly. Because of the nature of 
loose coupling, it's difficult to establish how a system might react by only looking at the broadcasts.
*/


/*
Vs Facade:
The Mediator centralizes communication between modules where it's explicitly referenced by these modules. In a sense this 
is multidirectional. The Facade however just defines a simpler interface to a module or system but doesn't add any additional 
functionality. Other modules in the system aren't directly aware of the concept of a facade and could be considered unidirectional.
*/