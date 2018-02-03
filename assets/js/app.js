// $(document).ready(function() {
//     $(function() {
//         $.ajax({
//             url: 'https://developer.nps.gov/api/v1/parks', // url checked ...// error 400 not found url
//             data: {
//                 stateCode: '',
//                 api_key: 'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr',
//             },
//             dataType: 'json',
//             success: function(response) {



//                 var designation;
//                 var directionsInfo;
//                 var directionsUrl;
//                 var fullName;
//                 var id;
//                 var latLong;
//                 var name;
//                 var parkCode;
//                 var states;
//                 var url;
//                 var weatherInfo;


//                 var results = response.data;
//                 var uluru;
//                 var parks = [];
//                 //debugger;
//                 for (var i = 0; i < 50; i++) {
//                     console.log("name : " + i + "" + results[i].name);
//                     // console.log("weatherInfo "+results[i].latLong) ;

//                     if (results[i].latLong.length > 0) {



//                         var newMap = $("<div>").addClass('map').attr('id', 'id_' + i);
//                         var contdiv = $("<div>").addClass('contdiv');
//                         $("<p>").text(results[i].fullName).appendTo(contdiv);
//                         newMap.appendTo(contdiv);
//                         contdiv.appendTo("body");
//                         uluru = getLatLngFromString(results[i].latLong);


//                         parks.push([results[i].fullName, uluru]);


//                         initMap(uluru, newMap, 8);

//                     }

//                 }

//                 for (var i = 0; i < parks.length; i++) {


//                     var dpItem = $("<a>").addClass('dropdown-item').attr('id', '#' + i).data('geo-value', parks[i][1]);
//                     dpItem.text(parks[i][0]);
//                     dpItem.appendTo("#dm");

//                     //debugger;

//                 }

//                 foo(parks, "map", 8);





//                 function initMap(uluru, newMap, zooom) {




//                     console.log(uluru + "   " + newMap[0]);

//                     var map = new google.maps.Map(newMap[0], { //document.getElementById('map')
//                         zoom: zooom,
//                         center: uluru
//                     });

//                     var marker = new google.maps.Marker({
//                         position: uluru,
//                         map: map
//                     });
//                 }

//                 function getLatLngFromString(ll) {
//                     var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');

//                     //  return new google.maps.LatLng( JSON.parse("{"+newstr+"}")); 

//                     return JSON.parse("{" + newstr + "}");


//                 }





//                 // $(document).on("click", ".dropdown-item", function() {

//                 //     console.log($(this).data("geo-value"))
//                 //     initMap($(this).data("geo-value"), $("#map2"), 8);
//                 // //  console.log(this.attr("geo-value"))
//                 // });





//                 function foo(foo_parks, div) {

//                     // debugger;

//                     var map = new google.maps.Map(document.getElementById(div), {
//                         zoom: 4,
//                         center: new google.maps.LatLng(37.7877008, -96.5976181),
//                         mapTypeId: google.maps.MapTypeId.ROADMAP
//                     });

//                     var infowindow = new google.maps.InfoWindow();

//                     var marker, i;

//                     for (i = 0; i < foo_parks.length; i++) {

//                         marker = new google.maps.Marker({
//                             position: new google.maps.LatLng(foo_parks[i][1]),
//                             map: map
//                         });
//                     }









//                 }










//             }
//         });
//     });
// });



$(document).ready(function() {
    $(function() {
        $.ajax({
            url: 'https://developer.nps.gov/api/v1/parks', // url checked ...// error 400 not found url
            data: {
                stateCode: 'ca',
                api_key: 'dR9liF6s3ztufwHduTKv4mfNqrtq3iGWp8dxjzcr',
            },
            dataType: 'json',
            success: function(response) {

      var info = response.data;
      var locations = [];


                var designation;
                var directionsInfo;
                var directionsUrl;
                var fullName;
                var id;
                var latLong;
                var name;
                var parkCode;
                var url;
                var weatherInfo;
                var stateCode;



                var results = response.data;
                var uluru;
                var parks = [];


                //debugger;
                for (var i = 0; i < results.length; i++) {
                    parks.push(results[i].fullName + ", " + results[i].latLong);
                    // console.log("state" + "name : " + i + "" + results[i].states + "" + results[i].name);
                    // console.log("weatherInfo "+results[i].latLong) ;

                    if (results[i].latLong.length > 0) {



                        var newMap = $("<div>").addClass('map').attr('id', 'id_' + i);
                        // var contdiv = $("<div>").addClass('contdiv');
                        // $("<p>").text(results[i].fullName).appendTo(contdiv);
                        // newMap.appendTo(contdiv);
                        // contdiv.appendTo("body");
                        uluru = getLatLngFromString(results[i].latLong);


                        parks.push([results[i].fullName, uluru]);


                        initMap(uluru, newMap, 8);

                    }

                }

                // for (var i = 0; i < parks.length; i++) {


                //     // var dpItem = $("<a>").addClass('dropdown-item').attr('id', '#' + i).data('geo-value', parks[i]);
                //     // dpItem.text(parks[i][0]);
                //     // dpItem.appendTo("#dm");

                //     //debugger;

                // }

                foo(parks, "map", 8);





                function initMap(uluru, newMap, zooom) {




                    console.log(uluru + "   " + newMap[0]);

                    var map = new google.maps.Map(newMap[0], { //document.getElementById('map')
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

                    return JSON.parse("{" + newstr + "}");


                }





                // $(document).on("click", ".dropdown-item", function() {

                //     console.log($(this).data("geo-value"))
                //     initMap($(this).data("geo-value"), $("#map2"), 8);
                // //  console.log(this.attr("geo-value"))
                // });





                function foo(foo_parks, div) {

                    // debugger;

                    var map = new google.maps.Map(document.getElementById(div), {
                        zoom: 4,
                        center: new google.maps.LatLng(37.7877008, -96.5976181),
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    });

                    var infowindow = new google.maps.InfoWindow();


                // Marker
                    var marker, i;

                    for (i = 0; i < foo_parks.length; i++) {

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(foo_parks[i][1]),
                            map: map
                        });


                         google.maps.event.addListener(marker, 'click', (function(marker, i) {
                    return function() {
                      infowindow.setContent(results[i].fullName);
                  infowindow.open(map, marker);
                }
            })(marker, i));
    }
                    }









                }










            
        });
    });
});



// searchParks();

// var locations = [];

// // To convert string form ajax call *not working with rest of the code below yet*
// function getLatLngFromString(ll) {
//     var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
//     return JSON.parse("{"+newstr+"}"); 
// }

// function searchParks(){
//     var sort = "stateCode";
//     var state = "";

//     var queryURL = "https://developer.nps.gov/api/v1/parks?" + sort + "=" + state + "&limit=10&api_key=GBHhnwmSBtLdqJDVTJybr1o7yuCxc0Vz9rAcgrQy";

//     $.ajax({
//       url: queryURL,
//       method: 'GET'
//     }).done(function(response) {
//       var info = response.data;


//       // console.log(info);
//       // console.log(info[1].name);

//       for (var i = 0; i < info.length; i++) {
//         locations.push(info[i].latLong);
//       //   var parksDiv = $("<div class='MAKEMEBOLD!'>" + info[i].name + "</div>");
//       //   $("#parks").append(parksDiv);
//       };
//       initMap();

//       console.log(locations);
//     });
// }

// function initMap() {
//     //Map options
//     // var options = {
//     //     zoom: 8
//     // }
//     //New map
//     var map = new google.maps.Map(document.getElementById("map"));

//     //Add marker
//     for (i = 0; i < locations.length; i++) { 
//       var marker = new google.maps.Marker({
//       position: new google.maps.LatLng(locations[i], locations[i+1]),
//       map: map
//       });      
//     }
// }