var fullName;
var parkCode;
var url;

$(document).ready(function(){
  onPageLoad();
});

function onPageLoad(){

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

// https://developer.nps.gov/api/v1/parks?parkCode=wrst&fields=images&api_key=dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr


// https://developer.nps.gov/api/v1/alerts?parkCode=wrst&api_key=dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr

  $.ajax({
    url: 'https://developer.nps.gov/api/v1/alerts',
    dataType: 'json',
    data: { 
      parkCode : urlParams.parkCode,  //enter variable from URL 
      fields: "images",
      api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'}
  }).done(function(alertResponse) {
    console.log("Finished alerts ajax call");

    var alertResults = alertResponse.data;
    console.log(alertResults);

    $("#alerts-div").empty();

    for (var i = 0; i < alertResults.length; i++) {

      if ((alertResults[i]["category"] === "Danger") || (alertResults[i]["category"] === "Caution") || (alertResults[i]["category"] === "Park Closure")) {
        var alertTitle = alertResults[i]["title"];
        var alertDescription = alertResults[i]["description"];
        console.log(alertTitle, alertDescription);

        var alertDiv = $('<li><strong style="color: red;">' + alertTitle + '</strong>: ' + alertDescription + '</li>');
        $("#alerts-div").append(alertDiv);
      }
      else {
        console.log("No important alerts atm.");
      }
    }

    if( $('#alerts-div').is(':empty') ) {
      console.log("div empty");
      $("#alerts-div").text("No alerts at this time.");
    }                     

  });

  $.ajax({
    url: 'https://developer.nps.gov/api/v1/parks',
    dataType: 'json',
    data: { 
      parkCode : urlParams.parkCode,  //enter variable from URL
      fields: "images",
      api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'}
  }).done(function(dataResponse) {
    console.log("Finished data ajax call");

    var dataResults = dataResponse.data;
    console.log(dataResults);
    
    var title = dataResults[0]["fullName"];
    var directions = dataResults[0]["directionsInfo"];
    var link = dataResults[0]["url"];
    var latLong = getLatLngFromString(dataResults[0]["latLong"]);
    var lat = JSON.stringify(latLong.lat);
    var long = JSON.stringify(latLong.lng);

    if (dataResults[0]["images"].length === 0) {
      imgSrc = "https://www.makeupgeek.com/content/wp-content/themes/makeup-geek/images/placeholder-square.svg";
    } else {
      var imageArrayLength = dataResults[0]["images"].length;
      var randImg = getRandomInt(0, imageArrayLength);
      var imgSrc = dataResults[0]["images"][parseInt(randImg)]["url"];
    }

    var weatherDiv = $('<iframe id="forecast_embed" type="text/html" frameborder="0" height="245" width="100%" src="https://forecast.io/embed/#lat='+(lat)+'&lon='+(long)+'&name='+title+'"></iframe>');

    var imgDiv = $('<img src="'+imgSrc+'" style="width: 100%;" />');

    $("#weather-div").append(weatherDiv);
    $("#park-title").html('<a href="'+link+'" target="_blank">' + title + '</a>');
    $("#directions-div").text(directions);
    $("#main-image").prepend(imgDiv);
  });
}

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

function getLatLngFromString(ll) {
  var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
  return JSON.parse("{"+newstr+"}"); 
}

