// Initiates Firebase
var config = {
  apiKey: "AIzaSyC9lq8l9sXlpUwQrGAWUda2qw_-faJUbiA",
  authDomain: "commentform-807d4.firebaseapp.com",
  databaseURL: "https://commentform-807d4.firebaseio.com",
  projectId: "commentform-807d4",
  storageBucket: "",
  messagingSenderId: "184726345923"
  };
firebase.initializeApp(config);

var database = firebase.database();

// Define global variables
var uluru;
var parks = [];
var state;
var stateCode; 
var num;

var initialLoad = true;

// Function to fire off once the page is done loading
$(document).ready(function(){
  // Timer to fire off h3 animation after a second
  setTimeout(function(){$("#in-out").attr("class", "animated tada");}, 1000);

  // Hides 'park' dropdown at the beginning
  $("#dropdownMenuButton").addClass('hiddenAtStart');

  // Calls the main function
  onPageLoad();
});

// On-click function for the state dropdown menu
$('#state').on("change", function(event){ 
  event.preventDefault();

  // Shows 'park' button after state is selected
  $("#dropdownMenuButton").removeClass('hiddenAtStart');
  
  $("a.dropdown-item").remove();

  // Empties parks array
  parks = [];

  // Grabs the stateCode attribute upon click
  stateCode = $(this).val();

  // Grabs the state name from the dropdown menu
  state =  $("#state option:selected").data('geo');
  onPageLoad();
});

// On-click function for state dropdown items
$(document).on("click", ".dropdown-item", function() {
  // Grabs the geo data
  var parkGeo = $(this).data("value-geo");

  // Calls function to display the map with the default zoom level and center location with the markers
  mainMapInit([["", parkGeo]], "map", 10, [parkGeo]);
  $(".card").show();
  $(".card").not("#card_"+$(this).data("value-parkCode")).hide();

  // Calls function to show air quality map
  waqiMapInit([parkGeo]);

});

// Function to create the maps with markers for parks in each state, the default zoom level, and the center point
function mainMapInit(parks, div, zooom, center){
  var centerLatLng;
  centerLatLng = new google.maps.LatLng(center[0]);
  var map = new google.maps.Map(document.getElementById(div), {
  zoom: zooom,
  center: centerLatLng,
  mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  var infowindow = new google.maps.InfoWindow();
  var marker, i;

  // Puts a marker in the position of each park in the 'parks' array
  for (i = 0; i < parks.length; i++) {  
    marker = new google.maps.Marker({
    position: new google.maps.LatLng(parks[i][1]),
    map: map, title: parks[i][0]});
  }

  // Method to pan the map upon change of center location
  map.addListener('center_changed', function() {
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });

  // Method to change zoom level
  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
} 

// Main function that does the leg-work
function onPageLoad(){
  // AJAX calls to grab park info
  $.ajax({
    url: 'https://developer.nps.gov/api/v1/parks',
    dataType: 'json',
    data: { 
      stateCode : stateCode, 
      fields: "images",
      api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'}
  }).done(function(response) {

    // Empties out the existing cards on the screen
    $("#parks-items").empty();
    // console.log("Finished ajax call");

    // Re-creates the air quality map for the parks
    waqiMapInit();

    var results = response.data;
    // console.log(results);

    // Loop to go through the entire response and grab useful info for each park
    for (var i = 0; i < results.length; i++) {
      // console.log("name : "+i+""+ results[i].name) ;
      if (results[i].latLong.length > 0) {
        uluru = getLatLngFromString(results[i].latLong);               
        parks.push([results[i].fullName, uluru, results[i]["parkCode"]]);
      }

      var fullName = results[i]["fullName"];
      var description = results[i]["description"];
      var url = results[i]["url"];
      var parkCode = results[i]["parkCode"];

      // Error handler if no image is returned; will display a 'notfound' image
      if (results[i]["images"].length === 0) {
        // console.log("image and caption not available :( ");
        imgCap = "Error";
        imgSrc = "assets/images/notfound.jpg";
      } else {
        // otherwise, save the image url and caption into variables
        var imageArrayLength = results[i]["images"].length;

        // Calls function to randomly generate an integer in the length of the images array to display different ones instead of the same image every time
        var randImg = getRandomInt(0, imageArrayLength);
        var imgSrc = results[i]["images"][parseInt(randImg)]["url"];
        var imgCap = results[i]["images"][parseInt(randImg)]["altText"];
      }

      // Doesn't create cards the first time when the page loads. Else calls the function to create them by passing required info
      if (initialLoad === false) {
        createCards(fullName, description, imgSrc, imgCap, url, parkCode);
      }

      // When we reach the end of the first loop, change the bool to false to create cards the next time around
      if ((i+1) === results.length) {
        initialLoad = false;
      }
    }

    // Dynamically creates the park dropdown menu based on the selected state
    for (var i = 0; i < parks.length; i++) {
      var dpItem = $("<a>").addClass('dropdown-item').attr('id', '#'+i).data('value-geo',parks[i][1]).data('value-parkCode', parks[i][2]);
      //debugger;
      dpItem.text(parks[i][0]);
      dpItem.appendTo("#dm");
    }

    if (state)  {
      mainMapInit(parks, "map", 6, [state]);
    } else {
      mainMapInit(parks, "map", 3, [{lat: 39.5, lng: -98.35}]);
    }                            
  });
}

// Function to create cards 
function createCards(fullName, description, imgSrc, imgCap, url, parkCode) {

  // Calls firebase to check for number of reviews for each park and to calculate the average rating
  database.ref('/' + parkCode).once('value', function(snapshot) {
    
    var num = snapshot.numChildren();

    // Initialize the sum variable to 0
    var ratingSum = 0;

    // Hack to only display rating once
    var i = 0;

    // Goes through each object in the parkCodes to grab the ratings
    database.ref('/' + parkCode).on("child_added", function(snapshot, prevChildKey){
      var rate = snapshot.val();

      // Go through if rating exists for the given park
      if (rate.rating) {
        // Add the rating value to the running sum
        ratingSum += parseInt(rate.rating);

        // Calculate the average and round down
        var aveRating = Math.floor(ratingSum / num);
        
        // Only displays the average rating when the last rating has been reached (else it displays this info (num-1) times)
        if (i === (num - 1)) {
          divToCreate.append("Average Rating: " + aveRating + "/5; Total Reviews: " + num);
        }
      } 
      // increment the counter for the hack
      i++;
    });
  });

  // creates a URL for the park.html page; this is REALLY important because the URL can then be shared with friends
  var newPath = "park.html?parkCode=" + parkCode;

  // creates a card with the required info
  var divToCreate = $('<div class="card" style="width: 30rem;"><img class="card-img-top" src="'+imgSrc+'" alt="'+imgCap+'"><div class="card-body"><h5 class="card-title">'+fullName+'</h5><p class="card-text">'+description+'</p><a href="'+newPath+'" class="btn btn-primary park" value="'+parkCode+'">More Info</a></div></div>');

  // Attaches a unique ID for each card using the parkCode
  divToCreate.attr('id', "card_"+parkCode);

  // Append the card to the empty div on the page
  $("#parks-items").append(divToCreate);
}

// Funcion to grab the latitutde and longitude from a string
function getLatLngFromString(ll) {
  var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
  return JSON.parse("{"+newstr+"}"); 
}

// Function to generate and center the air quality map
function waqiMapInit(center){

  var centerwaqi;
  var zoomwaqi;

  if (center){
    centerwaqi= new google.maps.LatLng(center[0]);
    zoomwaqi = 10;
  } else if (state) {
    centerwaqi= new google.maps.LatLng(state);
    zoomwaqi = 6;
  } else {
    centerwaqi = new google.maps.LatLng(39.5,-98.35);
    zoomwaqi = 3;
  }

  var map = new google.maps.Map(document.getElementById('map2'),  { 
    center: centerwaqi, 
    mapTypeId: google.maps.MapTypeId.ROADMAP,  
    zoom: zoomwaqi  
  });  
  
  var t = new Date().getTime();  
  var waqiMapOverlay = new google.maps.ImageMapType({  
      getTileUrl: function(coord,  zoom)  {  
      return 'https://tiles.waqi.info/tiles/usepa-aqi/'  +  zoom  +  "/"  +  coord.x  +  "/"  +  coord.y  +  ".png?token=_TOKEN_ID_"; },  name:  "Air  Quality" });  
  map.overlayMapTypes.insertAt(0,waqiMapOverlay);  
}

// Function to generate a random int in a given range (max exclusive)
function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}
