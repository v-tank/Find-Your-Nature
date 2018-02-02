function initMap() {
    //Map options
    var options = {
        zoom: 8,
        center: { lat: 37.8272, lng: -122.2913 }

    }
    //New map
    var map = new google.maps.Map(document.getElementById("map"), options);


//Add marker

    var marker = new google.maps.Marker({
          position: { lat: 37.3382, lng: -121.8863 },
          map: map
        });
    
}