$(document).ready(function() {

        $('.collapsible').collapsible();


        $(document).on("click", "#submit", function(event) {
            event.preventDefault();

            //TODO: (suggestion - Jim) clear list of farmer's markets currently displayed

            //retrieve input from user
            var zipCode = $("#zipSearch").val().trim();
            $("#zipSearch").html("").val("");
            //call initMap function, passing the zipCode variable as an argument
            var map = ourFunctions.initMap(zipCode);
            //call renderResults function, passing the map variable as an argument
            ourFunctions.renderResults(map);
            ourFunctions.getFirstResults(zipCode);

        }); //end submit on click event

      $(document).on("click", ".collapsible-header", function(event){
        event.preventDefault();

        ourFunctions.createComments();

      })//end accordion click event


        // allows for hamburger menu collapse to work
        $(".button-collapse").sideNav();

        //TODO: Jim - scrape website for foods in season data



/*
  object to hold the functions
*/

var ourFunctions = {
  /*
    renderResults function takes one parameter, loop through the mapResults array and
    dynamically create iframe elements to load to our page
    @param source: source is the value returned from initMap function
  */
  renderResults: function(source) {
    $("#mapResults-go-here").empty();
    var iframes = $("<iframe>", {
      src: source,
      frameborder: "0",
      zoom: "10",
      width: "650px",
      height: "450px"
    }).appendTo("#mapResults-go-here");
  },

  /*
    initMap function takes one parameter and concatenates that parameter with the global
    url variable, google maps embed API key, and other pertinent q (query) information
    @param zip: zip will be the value returned from the user input form
  */
  initMap: function(address) {
    //beginning of google maps embed api url
    var url = "https://www.google.com/maps/embed/v1/search"
    url += "?" + $.param({
      "key": "AIzaSyC-esHVNQ4muZerDSPt3ChxUd8-agTMc_c",
      "q": "Farmers+Markets+near" + address
    });
    return url;
  },

  /*
    getFirstResults function accepts one parameter and makes an ajax call using the USDA API to pull back
    the ID of each farmers market within a certain radius of the given zip code.  This function will also dynamically
    create collapsible elements on the page and place divs within those elements, that will later be populated
    on the call of the getSecondResults function.
    @param zip: the value of the zip code entered by the user on the search page
  */
  getFirstResults: function(zip) {
    var id = "";
    var name = "";

    $.ajax({
      type: "GET",
      contentType: "application/json; charset=utf-8",
      // submit a get request to the restful service zipSearch or locSearch.
      url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/zipSearch?zip=" + zip,
      // or
      // url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/locSearch?lat=" + lat + "&lng=" + lng,
      dataType: 'jsonp',
      jsonpCallback: 'searchResultsHandler'
    }).done(function(response) {
      var results = response.results;
      // builds beginning of collapsible list
      var popoutList = $("<ul class='collapsible popout' data-collapsible='accordion'>");
      popoutList.collapsible();

      for (var i = 0; i < results.length; i++) {
        id = results[i].id;
        name = results[i].marketname;

        var popoutHeader = "<div class='collapsible-header'><i class='material-icons'>favorite_border</i>" + name + "</div>";
        var popoutBody = "<div id='" + id + "' class='collapsible-body'><span>Lorem Ipsum</span></div>";
        var listItem = "<li>";

        // append each returned result as a list item to the DOM
        popoutList.append(listItem + popoutHeader + popoutBody);
        $("#ajaxResults").append(popoutList);
      } //end for loop for dynamic collapse elements

      ourFunctions.scrapeFoodsInSeason();

    }); //end ajax call
  },

  /*
    getSecondResults takes one parameter, makes a second call to the USDA api
    and pulls back the marketdetails associated with the ID that we pass into
    the parameter.  Using the marketdetails, this function will also dynamically
    create iframe elements where a call to the google maps embed API will show the
    location on a google map element
    @param argID: value returned from the getFirstResults function
  */
  getSecondResults: function(argID){
  $.ajax({
    type: "GET",
    contentType: "application/json; charset=utf-8",
    // submit a get request to the restful service mktDetail.
    url: "http://search.ams.usda.gov/farmersmarkets/v1/data.svc/mktDetail?id=" + argID,
    dataType: 'jsonp',
    jsonpCallback: 'detailResultHandler'
  }).done(function(detailresults){
    console.log(detailresults)
    for (var key in detailresults) {
        var address = detailresults.marketdetails.Address;
        var linky = detailresults.marketdetails.GoogleLink;
      }; //end for loop
    }); //end ajax call
  },

  scrapeFoodsInSeason: function() {
      // get state of most recent ZIP search, from ajax call to USDA
      var state;

      // search the external site by the state, return state's page
      //place scraping functions here

      // (use moment.js for current month)
      var currentMonth = moment().format('MMMM');
      console.log("Current Month: " + currentMonth);

      // search for list of foods depending on current month
      // use this link: http://www.eattheseasons.com/seasons.php
      // https://www.apifier.com/crawlers/DpP4r2ouwftwZT5Ym
      // https://api.apifier.com/v1/execs/XLwk7NFn7DAf84vgS/results


      // update DOM with list of foods in season
      // create an ID in the html for foods in season
      // change text to say "List of foods in season in [state] for the month of [currentMonth]"
      // give credit to site data source

    }, // end scrapeFoodsInSeason() function

    createComments: function(){
      var commentModal = ("<button class='waves-effect waves-light btn modal-trigger' data-target='modal1'>Leave a Comment!</button>")
      $(".collapsible-body").append(commentModal);
    }

  }//end function object

}) //end document ready
