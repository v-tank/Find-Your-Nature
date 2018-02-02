
$(document).ready(function(){
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

      // console.log(info);
      // console.log(info[1].name);

      for (var i = 0; i < info.length; i++) {
        locations.push(info[i].name);
        locations.push(info[i].latLong);
        
        var parksDiv = $("<div class='MAKEMEBOLD!'>" + info[i].name + "</div>");
        $("#parks").append(parksDiv);
      };


      console.log(locations)

    });
}
searchParks();

})

