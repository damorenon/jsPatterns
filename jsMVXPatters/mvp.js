/*
MVP is a derivative of the MVC design pattern which focuses on improving presentation logic.

The P in MVP stands for presenter. It's a component which contains the user-interface business logic for the view. Unlike MVC,
invocations from the view are delegated to the presenter, which are decoupled from the view and instead talk to it through an
interface. This allows for all kinds of useful things such as being able to mock views in unit tests.

The most common implementation of MVP is one which uses a Passive View (a view which is for all intents and purposes "dumb"),
containing little to no logic. If MVC and MVP are different it is because the C and P do different things. In MVP, the P 
observes models and updates views when models change. The P effectively binds models to views, a responsibility which was 
previously held by controllers in MVC.

Solicited by a view, presenters perform any work to do with user requests and pass data back to them. In this respect, they
retrieve data, manipulate it and determine how the data should be displayed in the view. In some implementations, the 
presenter also interacts with a service layer to persist data (models). Models may trigger events but it's the presenters
role to subscribe to them so that it can update the view. In this passive architecture, we have no concept of direct data
binding. Views expose setters which presenters can use to set data.

MVP is generally used most often in enterprise-level applications where it's necessary to reuse as much presentation logic as 
possible. Applications with very complex views and a great deal of user interaction may find that MVC doesn't quite fit the 
bill here as solving this problem may mean heavily relying on multiple controllers. In MVP, all of this complex logic can be 
encapsulated in a presenter, which can simplify maintenance greatly.

As MVP views are defined through an interface and the interface is technically the only point of contact between the system and 
the view (other than a presenter), this pattern also allows developers to write presentation logic without needing to wait for 
designers to produce layouts and graphics for the application.
*/


//-----------------------------------------------------------------------------------
/*
Some developers do however feel that Backbone.js better fits the description of MVP than it does MVC. Their view is that:
-The presenter in MVP better describes the Backbone.View (the layer between View templates and the data bound to it) than a 
controller does
-The model fits Backbone.Model (it isn't greatly different to the models in MVC at all)
-The views best represent templates (e.g Handlebars/Mustache markup templates)

A response to this could be that the view can also just be a View (as per MVC) because Backbone is flexible enough to let it 
be used for multiple purposes. The V in MVC and the P in MVP can both be accomplished by Backbone.View because they're able 
to achieve two purposes: both rendering atomic components and assembling those components rendered by other views.

Our Backbone PhotoView uses the Observer pattern to "subscribe" to changes to a View's model in this.model.bind("change",...). 
It also handles templating in the render() method, but unlike some other implementations, user interaction is also handled 
in the View (see events).
*/
var PhotoView = Backbone.View.extend({
    //... is a list tag.
    tagName: "li",
    // Pass the contents of the photo template through a templating function, cache it for a single photo
    template: _.template( $("#photo-template").html() ),
    // The DOM events specific to an item.
    events: {
      "click img": "toggleViewed"
    },
    // The PhotoView listens for changes to its model, re-rendering. Since there's a one-to-one correspondence between a
    // **Photo** and a **PhotoView** in this app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.model.on( "change", this.render, this );
      this.model.on( "destroy", this.remove, this );
    },
    // Re-render the photo entry
    render: function() {
      $( this.el ).html( this.template(this.model.toJSON() ));
      return this;
    },
    // Toggle the `"viewed"` state of the model.
    toggleViewed: function() {
      this.model.viewed();
    }
});