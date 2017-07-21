//empty array for search results
var mapResults = [];

$(document).ready(function() {

        // jQuery functions so certain classes work on dynamic created elements
        $('.collapsible').collapsible();
        $('.scrollspy').scrollSpy();
        $(".button-collapse").sideNav();

        //beginning of google maps embed api url
        var url = "https://www.google.com/maps/embed/v1/search"

        $("#submit").on("click", function(event) {
            event.preventDefault();

            //retrieve input from user
            var zipCode = $("#zipSearch").val().trim();

            //call initMap function, passing the zipCode variable as an argument
            var map = initMap(zipCode);

            //push value of map variable to our mapResults array
            mapResults.push(map);

            //call renderResults function, passing the map variable as an argument
            renderResults(map);
            getFirstResults(zipCode);

        }); //end submit on click event

        /*
          renderResults function takes one parameter, loop through the mapResults array and
          dynamically create iframe elements to load to our page
          @param source: source is the value returned from initMap function
        */

        function renderResults(source) {
            // $("#mapResults-go-here").empty();

            for (var i = 0; i < mapResults.length; i++) {

                var iframes = $("<iframe>", {
                    src: source,
                    frameborder: "0",
                    zoom: "10",
                    width: "100%",
                    height: "100%"
                }).appendTo("#results-go-here");
            };
        };
        /*
          initMap function takes one parameter and concatenates that parameter with the global
          url variable, google maps embed API key, and other pertinent q (query) information
          @param zip: zip will be the value returned from the user input form
        */
        function initMap(address) {
            url += "?" + $.param({
                "key": "AIzaSyC-esHVNQ4muZerDSPt3ChxUd8-agTMc_c",
                "q": "Farmers+Markets+near" + address
            });
            return url;
        };


        // function getResults(zip) {
        //     $("#ajaxResults").empty(); // clear 

        /*
          getFirstResults function accepts one parameter and makes an ajax call using the USDA API to pull back
          the ID of each farmers market within a certain radius of the given zip code.  This function will also dynamically
          create collapsible elements on the page and place divs within those elements, that will later be populated
          on the call of the getSecondResults function.

          @param zip: the value of the zip code entered by the user on the search page
        */

        function getFirstResults(zip) {
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

                    var starRatings = "<div><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div>"

                    var popoutBody = "<div id='" + id + "' class='collapsible-body'><span>Lorem Ipsum</span></div>";

                    var listItem = "<li>";

                    // append each returned result as a list item to the DOM
                    popoutList.append(listItem + popoutHeader + popoutBody + starRatings);
                    $("#ajaxResults").append(popoutList);
                } //end for loop for dynamic collapse elements

            }); //end ajax call

        }; //end getResults function

        /*
          getSecondResults takes one parameter, makes a second call to the USDA api
          and pulls back the marketdetails associated with the ID that we pass into
          the parameter.  Using the marketdetails, this function will also dynamically
          create iframe elements where a call to the google maps embed API will show the
          location on a google map element

          @param argID: value returned from the getFirstResults function
        */

        // getSecondResults($(this).("id"));


        function getSecondResults(argID){
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
        }; //end getSecondResults function

        //on load: display foods in season based on current month in the DOM
        function foodsInSeason() {
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
              
              // remove all /n from foodString, then remove blank items
              foodString = foodString.replace(/(\r\n|\n|\r)/gm,',').trim();
              var foodArray = foodString.split(',');

              // remove blank items in array
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

        }; // end foodsInSeason() function

      foodsInSeason(); // run function on load


}); //end document ready
