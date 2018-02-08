// Define global variables
var fullName;
var parkCode;
var url;

// Function to fire off once the page is done loading
$(document).ready(function(){
  onPageLoad();
});

// Main function to create the entire page
function onPageLoad(){

// Grabs the URL and parses to get the parkCode
  var urlParams;
  (window.onpopstate = function () {

   var match,
       pl = /\+/g,  // Regex for replacing addition symbol with a space
       search = /([^&=]+)=?([^&]*)/g,
       decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
       query = window.location.search.substring(1);

   urlParams = {};
   while (match = search.exec(query))
      urlParams[decode(match[1])] = decode(match[2]);
  })();


// AJAX call for alerts info using query string parameters and preselected "parkCode" (park name)
  $.ajax({
    url: 'https://developer.nps.gov/api/v1/alerts',
    dataType: 'json',
    data: { 
      parkCode : urlParams.parkCode,  // parkCode variable grabbed from URL 
      fields: "images",
      api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'
    }
  }).done(function(alertResponse) {

    // Save the response into a variable
    var alertResults = alertResponse.data;

    // Empties the existing div on the HTML page
    $("#alerts-div").empty();

    // Parse through the JSON response and only display alerts of the 'danger', 'caution', or 'park closure' categories.
    for (var i = 0; i < alertResults.length; i++) {
      if ((alertResults[i]["category"] === "Danger") || (alertResults[i]["category"] === "Caution") || (alertResults[i]["category"] === "Park Closure")) {
        
        // Save info into variables 
        var alertTitle = alertResults[i]["title"];
        var alertDescription = alertResults[i]["description"];

        // Creates a list item for each alert 
        var alertDiv = $('<li><strong style="color: red;">' + alertTitle + '</strong>: ' + alertDescription + '</li>');

        // Appends the list item to the alerts div on the HTML page
        $("#alerts-div").append(alertDiv);
      }
    }

    // If no divs are detected after going through the loop, add the following text instead.
    if( $('#alerts-div').is(':empty') ) {
      $("#alerts-div").text("No alerts at this time.");
    }                     
  });

// AJAX call for park info using query string parameters and parkCode grab from the URL
  $.ajax({
    url: 'https://developer.nps.gov/api/v1/parks',
    dataType: 'json',
    data: { 
      parkCode : urlParams.parkCode,  //enter variable from URL
      fields: "images",
      api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'
    }
  }).done(function(dataResponse) {
    // Save the response into a variable to parse through
    var dataResults = dataResponse.data;

    // Parses through the JSON response and saves needed info into variables
    var title = dataResults[0]["fullName"];
    var directions = dataResults[0]["directionsInfo"];
    var link = dataResults[0]["url"];
    var latLong = getLatLngFromString(dataResults[0]["latLong"]);
    var lat = JSON.stringify(latLong.lat);
    var long = JSON.stringify(latLong.lng);

    // If API doesn't send back any images, display a placeholder image
    if (dataResults[0]["images"].length === 0) {
      imgSrc = "assets/images/notfound.jpg";
    } else {
      // Else, grab the image from the returned array
      var imageArrayLength = dataResults[0]["images"].length;
      var randImg = getRandomInt(0, imageArrayLength);
      var imgSrc = dataResults[0]["images"][parseInt(randImg)]["url"];
    }

    // Div to dynamically display weather data from Dark Sky (uses lat and long)
    var weatherDiv = $('<iframe id="forecast_embed" type="text/html" frameborder="0" height="245" width="100%" src="https://forecast.io/embed/#lat='+(lat)+'&lon='+(long)+'&name='+title+'"></iframe>');
    var imgDiv = $('<img src="'+imgSrc+'" style="width: 100%;" />');

    // Appends gathered info to the main page
    $("#weather-div").append(weatherDiv);
    $("#park-title").html('<a href="'+link+'" target="_blank">' + title + '</a>');
    $("#directions-div").text(directions);
    $("#main-image").prepend(imgDiv);
  });
}

// Used to get random images to post on park info page to prevent user boredom. Generates a random index in the range 0 to the max length of the images array that is returned from the API (varies)
function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

// Funcion to grab the latitutde and longitude from a string to plug into weather API
function getLatLngFromString(ll) {
  var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
  return JSON.parse("{"+newstr+"}"); 
}