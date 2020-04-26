/*
We would simply define all of our functions and variables in the private scope and return an anonymous object 
with pointers to the private functionality we wished to reveal as public.
*/
var myRevealingModule = (function () {
    var privateVar = "Ben Cherry",
        publicVar = "Hey there!";
    function privateFunction() {
        console.log( "Name:" + privateVar );
    }
    function publicSetName( strName ) {
        privateVar = strName;
    }
    function publicGetName() {
        privateFunction();
    }
    // Reveal public pointers to private functions and properties
    return {
        setName: publicSetName,
        greeting: publicVar,
        getName: publicGetName
    };
})();
myRevealingModule.setName( "Paul Kinlan" );

//-----------------------------------------------------------------------------------


// used to reveal private functions and properties with a more specific naming scheme if we would prefer:
var myRevealingModule = (function () {
    var privateCounter = 0;
    function privateFunction() {
        privateCounter++;
    }
    function publicFunction() {
        publicIncrement();
    }
    function publicIncrement() {
        privateFunction();
    }
    function publicGetCount(){
      return privateCounter;
    }
    // Reveal public pointers to private functions and properties
   return {
        start: publicFunction,
        increment: publicIncrement,
        count: publicGetCount
    };
})();
myRevealingModule.start();