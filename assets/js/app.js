var uluru;
var parks =[];
var state;
var stateCode; 

var initialLoad = true;

$(document).ready(function(){
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
  mainMapInit([["",$(this).data("value-geo")]], "map", 10, [$(this).data("value-geo")]);
  waqiMapInit();
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

  $("#parks-indicators").empty();


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
        parks.push([results[i].fullName, uluru]);
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
        var imgSrc = results[i]["images"][0]["url"];
        var imgCap = results[i]["images"][0]["altText"];
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
      // console.log(parkCode);
      var dpItem = $("<a>").addClass('dropdown-item').attr('id', '#'+i).data('value-geo',parks[i][1]);
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
  // var divToCreate = $('<div class="carousel-item"><img class="d-block w-100" src="'+imgSrc+'" alt="'+imgCap+'"><div class="carousel-caption d-none d-md-block"><h5>'+fullName+'</h5><p>'+description+'</p></div></div>');
  var newPath = "park.html?parkCode=" + parkCode;
  var divToCreate = $('<div class="card" style="width: 30rem;"><img class="card-img-top" src="'+imgSrc+'" alt="'+imgCap+'"><div class="card-body"><h5 class="card-title">'+fullName+'</h5><p class="card-text">'+description+'</p><a href="'+newPath+'" class="btn btn-primary park" value="'+parkCode+'">More Info</a></div></div>');

  $("#parks-items").append(divToCreate);

}

function getLatLngFromString(ll) {
  var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
  return JSON.parse("{"+newstr+"}"); 
}

function waqiMapInit(){

  var map = new google.maps.Map(document.getElementById('map2'),  {  
    center: new google.maps.LatLng( state),  
    mapTypeId: google.maps.MapTypeId.ROADMAP,  
    zoom: 6  
  });  
  
  var t = new Date().getTime();  
  var waqiMapOverlay = new google.maps.ImageMapType({  
      getTileUrl: function(coord,  zoom)  {  
      return 'https://tiles.waqi.info/tiles/usepa-aqi/'  +  zoom  +  "/"  +  coord.x  +  "/"  +  coord.y  +  ".png?token=_TOKEN_ID_"; },  name:  "Air  Quality" });  
  map.overlayMapTypes.insertAt(0,waqiMapOverlay);  
}

$(document).on("click", ".park", function() {
  console.log($(this).attr("value"));
});
