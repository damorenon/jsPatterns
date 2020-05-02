/*
The Flyweight pattern is a classical structural solution for optimizing code that is repetitive, slow and 
inefficiently shares data. It aims to minimize the use of memory in an application by sharing as much data 
as possible with related objects

Flyweight data sharing can involve taking several similar objects or data constructs used by a number of 
objects and placing this data into a single external object. We can pass through this object to those 
depending on this data, rather than storing identical data across each one.

There are two ways in which the Flyweight pattern can be applied. The first is at the data-layer. 
The second is at the DOM-layer


Shraing Data:
In the Flyweight pattern there's a concept of two states - intrinsic and extrinsic. Intrinsic information may 
be required by internal methods in our objects which they absolutely cannot function without. Extrinsic 
information can however be removed  and stored externally.
Objects with the same intrinsic data can be replaced with a single shared object, created by a factory method.

We will be making use of three types of Flyweight components in this implementation, which are listed below:
->Flyweight: corresponds to an interface through which flyweights are able to receive and act on extrinsic states
->Concrete Flyweight: actually implements the Flyweight interface and stores intrinsic state. Concrete Flyweights need to be 
sharable and capable of manipulating state that is extrinsic
->Flyweight Factory: manages flyweight objects and creates them too. It makes sure that our flyweights are shared and manages 
them as a group of objects which can be queried if we require individual instances. If an object has been already created in 
the group it returns it, otherwise it adds a new object to the pool and returns it.

These correspond to the following definitions in our implementation:
-CoffeeOrder: Flyweight
-CoffeeFlavor: Concrete Flyweight
-CoffeeOrderContext: Helper
-CoffeeFlavorFactory: Flyweight Factory
-testFlyweight: Utilization of our Flyweights
*/


// Simulate pure virtual inheritance/"implement" keyword for JS
Function.prototype.implementsFor = function( parentClassOrObject ){
    if ( parentClassOrObject.constructor === Function ) {
        // Normal Inheritance
        this.prototype = new parentClassOrObject();
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    } else {
        // Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
};

// Flyweight object
var CoffeeOrder = {
	// Interfaces
	serveCoffee: function(context){},
	getFlavor: function(){}
};
// ConcreteFlyweight object that creates ConcreteFlyweight
// Implements CoffeeOrder
function CoffeeFlavor( newFlavor ){
    var flavor = newFlavor;
    // If an interface has been defined for a feature
    // implement the feature
    if( typeof this.getFlavor === "function" ){
    	this.getFlavor = function() {
        	return flavor;
    	};
    }
    if( typeof this.serveCoffee === "function" ){
    	this.serveCoffee = function( context ) {
    		console.log("Serving Coffee flavor "
        	+ flavor
        	+ " to table number "
        	+ context.getTable());
    	};
    }
}
// Implement interface for CoffeeOrder
CoffeeFlavor.implementsFor( CoffeeOrder );
// Handle table numbers for a coffee order
function CoffeeOrderContext( tableNumber ) {
	return{
    	getTable: function() {
        	return tableNumber;
    	}
	};
}
function CoffeeFlavorFactory() {
    var flavors = {},
    	length = 0;
    return {
        getCoffeeFlavor: function (flavorName) {
            var flavor = flavors[flavorName];
            if (typeof flavor === "undefined") {
                flavor = new CoffeeFlavor(flavorName);
                flavors[flavorName] = flavor;
                length++;
            }
            return flavor;
        },
        getTotalCoffeeFlavorsMade: function () {
            return length;
        }
    };
}
// Sample usage: testFlyweight()
function testFlyweight(){
	// The flavors ordered.
	var flavors = [],
	// The tables for the orders.
    tables = [],
	// Number of orders made
    ordersMade = 0,
	// The CoffeeFlavorFactory instance
    flavorFactory = new CoffeeFlavorFactory();

	function takeOrders( flavorIn, table) {
    	flavors.push( flavorFactory.getCoffeeFlavor( flavorIn ) );
    	tables.push( new CoffeeOrderContext( table ) );
    	ordersMade++;
	}
	takeOrders("Cappuccino", 2);
	takeOrders("Cappuccino", 2);
	takeOrders("Frappe", 1);
	takeOrders("Frappe", 1);
	takeOrders("Xpresso", 1);
	takeOrders("Frappe", 897);
	takeOrders("Cappuccino", 97);
	takeOrders("Cappuccino", 97);
	takeOrders("Frappe", 3);
	takeOrders("Xpresso", 3);
	takeOrders("Cappuccino", 3);
	takeOrders("Xpresso", 96);
	takeOrders("Frappe", 552);
	takeOrders("Cappuccino", 121);
	takeOrders("Xpresso", 121);
	for (var i = 0; i < ordersMade; ++i) {
		flavors[i].serveCoffee(tables[i]);
	}
	console.log(" ");
	console.log("total CoffeeFlavor objects made: " + flavorFactory.getTotalCoffeeFlavorsMade());
}


//-----------------------------------------------------------------------------------
/*
Converting code to use the Flyweight pattern:
Next, let's continue our look at Flyweights by implementing a system to manage all of the books in a library. 
The important meta-data for each book could probably be broken down as follows:
->ID, Title, Author, Genre, Page count, Publisher ID, ISBN

We'll also require the following properties to keep track of which member has checked out a particular book, 
the date they've checked it out on as well as the expected date of return:
->heckoutDate, checkoutMember, dueReturnDate, availability
*/

// Each book would thus be represented as follows, prior to any optimization using the Flyweight pattern:
var Book = function(id, title, author, genre, pageCount,
	publisherID, ISBN, checkoutDate, checkoutMember, dueReturnDate,availability){
   this.id = id;
   this.title = title;
   this.author = author;
   this.genre = genre;
   this.pageCount = pageCount;
   this.publisherID = publisherID;
   this.ISBN = ISBN;
   this.checkoutDate = checkoutDate;
   this.checkoutMember = checkoutMember;
   this.dueReturnDate = dueReturnDate;
   this.availability = availability;
};
Book.prototype = {
	getTitle: function () {
		return this.title;
	},
	getAuthor: function () {
		return this.author;
	},
	getISBN: function (){
		return this.ISBN;
	},
	// For brevity, other getters are not shown
	updateCheckoutStatus: function( bookID, newStatus, checkoutDate, checkoutMember, newReturnDate ){
		this.id = bookID;
		this.availability = newStatus;
		this.checkoutDate = checkoutDate;
		this.checkoutMember = checkoutMember;
		this.dueReturnDate = newReturnDate;
	},
	extendCheckoutPeriod: function( bookID, newReturnDate ){
		this.id = bookID;
		this.dueReturnDate = newReturnDate;
	},
  	isPastDue: function(bookID){
    	var currentDate = new Date();
    	return currentDate.getTime() > Date.parse( this.dueReturnDate );
	}
};

/*
We can now separate our data into intrinsic and extrinsic states as follows: data relevant to the book object (title, author etc) 
is intrinsic whilst the checkout data (checkoutMember, dueReturnDate etc) is considered extrinsic. Effectively this means that only 
one Book object is required for each combination of book properties. it's still a considerable quantity of objects, but significantly 
fewer than we had previously.
*/

// Flyweight optimized version
var Book = function ( title, author, genre, pageCount, publisherID, ISBN ) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.pageCount = pageCount;
    this.publisherID = publisherID;
    this.ISBN = ISBN;
};
// Book Factory singleton
// This makes sure that we only create a single copy of each unique intrinsic piece of data
var BookFactory = (function () {
	var existingBooks = {}, existingBook;
  	return {
    	createBook: function ( title, author, genre, pageCount, publisherID, ISBN ) {
		    // Find out if a particular book meta-data combination has been created before
		    // !! or (bang bang) forces a boolean to be returned
		    existingBook = existingBooks[ISBN];
		    if ( !!existingBook ) {
		    	return existingBook;
		    } else { 
		        // if not, let's create a new instance of the book and store it
		        var book = new Book( title, author, genre, pageCount, publisherID, ISBN );
		        existingBooks[ISBN] = book;
		        return book;
		    }
	    }
	};
})();
// BookRecordManager singleton
var BookRecordManager = (function () {
  	var bookRecordDatabase = {};
  	return {
    	// add a new book into the library system
    	addBookRecord: function (id, title, author, genre, pageCount, 
    		publisherID, ISBN, checkoutDate, checkoutMember, dueReturnDate, availability) {
      		var book = BookFactory.createBook( title, author, genre, pageCount, publisherID, ISBN );
      		bookRecordDatabase[id] = {
		        checkoutMember: checkoutMember,
		        checkoutDate: checkoutDate,
		        dueReturnDate: dueReturnDate,
		        availability: availability,
		        book: book
      		};
    	},
		updateCheckoutStatus: function ( bookID, newStatus, checkoutDate, checkoutMember, newReturnDate ) {
			var record = bookRecordDatabase[bookID];
			record.availability = newStatus;
			record.checkoutDate = checkoutDate;
			record.checkoutMember = checkoutMember;
			record.dueReturnDate = newReturnDate;
    	},
		extendCheckoutPeriod: function ( bookID, newReturnDate ) {
			bookRecordDatabase[bookID].dueReturnDate = newReturnDate;
		},
		isPastDue: function ( bookID ) {
			var currentDate = new Date();
			return currentDate.getTime() > Date.parse( bookRecordDatabase[bookID].dueReturnDate );
		}
	};
})();


//-----------------------------------------------------------------------------------
/*
The Flyweight pattern and the DOM
The DOM (Document Object Model) supports two approaches that allow objects to detect events: In event capture, the event 
is first captured by the outer-most element and propagated to the inner-most element. In event bubbling, the event is 
captured and given to the inner-most element and then propagated to the outer-elements.

Normally what we do when constructing our own accordion component, menu or other list-based widget is bind a click event to 
each link element in the parent container (e.g $('ul li a').on(..). Instead of binding the click to multiple elements, we can
easily attach a Flyweight to the top of our container which can listen for events coming from below:
*/

//HTML
<div id="container">
	<div class="toggle" href="#">More Info (Address)
    	<span class="info">
        	This is more information
    	</span>
    </div>
   <div class="toggle" href="#">Even More Info (Map)
       <span class="info">
          <iframe src="http://www.map-generator.net/extmap.php?name=London&amp;address=london%2C%20england&amp;width=500...gt;"</iframe>
       </span>
   </div>
</div>

// JS
var stateManager = {
	fly: function () {
		var self = this;
		$("#container")
		    .unbind()
		    .on( "click", "div.toggle", function ( e ) {
		    	self.handleClick( e.target );
		    });
	},
	handleClick: function ( elem ) {
		$(elem).find("span").toggle("slow");
	}
};