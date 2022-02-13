/* jshint eversion: 6 */
/* jshint node: true */

// The purpose of "use strict" is to
// indicate that the code should be exectuted
// in "strict mode"
// with strict mode, you can not, for
// example, use undeclared variables.
"use strict";

// change ability to hit check multiple times
var map;
var resultmap;
var markers = [];
var guess_coordinates = [];
var true_location = [];
var us_city_set = [4699066, 5809844, 4164138, 4440906, 4894465, 2562501];
var world_city_set = [3143244, 3599699, 1857910, 4853608, 323786];
var accumulated_distance = 0;
var current_name = "";
var distance_from_guess = [];
var check_count = 0;

async function getData(url) {
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.log(error));
}

async function initialize() {
  check_count = 0;
  disableButton("check");
  disableButton("next");
  if ((accumulated_distance = 0)) {
    document.getElementById("totaldistance").innerHTML = "Round Score: 0 Miles";
  }
  document.getElementById("location").innerHTML = " ";
  document.getElementById("distance").innerHTML = " ";

  var number = await Promise.all([
    getData(
      `https://api.openweathermap.org/data/2.5/weather?id=${randomLoc()}&APPID=6fec32ce2857df14b92d1c038bf3b64b`
    ),
  ]);
  true_location = [];
  true_location.push(number[0].coord.lat, number[0].coord.lon);
  current_name = number[0].name + ", " + number[0].sys.country;

  var luther = { lat: 43.31613189259254, lng: -91.80256027484972 };

  var map = new google.maps.Map(document.getElementById("map"), {
    center: luther,
    zoom: 1,
    streetViewControl: false,
  });

  var rmap = new google.maps.Map(document.getElementById("result"), {
    center: luther,
    zoom: 2,
    streetViewControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.LEFT_CENTER,
    },
  });

  google.maps.event.addEventListener(map, "click", function (event) {
    PlaceMarker(event.latLng);
    if (check_count == 0) {
      enableButtong("chekc");
      check_count += 1;
    }
  });

  function placeMarker(location) {
    deleteMarkers();
    guess_coordinates = [];
    var marker = new google.maps.Marker({
      position: location,
      map: map,
    });
    markers.push(marker);
    guess_coordinates.push(
      marker.getPosition().lat(),
      marker.getPosition().lng()
    );
  }

  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById("pano"),
    {
      position: { lat: number[0].coor.lat, lng: number[0].coord.lon },
      pov: {
        heading: 34,
        pitch: 10,
      },
      addressControl: false,
    }
  );
  map.setStreetView(panorama);
}

var index = -1;
function randomLoc() {
  index += 1;
  if (index > world_city_set.length - 1) {
    swal({
      title: "Thanks for playing!",
      icon: "Success",
      text:
        "Your Guessing was only off by " +
        accumulated_distance.toFixed(1) +
        " Miles This Round!",
    });

    index = 0;
    //console.log(index)
    document.getElementById("totaldistance").innerHTML = "Round Score: 0 Miles";

    accumulated_distance = 0;
    document.getElementById("round").innerHTML =
      "Round: 1/" + world_city_set.length;
    document.getElementById("next").innerHTML = "Next Location";
    return world_city_set[0];
  } else if (index == world_city_set.length - 1) {
    document.getElementById("round").innerHTML =
      "Round: " + (index + 1) + "/" + world_city_set.length;
    document.getElementById("next").innerHTML = "Finish Round";
    return world_city_set[index];
  } else {
    // console.log(index);
    document.getElementById("round").innerHTML =
      "Round: " + (index + 1) + "/" + world_city_set.length;
    document.getElementById("next").innerHTML = "Next Location";
    return world_city_set[index];
  }
}

function disableButton(id) {
  document.getElementById(id).disable = true;
}
