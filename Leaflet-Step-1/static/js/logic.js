// Use this link to get the geojson data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
// Function to determine marker size based on magnitude in data.
function markerSize(magnitude) {
    return magnitude * 5;
}

// Function to return the color based on magnitude.
function markerColor(magnitude) {
    if (magnitude > 5) {
      return 'red'
    } else if (magnitude > 4) {
      return 'orange'
    } else if (magnitude > 3) {
      return 'yellow'
    } else if (magnitude > 2) {
        return 'green'
    } else {
      return 'blue'
    }
  }
  

// Function for opacity based on magnitude.
function markerOpacity(magnitude) {
    if (magnitude > 6) {
      return .99
    } else if (magnitude > 5) {
      return .80
    } else if (magnitude > 4) {
      return .70
    } else if (magnitude > 3) {
      return .60
    } else if (magnitude > 2) {
      return .50
    } else if (magnitude > 1) {
      return .40
    } else {
      return .30
    }
  }


// GET request, and function to handle returned JSON data.
d3.json(link, function(data) {
  
    var earthquakes = L.geoJSON(data.features, {
      onEachFeature : addPopup,
      pointToLayer: addMarker
    });


// Create Map
createMap(earthquakes);

}); 

function addMarker(feature, location) {
    var options = {
      stroke: false,
      fillOpacity: markerOpacity(feature.properties.mag),
      color: markerColor(feature.properties.mag),
      fillColor: markerColor(feature.properties.mag),
      radius: markerSize(feature.properties.mag)
    }
  
    return L.circleMarker(location, options);
  
  }
  
  // Define a function we want to run once for each feature in the features array
  function addPopup(feature, layer) {
      // Give each feature a pop up describing the place and time of the earthquake
      return layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> <h4>Magnitude: ${feature.properties.mag} </h4> <p> ${Date(feature.properties.time)} </p>`);
  }
  
  // function to receive a layer of markers and plot them on a map.
  function createMap(earthquakes) {
  
      // Define streetmap and darkmap layers
      var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
      });
    
      var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/dark-v10",
        accessToken: API_KEY
      });

      var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        maxZoom: 18,
        id: "mapbox/light-v10",
        accessToken: API_KEY
      });
    
      // Define a baseMaps object to hold our base layers
      var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Light Map" : lightmap
      };
    
      // Create overlay object to hold our overlay layer
      var overlayMaps = {
        Earthquakes: earthquakes
      };

      // Creating map object
var myMap = L.map("map", {
    center: [-31.9505, 115.8605],
    zoom: 3,
    layers: [lightmap, earthquakes]
  });
  
  // Adding tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
    
      // creating the legend
      var legend = L.control({position: 'bottomright'});
  
      // add legend to map
      legend.onAdd = function () {
      
        var div = L.DomUtil.create('div', 'info legend')
          

        div.innerHTML += "<h4>Magnitude</h4>";
        div.innerHTML += '<i style="background: red"></i><span>5 or Higher</span><br>';
        div.innerHTML += '<i style="background: orange"></i><span>Between 4 & 5</span><br>';
        div.innerHTML += '<i style="background: yellow"></i><span>Between 3 & 4</span><br>';
        div.innerHTML += '<i style="background: green"></i><span>Between 2 & 3</span><br>';
        div.innerHTML += '<i style="background: blue"></i><span>Less Than 2</span><br>';

  
        return div;
      };
      
      legend.addTo(myMap);
  
      // Create a layer control
      // Pass in our baseMaps and overlayMaps
      // Add the layer control to the map
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: true
      }).addTo(myMap);
  
    }