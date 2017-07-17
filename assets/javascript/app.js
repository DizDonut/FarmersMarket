$(document).ready(function(){
  //empty array for search results
  //should be initialized to an empty array every time the the page loads
  var results = [];

  //beginning of google maps embed api url
  var url = "https://www.google.com/maps/embed/v1/search"

  $("#submit").on("click", function(event){
    event.preventDefault();
    //retrieve input from user
    var zipCode = $("#search-value").val().trim();

    //call initMap function, passing the zipCode variable as an argument
    var map = initMap(zipCode);

    //push value of map variable to our results array
    results.push(map);

    //call renderResults function, passing the map variable as an argument
    renderResults(map);

  });//end submit on click event
  
  // allows for hamburger menu collapse to work
	$(".button-collapse").sideNav();

  /*
    renderResults function takes one parameter, loop through the results array and
    dynamically create iframe elements to load to our page
    @param source: source is the value returned from initMap function
  */

  function renderResults(source){
    $("#results-go-here").empty();

    for (var i = 0; i < results.length; i++) {

      var iframes = $("<iframe>", {
        src:          source,
        frameborder:  "0",
        width:        "100%",
        height:       "100%"
      }).appendTo("#results-go-here");
    };
  };

  /*
    initMap function takes one parameter and concatenates that parameter with the global
    url variable, google maps embed API key, and other pertinent q (query) information
    @param zip: zip will be the value returned from the user input form
  */
  function initMap(zip){
    url += "?" + $.param({
      "key":  "AIzaSyC-esHVNQ4muZerDSPt3ChxUd8-agTMc_c",
      "q": "Farmers+Market+near" + zip
    });
    return url;
  };

})//end document ready
	

