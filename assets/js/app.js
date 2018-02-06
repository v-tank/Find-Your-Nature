var uluru;
var parks =[];
var state;
var stateCode; 

var initialLoad = true;

$(document).ready(function(){
  // h3 animation
  setTimeout(function(){$("#in-out").attr("class", "animated tada");}, 1000);

  onPageLoad();
});

$('#state').on("change", function(event){ 
  event.preventDefault();

  $("a.dropdown-item").remove();
  parks=[];
  stateCode = $(this).val();
  state =  $("#state option:selected").data('geo');
  onPageLoad();
});

function getStateLatLng (location){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': location }, function(results, status) {
  if (status == google.maps.GeocoderStatus.OK) {
    var templatlng = results[0].geometry.location;
    var templatlngObj = {lat: templatlng.lat(), lng: templatlng.lng()};
    return JSON.parse(templatlngObj)
  } else {
      alert("Could not find location: " + location);
    }
  });
}

$(document).on("click", ".dropdown-item", function() {

  var parkGeo = $(this).data("value-geo");
  mainMapInit([["",parkGeo]], "map", 10, [parkGeo]);
 $( ".card" ).show();
 $( ".card" ).not( "#card_"+$(this).data("value-parkCode")).hide();
  waqiMapInit([parkGeo]);
});

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

  for (i = 0; i < parks.length; i++) {  

    marker = new google.maps.Marker({
    position: new google.maps.LatLng(parks[i][1]),
    map: map, title: parks[i][0]});

  }

  map.addListener('center_changed', function() {
    window.setTimeout(function() {
      map.panTo(marker.getPosition());
    }, 3000);
  });

  marker.addListener('click', function() {
    map.setZoom(8);
    map.setCenter(marker.getPosition());
  });
} 

function onPageLoad(){

  $.ajax({
    url: 'https://developer.nps.gov/api/v1/parks',
    dataType: 'json',
    data: { 
      stateCode : stateCode, 
      fields: "images",
      api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'}
  }).done(function(response) {
    $("#parks-items").empty();
    console.log("Finished ajax call");

    waqiMapInit();

    var results = response.data;
    console.log(results);

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

      if (results[i]["images"].length === 0) {
        console.log("image and caption not available :( ");
        imgCap = "Error";
        imgSrc = "https://www.makeupgeek.com/content/wp-content/themes/makeup-geek/images/placeholder-square.svg";
      } else {
        var imageArrayLength = results[i]["images"].length;
        var randImg = getRandomInt(0, imageArrayLength);
        var imgSrc = results[i]["images"][parseInt(randImg)]["url"];
        var imgCap = results[i]["images"][parseInt(randImg)]["altText"];
      }

      // doesn't create the first time when the page loads
      if (initialLoad === false) {
        createCards(fullName, description, imgSrc, imgCap, url, parkCode);
      }

      // When we reach the end of the first loop, change the bool to false to create cards the next time around
      if ((i+1) === results.length) {
        initialLoad = false;
      }
    }

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

function createCards(fullName, description, imgSrc, imgCap, url, parkCode) {
  
  var newPath = "park.html?parkCode=" + parkCode;
  var divToCreate = $('<div class="card" style="width: 30rem;"><img class="card-img-top" src="'+imgSrc+'" alt="'+imgCap+'"><div class="card-body"><h5 class="card-title">'+fullName+'</h5><p class="card-text">'+description+'</p><a href="'+newPath+'" class="btn btn-primary park" value="'+parkCode+'">More Info</a></div></div>');
  divToCreate.attr('id', "card_"+parkCode);
  $("#parks-items").append(divToCreate);

}

function getLatLngFromString(ll) {
  var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
  return JSON.parse("{"+newstr+"}"); 
}

function waqiMapInit(center){

  var centerwaqi;
  var zoomwaqi;

  if (center){
    centerwaqi= new google.maps.LatLng(center[0]);
    zoomwaqi= 10;
  }
  else if (state) {
   centerwaqi= new google.maps.LatLng(state);
   zoomwaqi= 6;

  } else {

  centerwaqi = new google.maps.LatLng(39.5,-98.35);
  zoomwaqi= 3;

  }
   console.log("center "+center);
  console.log("centerwaqi" +centerwaqi);

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

function getRandomInt(min, max) {
  return Math.random() * (max - min) + min;
}

$(document).on("click", ".park", function() {
  // console.log($(this).attr("value"));
});
