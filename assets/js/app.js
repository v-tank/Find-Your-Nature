


function searchParks(){

    
    var sort = "stateCode";
    var state = "";

    var queryURL = "https://developer.nps.gov/api/v1/parks?" + sort + "=" + state + "&limit=1000&api_key=GBHhnwmSBtLdqJDVTJybr1o7yuCxc0Vz9rAcgrQy";

    $.ajax({
      url: queryURL,
      method: 'GET'
    }).done(function(response) {
      var info = response.data;
      var locations = [];

      for (var i = 0; i < info.length; i++) {
      	locations.push(info[i].latLong);
      };

      console.log(locations)

    });
}
searchParks();

