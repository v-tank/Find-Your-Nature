var designation;
var directionsInfo;
var directionsUrl;
var fullName;
var id;
var latLong;
var name;
var parkCode;
var states;
var url;
var weatherInfo;

var uluru;
var parks =[];
var state;
var stateCode; 
var doneBool = true;

$(document).ready(function(){
  // h3 animation
  setTimeout(function(){$("#in-out").attr("class", "animated lightSpeedOut");}, 2000);


  if (doneBool) {
    console.log("Ready");
    onPageLoad();
    doneBool = false;
  }
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
  mainMapInit([["",$(this).data("geo-value")]], "map", 10, [$(this).data("geo-value")]);
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
    map: map});
  }
} 



function onPageLoad(){
  $.ajax({
    url: 'https://developer.nps.gov/api/v1/parks',
    dataType: 'json',
    data: { stateCode : stateCode, api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr' }
  }).done(function(response) {
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
    }

    for (var i = 0; i < parks.length; i++) {
      var dpItem = $("<a>").addClass('dropdown-item').attr('id', '#'+i).data('geo-value',parks[i][1]);
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

function getLatLngFromString(ll) {
  var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
  return JSON.parse("{"+newstr+"}"); 
}

function waqiMapInit(){
  var  map  =  new  google.maps.Map(document.getElementById('map2'),  {  
    center:  new  google.maps.LatLng( state),  
    mapTypeId:  google.maps.MapTypeId.ROADMAP,  
    zoom:  6  
  });  
  
  var  t  =  new  Date().getTime();  
  var  waqiMapOverlay  =  new  google.maps.ImageMapType({  
      getTileUrl:  function(coord,  zoom)  {  
      return  'https://tiles.waqi.info/tiles/usepa-aqi/'  +  zoom  +  "/"  +  coord.x  +  "/"  +  coord.y  +  ".png?token=_TOKEN_ID_"; },  name:  "Air  Quality",  
  });  
  map.overlayMapTypes.insertAt(0,waqiMapOverlay);  
}
