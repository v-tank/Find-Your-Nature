
$(document).ready(function(){
            $(function (){
                $.ajax({
                    url: 'https://developer.nps.gov/api/v1/parks', // url checked ...// error 400 not found url
                    data: { 
                      stateCode:'ca',
                        api_key:'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr'
                    },
                    dataType: 'json',
                    success: function(response)
                    {
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
var results = response.data;
var uluru;
var parks =[];
                                
//debugger;
        for (var i = 0; i < 10; i++) {
                console.log("name : "+i+""+ results[i].name) ;
               // console.log("weatherInfo "+results[i].latLong) ;

                if (results[i].latLong.length>0){
                            
                    var newMap = $("<div>").addClass('map').attr('id', 'id_'+i);
                    var contdiv= $("<div>").addClass('contdiv');
                            
                    $("<p>").text(results[i].fullName).appendTo(contdiv);
                    newMap.appendTo(contdiv);
                    contdiv.appendTo("body");
                    uluru = getLatLngFromString(results[i].latLong);
                            
                    parks.push([results[i].fullName, uluru]);
          initMap(uluru,newMap,8) ;
          
        }
        }

      for (var i = 0; i < parks.length; i++) {
                  
        var dpItem = $("<a>").addClass('dropdown-item').attr('id', '#'+i).data('geo-value',parks[i][1]);
        dpItem.text(parks[i][0]);
        dpItem.appendTo("#dm");

        //debugger;

     }

     foo(parks, "map", 8);

            function initMap(uluru, newMap, zooom) {

              console.log(uluru+"   "+newMap[0]);
           
                var map = new google.maps.Map(newMap[0]
        , {//document.getElementById('map')
                  zoom: zooom,
                  center: uluru
                });

                var marker = new google.maps.Marker({
                  position: uluru,
                  map: map
                });
              }

              function getLatLngFromString(ll) {
                    var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
                 
              //  return new google.maps.LatLng( JSON.parse("{"+newstr+"}")); 

              return JSON.parse("{"+newstr+"}"); 
          }
            $(document).on("click", ".dropdown-item", function() {

                console.log($(this).data("geo-value"))
                initMap($(this).data("geo-value"), $("#map2"), 8);
            //  console.log(this.attr("geo-value"))
            });
                                
              function foo(foo_parks, div){

  // debugger;

                    var map = new google.maps.Map(document.getElementById(div), {
                    zoom: 5,
                    center: new google.maps.LatLng( 37.82676234, -122.4230206),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

                    var infowindow = new google.maps.InfoWindow();

                    var marker, i;

                    for (i = 0; i < foo_parks.length; i++) {  

                    marker = new google.maps.Marker({
                    position: new google.maps.LatLng(foo_parks[i][1]),
                    map: map
         });
          }
              }
                    }
                });
            });

        });

