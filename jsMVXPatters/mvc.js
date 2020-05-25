/*
MVC is an architectural design pattern that encourages improved application organization through a separation of concerns. 
It enforces the isolation of business data (Models) from user interfaces (Views), with a third component (Controllers) 
traditionally managing logic and user-input. 

Smalltalk-80's MVC architecture (allows the reuse of models for other interfaces in the application):
->A Model represented domain-specific data and was ignorant of the user-interface (Views and Controllers). When a model changed, 
it would inform its observers.
->A View represented the current state of a Model. The Observer pattern was used for letting the View know whenever the Model 
was updated or modified.
->Presentation was taken care of by the View, but there wasn't just a single View and Controller - a View-Controller pair was 
required for each section or element being displayed on the screen.
->The Controllers role in this pair was handling user interaction (such as key-presses and actions e.g. clicks), making decisions 
for the View.
*/



//-----------------------------------------------------------------------------------
/*
MODELS manage the data for an application. They are concerned with neither the user-interface nor presentation layers but instead 
represent unique forms of data that an application may require. When a model changes (e.g when it is updated), it will typically 
notify its observers (e.g views) that a change has occurred so that they may react accordingly.

The built-in capabilities of models vary across frameworks, however it is quite common for them to support validation of attributes, 
where attributes represent the properties of the model, such as a model identifier. When using models in real-world applications we 
generally also desire model persistence. PERSISTENCE allows us to edit and update models with the knowledge that its most recent 
state will be saved in either: memory, in a user's localStorage data-store or synchronized with a database.

So to summarize, models are primarily concerned with business data.
*/

//Example: in photo gallery app, photo merit its own model (in Backbone.js) 
var Photo = Backbone.Model.extend({
    // Default attributes for the photo
    defaults: {
      src: "placeholder.jpg",
      caption: "A default image",
      viewed: false
    },
    // Ensure that each photo created has an `src`.
    initialize: function() {
       this.set( { "src": this.defaults.src} );
    }
});

/*
It is not uncommon for modern MVC/MV* frameworks to provide a means to group models together (e.g. in Backbone, these groups are 
referred to as "collections"). Managing models in groups allows us to write application logic based on notifications from the 
group should any model it contains be changed. This avoids the need to manually observe individual model instances.
*/
var PhotoGallery = Backbone.Collection.extend({
    // Reference to this collection's model.
    model: Photo,
    // Filter down the list of all photos that have been viewed
    viewed: function() {
        return this.filter(function( photo ){
           return photo.get( "viewed" );
        });
    },
    // Filter down the list to only photos that have not yet been viewed
    unviewed: function() {
      return this.without.apply( this, this.viewed() );
    }
});



//-----------------------------------------------------------------------------------
/*
A VIEW typically observes a model and is notified when the model changes, allowing the view to update itself accordingly. Design 
pattern literature commonly refers to views as "dumb" given that their knowledge of models and controllers in an application is 
limited. Users are able to interact with views and this includes the ability to read and edit (i.e get or set the attribute values
in) models. As the view is the presentation layer, we generally present the ability to edit and update in a user-friendly fashion.

When users click on any elements within the view, it's not the view's responsibility to know what to do next. It relies on a 
controller to make this decision for it.

To summarize, views are a visual representation of our application data.
*/

var buildPhotoView = function ( photoModel, photoController ) {
  	var base = document.createElement( "div" ),
    	photoEl = document.createElement( "div" );
  	base.appendChild(photoEl);
	//We define a render() utility within our view which is responsible for rendering the contents of the photoModel using a 
	//JavaScript templating engine (Underscore templating) and updating the contents of our view, referenced by photoEl.
  	var render = function () {
        // We use a templating library such as Underscore templating which generates the HTML for our photo entry
        photoEl.innerHTML = _.template( "#photoTemplate", {
            src: photoModel.getSrc()
        });
    };
    //The photoModel then adds our render() callback as one of its subscribers so that through the Observer pattern we can trigger 
    //the view to update when the model changes.
	photoModel.addSubscriber( render );
	//Delegates handling the click behavior back to the controller, passing the model info along with it in case it's needed.
	photoEl.addEventListener( "click", function () {
    	photoController.handleEvent( "click", photoModel );
  	});
  	var show = function () {
    	photoEl.style.display = "";
  	};
  	var hide = function () {
    	photoEl.style.display = "none";
  	};
  	return {
    	showView: show,
    	hideView: hide
  	};
};

/*
TEMPLATING: It has long been considered (and proven) a performance bad practice to manually create large blocks of HTML markup 
in-memory through string concatenation. JavaScript templating solutions (such as Handlebars.js and Mustache) are often used to 
define templates for views as markup (either stored externally or within script tags with a custom type - e.g text/template) 
containing template variables. Variables may be delimitated using a variable syntax (e.g {{name}}) and frameworks are typically 
smart enough to accept data in a JSON form (which model instances can be converted to) such that we only need be concerned with 
maintaining clean models and clean templates

Note that templates are not themselves views. A view is an object which observes a model and keeps the visual representation 
up-to-date. A template *might* be a declarative way to specify part or even all of a view object so that it can be generated 
from the template specification.
*/

//Handlebars.js:
<li class="photo">
  <h2>{{caption}}</h2>
  <img class="source" src="{{src}}"/>
  <div class="meta-data">
    {{metadata}}
  </div>
</li>

//Underscore.js Microtemplates:
<li class="photo">
  <h2><%= caption %></h2>
  <img class="source" src="<%= src %>"/>
  <div class="meta-data">
    <%= metadata %>
  </div>
</li>



//-----------------------------------------------------------------------------------
/*
CONTROLLERS are an intermediary between models and views which are classically responsible for updating the model when the user 
manipulates the view.

Remember that the controllers fulfill one role in MVC: the facilitation of the Strategy pattern for the view. In the Strategy 
pattern regard, the view delegates to the controller at the view's discretion. So, that's how the strategy pattern works. 
The view could delegate handling user events to the controller when the view sees fit. The view *could* delegate handling model 
change events to the controller if the view sees fit, but this is not the traditional role of the controller.

In terms of where most JavaScript MVC frameworks detract from what is conventionally considered "MVC" however, it is with 
controllers. The reasons for this vary, but in my honest opinion, it is that framework authors initially look at the server-side 
interpretation of MVC, realize that it doesn't translate 1:1 on the client-side and re-interpret the C in MVC to mean something 
they feel makes more sense. The issue with this however is that it is subjective, increases the complexity in both understanding 
the classical MVC pattern and of course the role of controllers in modern frameworks.

To summarize, controllers manage the logic and coordination between models and views in an application.
*/

/*
In Spine, controllers are considered the glue for an application, adding and responding to DOM events, rendering templates and 
ensuring that views and models are kept in sync (which makes sense in the context of what we know to be a controller).
*/
// Controllers in Spine are created by inheriting from Spine.Controller
var PhotosController = Spine.Controller.sub({
	init: function () {
		this.item.bind( "update", this.proxy( this.render ));
		this.item.bind( "destroy", this.proxy( this.remove ));
	},
  	render: function () {
    	// Handle templating
    	this.replace( $( "#photoTemplate" ).tmpl( this.item ) );
    	return this;
  	},
  	remove: function () {
    	this.el.remove();
    	this.release();
  	}
});



//-----------------------------------------------------------------------------------
/*
This separation of concerns in MVC facilitates simpler modularization of an application's functionality and enables:
->Easier overall maintenance. When updates need to be made to the application it is very clear whether the changes are data-centric, 
meaning changes to models and possibly controllers, or merely visual, meaning changes to views.
->Decoupling models and views means that it is significantly more straight-forward to write unit tests for business logic
->Duplication of low-level model and controller code (i.e what we may have been using instead) is eliminated across the application
->Depending on the size of the application and separation of roles, this modularity allows developers responsible for core logic and 
developers working on the user-interfaces to work simultaneously

The GoF do not refer to MVC as a design pattern, but rather consider it a set of classes to build a user interface. In their view, 
it's actually a variation of three classical design patterns: the Observer, Strategy and Composite patterns. Depending on how MVC 
has been implemented in a framework, it may also use the Factory and Template patterns. The GoF book mentions these patterns as 
useful extras when working with MVC.

As we have discussed, models represent application data whilst views are what the user is presented on screen. As such, MVC relies 
on the Observer pattern for some of its core communication (something that surprisingly isn't covered in many articles about the 
MVC pattern). When a model is changed it notifies its observers (Views) that something has been updated - this is perhaps the most 
important relationship in MVC. The observer nature of this relationship is also what facilitates multiple views being attached to 
the same model.
*/