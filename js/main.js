var stations = {};

function getBART() {
  var BARTApi = 'MW9S-E7SL-26DU-VV8V';
  $.get('http://api.bart.gov/api/etd.aspx?cmd=etd&orig=ALL&key=' + BARTApi + '&callback=?', processBART);
}

function processBART(xml) {
  //parse XML
  var data = $.xml2json(xml);

  data.station.forEach(function(station) {
      stations[station.abbr] = {
        "abbr": station.abbr,
        "name": station.name,
        "lines": {}
      };

      if (!(station.etd instanceof Array)) {
        station.etd = [ station.etd ];
      }
      station.etd.forEach(function(destination) {
        stations[station.abbr].lines[destination.abbreviation] = {
          "abbr": destination.abbreviation,
          "name": destination.destination,
          "color": "",
          "times": []
        };

        if (! (destination.estimate instanceof Array)) {
          destination.estimate = [ destination.estimate ];
        }
        destination.estimate.forEach(function(estimate) {
            stations[station.abbr].lines[destination.abbreviation].times.push(parseInt(estimate.minutes, 10));
            if (stations[station.abbr].lines[destination.abbreviation].color === "") {
              stations[station.abbr].lines[destination.abbreviation].color = estimate.color;
            }
        });
      });
  });
  showResults();
}

function showResults() {
  var station = stations["24TH"];
  $("#stationName").text(station.name);
  for (line in station.lines) {
    var a = $("<div>").text(station.lines[line].name).appendTo($("#results"));
    a.attr('class', station.lines[line].color);
    for (time in station.lines[line].times) 
      $("<ul>").text(station.lines[line].times[time]+"min").appendTo($("#results"));    
  };
}

// function getCurrentStation() {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition(function(position) {
//       console.log(position.coords.latitude);
//       console.log(position.coords.longitude);
//     });
//   } else {
//     console.log("error");
//   }
//   //return currentStation;
// }

var x = document.getElementById("demo");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;  
}

$(document).ready(function() {
  getLocation();
  //getBART();
  //getCurrentStation();
});
