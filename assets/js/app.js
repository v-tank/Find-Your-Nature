var uluru;
var parks =[];
var state;
var stateCode; 

var _DONE = false;


$(document).ready(function(){
    if ( _DONE === true )
    {
        return;
    }
                 
    _DONE = true;
onPageLoad();

})

var statechangeclkcntr = 0;
$('#state').change(function(){ 

  $("#state").unbind('change');
  $("a.dropdown-item").remove();
  parks=[];
  stateCode = $(this).val();
  state =  $("#state option:selected").data('geo');
  statechangeclkcntr++;
  console.log("statechangeclkcntr"+statechangeclkcntr)
  onPageLoad();

});



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
          url: 'https://developer.nps.gov/api/v1/parks', // url checked ...// error 400 not found url
          data: { 
          stateCode : stateCode,
         limit: 20,
           api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'
          },
          dataType: 'json',
          success: function(response)
          {      

           waqiMapInit();

                  var results = response.data;
                  for (var i = 0; i < results.length; i++) {
                          if (results[i].latLong.length>0){
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
                 } else{
                mainMapInit(parks, "map", 3, [{lat: 39.5, lng: -98.35}]);
                }  


               function getLatLngFromString(ll) {
                      var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
                      return JSON.parse("{"+newstr+"}"); 
                }                          
          }
      });  

}



function waqiMapInit(){

      var map = new google.maps.Map(document.getElementById('map2'),  {  
                  center:  new  google.maps.LatLng( state),  
                  mapTypeId:  google.maps.MapTypeId.ROADMAP,  
                  zoom:  6  
              });  
  
      var t = new Date().getTime();  
      var  waqiMapOverlay = new  google.maps.ImageMapType({  
        getTileUrl:  function(coord,  zoom)  {  
          return  'https://tiles.waqi.info/tiles/usepa-aqi/'  +  zoom  +  "/"  +  coord.x  +  "/"  +  coord.y  +  ".png?token=_TOKEN_ID_";  
        },  
      name:  "Air  Quality",  
      });  
  
      map.overlayMapTypes.insertAt(0,waqiMapOverlay);  
    }