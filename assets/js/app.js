$(document).ready(function() {
    var sort = "stateCode";
    var state = "";

    var queryURL = "https://developer.nps.gov/api/v1/parks?" + sort + "=" + state + "&limit=49&api_key=GBHhnwmSBtLdqJDVTJybr1o7yuCxc0Vz9rAcgrQy";
        
        $.ajax({
            url: queryURL,
            method: "GET" 
            }).done(function(response){

                var fullName;
                var id;
                var latLong;
                var name;
                var parkCode;
                var url;
                var results = response.data;
                var location;
                var parks = [];

                // console.log(results.length);
                // debugger;
                for (var i = 0; i < results.length; i++) {
                    parks.push(results[i].fullName + ", " + results[i].latLong);
                    // console.log("state" + "name : " + i + "" + results[i].states + "" + results[i].name);
                    // console.log("weatherInfo "+results[i].latLong) ;
                    if (results[i].latLong.length > 0) {
                        var newMap = $("<div>").addClass('map').attr('id', 'id_' + i);
                        var contdiv = $("<div>").addClass('contdiv');
                        // $("<p>").text(results[i].fullName).appendTo(contdiv);
                        // newMap.appendTo(contdiv);
                        // contdiv.appendTo("body");
                        location = getLatLngFromString(results[i].latLong);
                        // console.log(location);
                        if(results[i].fullName.length === 0){
                            parks.push([results[i].name, location]);
                        }
                        else if (results[i].fullName.length !== 0){
                            parks.push([results[i].fullName, location]);
                        }
                        else{
                            parks.push(["no name", location]);
                        }
                        // console.log(parks);
                        initMap(location, newMap, 8);
                    }
                }

                mapLabeler(parks, "map", 8);

                // Creates the map
                function initMap(location, newMap, zooom) {
                    // console.log(location + "   " + newMap[0]);
                    var map = new google.maps.Map(newMap[0], { //document.getElementById('map')
                        zoom: zooom,
                        center: location
                    });
                    var marker = new google.maps.Marker({
                        position: location,
                        map: map
                    });
                }
                // Converts JSON object into value googlemaps accepts
                function getLatLngFromString(ll) {
                    var newstr = ll.replace(/lat/, '"lat"').replace(/long/i, '"lng"');
                    return JSON.parse("{" + newstr + "}");
                }
                // Displays name of pin when clicked
                $(document).on("click", ".dropdown-item", function() {

                    console.log($(this).data("geo-value"))
                    initMap($(this).data("geo-value"), $("#map2"), 8);
                //  console.log(this.attr("geo-value"))
                });
                // Centers initial map and pulls marker names
                function mapLabeler(foo_parks, div) {
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
                                console.log(results[1].name);
                                // debugger;
                                if(results[i].fullName !== null){
                                    infowindow.setContent(results[i].fullName);
                                }
                                else if(results[i].fullName === null){
                                    infowindow.setContent(results[i].name);
                                }
                                else{
                                    infowindow.setContent("Cool Park");
                                }
                                infowindow.open(map, marker);
                            }
                        })(marker, i));
                    }
                }
            });
        });