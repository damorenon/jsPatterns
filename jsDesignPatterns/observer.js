/*
The Observer is a design pattern where an object (subject) maintains a list of objects depending on it (observers), 
automatically notifying them of any changes to state.
When a subject needs to notify observers about something, it broadcasts a notification to the observers 
(which can include specific data related to the topic of the notification).
When we no longer wish for a particular observer to be notified of changes by the subject they are registered with, the subject 
can remove them from the list of observers.

Components:
->Subject: maintains a list of observers, facilitates adding or removing observers
->Observer: provides an update interface for objects that need to be notified of a Subject's changes of state
->ConcreteSubject: broadcasts notifications to observers on changes of state, stores the state of ConcreteObservers
->ConcreteObserver: stores a reference to the ConcreteSubject, implements an update interface for the Observer to ensure 
state is consistent with the Subject's
*/

// --- The list of dependent Observers a subject may have:
function ObserverList(){
  this.observerList = [];
}
ObserverList.prototype.add = function( obj ){
  return this.observerList.push( obj );
};
ObserverList.prototype.count = function(){
  return this.observerList.length;
};
ObserverList.prototype.get = function( index ){
  if( index > -1 && index < this.observerList.length ){
    return this.observerList[ index ];
  }
};
ObserverList.prototype.indexOf = function( obj, startIndex ){
  var i = startIndex;
  while( i < this.observerList.length ){
    if( this.observerList[i] === obj ){
      return i;
    }
    i++;
  }
  return -1;
};
ObserverList.prototype.removeAt = function( index ){
  this.observerList.splice( index, 1 );
};

// --- The Subject and the ability to add, remove or notify observers on the observer list:
function Subject(){
  this.observers = new ObserverList();
}
Subject.prototype.addObserver = function( observer ){
  this.observers.add( observer );
};
Subject.prototype.removeObserver = function( observer ){
  this.observers.removeAt( this.observers.indexOf( observer, 0 ) );
};
Subject.prototype.notify = function( context ){
  var observerCount = this.observers.count();
  for(var i=0; i < observerCount; i++){
    this.observers.get(i).update( context );
  }
};

// The Observer, The update functionality here will be overwritten later with custom behaviour.
function Observer(){
  this.update = function(){
    // ...
  };
}

//---- HTML:
//A button for adding new observable checkboxes to the page
<button id="addNewObserver">Add New Observer checkbox</button> 
//A control checkbox which will act as a subject, notifying other checkboxes they should be checked
<input id="mainCheckbox" type="checkbox"/> 
//A container for the new checkboxes being added
<div id="observersContainer"></div> 

// ---- Extend an object with an extension
function extend( obj, extension ){
  for ( var key in extension ){
    obj[key] = extension[key];
  }
}
// References to our DOM elements
var controlCheckbox = document.getElementById( "mainCheckbox" ),
  addBtn = document.getElementById( "addNewObserver" ),
  container = document.getElementById( "observersContainer" );
// Concrete Subject
// Extend the controlling checkbox with the Subject class
extend( controlCheckbox, new Subject() );
// Clicking the checkbox will trigger notifications to its observers
controlCheckbox.onclick = function(){
  controlCheckbox.notify( controlCheckbox.checked );
};
addBtn.onclick = addNewObserver;
// Concrete Observer
function addNewObserver(){
  // Create a new checkbox to be added
  var check = document.createElement( "input" );
  check.type = "checkbox";
  // Extend the checkbox with the Observer class
  extend( check, new Observer() );
  // Override with custom update behaviour
  check.update = function( value ){
    this.checked = value;
  };
  // Add the new observer to our list of observers
  // for our main subject
  controlCheckbox.addObserver( check );
  // Append the item to the container
  container.appendChild( check );
}


//-----------------------------------------------------------------------------------
/*
a variation: the Publish/Subscribe pattern. The Observer pattern requires that the observer must subscribe to the subject.
The Publish/Subscribe pattern however uses a topic/event channel which sits between the subscribers and the publisher. 
The idea here is to avoid dependencies between the subscriber and publisher. This differs from the Observer pattern as it allows 
any subscriber implementing an appropriate event handler to register for and receive topic notifications broadcast by the publisher.
*/

// A very simple new mail handler
var mailCounter = 0; // A count of the number of messages received
// Initialize subscribers that will listen out for a topic with the name "inbox/newMessage". Render a preview of new messages
var subscriber1 = subscribe( "inbox/newMessage", function( topic, data ) {
  console.log( "A new message was received: ", topic ); // Log the topic for debugging purposes
  // Use the data that was passed from our subject to display a message preview to the user
  $( ".messageSender" ).html( data.sender );
  $( ".messagePreview" ).html( data.body );
});
//Here's another subscriber using the same data to perform a different task. Update the counter displaying the number of new messages 
//received via the publisher
var subscriber2 = subscribe( "inbox/newMessage", function( topic, data ) {
  $('.newMessageCounter').html( ++mailCounter );
});

publish( "inbox/newMessage", [{
  sender: "hello@google.com",
  body: "Hey there! How are you doing today?"
}]);
/*
We could then at a later point unsubscribe our subscribers from receiving any new topic notifications as follows:
// unsubscribe( subscriber1 );
// unsubscribe( subscriber2 );
*/


//-----------------------------------------------------------------------------------
/*
PROS:
-Breaks down apps into smaller, more loosely coupled blocks to improve code management and potentialas for re-use
-Maintains consistency between related objects without making classes tightly coupled

CONS:
-By decoupling pubs from subs, it can sometimes become difficult to obtain guarantees that particular parts of our applications are 
functioning as we may expect.
-Subscribers are quite ignorant to the existence of each other and are blind to the cost of switching publishers.
*/


//-----------------------------------------------------------------------------------
//Implementations:

// Publish
// jQuery: $(obj).trigger("channel", [arg1, arg2, arg3]);
$( el ).trigger( "/login", [{username:"test", userData:"test"}] );
// Dojo: dojo.publish("channel", [arg1, arg2, arg3] );
dojo.publish( "/login", [{username:"test", userData:"test"}] );
// YUI: el.publish("channel", [arg1, arg2, arg3]);
el.publish( "/login", {username:"test", userData:"test"} );
 
// Subscribe
// jQuery: $(obj).on( "channel", [data], fn );
$( el ).on( "/login", function( event ){...} );
// Dojo: dojo.subscribe( "channel", fn);
var handle = dojo.subscribe( "/login", function(data){..} );
// YUI: el.on("channel", handler);
el.on( "/login", function( data ){...} );
 
// Unsubscribe
// jQuery: $(obj).off( "channel" );
$( el ).off( "/login" );
// Dojo: dojo.unsubscribe( handle );
dojo.unsubscribe( handle );
// YUI: el.detach("channel");
el.detach( "/login" );