$(document).ready(function() {


        // jQuery functions so certain classes work on dynamic created elements
        $('.collapsible').collapsible();
        $('.scrollspy').scrollSpy();
        $(".button-collapse").sideNav();
        $("#modal1").modal();

        // update star ratings inside comment modal
        $("#starRatings > i").on("click", function(){
          
          $("#starRatings > i").html("<i class='material-icons'/>star_border</i>");

          $(this).html("<i class='material-icons'/>star</i>");
          
          var rating = $(this).attr("data-value");
          console.log(rating);

          // data-values less than "this", also changed to star
          for (i = rating ; i > 0 ; i--) {
            if (rating < $("#star" + i).attr("data-value")){
              console.log("it is less");
              $("#star" + i).html("<i class='material-icons'/>star_border</i>");
            } else {
              $("#star" + i).html("<i class='material-icons'/>star</i>");
              console.log("it is more");
            }
          } 

        });

        $(document).on("click", "#submit", function(event) {
            event.preventDefault();

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
        var marketId = $(this).attr("id");
        ourFunctions.getSecondResults(marketId);

      })//end accordion click event


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

        var popoutHeader = "<div id='" + id + "' class='collapsible-header'><i class='material-icons'>favorite_border</i>" + name + "</div>";
        var popoutBody = "<div class='collapsible-body'><span>Lorem Ipsum</span></div>";
        var listItem = "<li>";

        // append each returned result as a list item to the DOM
        popoutList.append(listItem + popoutHeader + popoutBody);
        $("#ajaxResults").append(popoutList);
      } //end for loop for dynamic collapse elements

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
    var commentModal = ("<button class='waves-effect waves-light btn modal-trigger' data-target='modal1'>Leave a Comment!</button>")

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
      /*variables to hold results of second usda API call.  Results printed to HTML in onclick event
        starting on line 23*/
        var address = detailresults.marketdetails.Address;
        var linky = detailresults.marketdetails.GoogleLink;
        var schedule = detailresults.marketdetails.Schedule;
        var products = detailresults.marketdetails.Products;
        $(".collapsible-body").html("<a target='_blank' href= " + linky + ">Google Link</a>"
                                  + "<p>" + address + "</p>"
                                  + "<p>" + schedule + "</p>"
                                  + "<p>" + products + "</p>"
                                  + "<p>" + commentModal + "</p>");

      }; //end for loop
    }); //end ajax call
  },

  //on load: display foods in season based on current month in the DOM
  foodsInSeason: function () {
      // (moment.js for current month)
      var currentMonth = moment().month();
      var currentMonthText = moment().format('MMMM');
      console.log("Current Month: " + currentMonth);
      $("#current-month").text("Foods in season for the month of " + currentMonthText);

      // JSON data obtained via web crawler Apifier API:
      // https://www.apifier.com/crawlers/DpP4r2ouwftwZT5Ym
      var foodsDataURL = "https://api.apifier.com/v1/execs/vm5CwJ6Rr6ePdugwK/results";

      $.ajax({
        type: "GET",
        contentType: "application/json",
        url: foodsDataURL
      })
      .done(function(response){
        var foodString = response[currentMonth].pageFunctionResult.foods;

        // remove all /n from foodString array
        foodString = foodString.replace(/(\r\n|\n|\r)/gm,',').trim();
        var foodArray = foodString.split(',');

        // remove blank items in foodString array
        for(var i = foodArray.length-1; i >= 0; i--){
            if(foodArray[i] === ''){
                foodArray.splice(i,1);
            }
        }
        console.log(foodArray);

        $("#foodTable > tbody").append("<tr><td>" + foodArray[0] + "</td></tr>");

        for (i = -1 ; i < (foodArray.length - 3) ; i+=2){
          $("#foodTable > tbody").append("<tr><td>" + foodArray[i + 2] + "</td><td>"
          + foodArray[i+3] + "</td></tr>");
        }
      });
  }, // end foodsInSeason() function


  }//end function object

  ourFunctions.foodsInSeason(); // show foods in season on document load

}) //end document ready
