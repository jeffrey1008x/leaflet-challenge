function markerSize(x) {
    return Math.sqrt(x) * 100;
}

function findColor(x) {
    if (x >= -10 && x < 10) {
        return legend_colors[0];
    }
    else if (x >= 10 && x < 30) {
        return legend_colors[1];
    }
    else if (x >= 30 && x < 50) {
        return legend_colors[2];
    }
    else if (x >= 50 && x < 70) {
        return legend_colors[3];
    }
    else if (x >= 70 && x < 90) {
        return legend_colors[4];
    }
    else if (x > 90) {
        return legend_colors[5];
    }
}

let legend_limits = [-10, 10, 30, 50, 70, 90]
let legend_colors = ['#A3F600', '#DCF400', '#F7DB11','#FDB72A','#FCA35D','#FF5F65']

// Creating the map object
let myMap = L.map("map", {
    center: [43.7032, -79.3832],
    zoom: 3
  });

// Adding the tile layer
let map = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

let geoData = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Get the data with d3.
d3.json(geoData).then(function(data) {

    //console.log(data);
    
    features = data.features;
    for (let i = 0; i < features.length; i++) {
        let p = features[i].properties;
        let c = features[i].geometry.coordinates;
        //console.log(p);
        let mag = p.mag;
        let lon = c[0];
        let lat = c[1];
        let depth = c[2];

        L.circle([lon,lat], {
            stroke: true,
            fillOpacity: 0.5,
            color: "black",
            weight:1,
            fillColor: findColor(depth),
            radius: mag*10000
        })
        .bindPopup(
            "<strong>" + p.title + "</strong><hr>" +
            "<strong> Magnitude: " + mag + "</strong>" + 
            "<br /><strong> Longitude: " + lon + "</strong>" + 
            "<br /><strong> Latitude: " + lat + "</strong>" + 
            "<br /><strong> Depth: " + depth + "</strong>"
        )
        .addTo(myMap);
    }

    // Set up the legend.
    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend");
        let limits = legend_limits;
        let colors = legend_colors;
        let labels = [];

        let legendInfo = "";
        div.innerHTML = legendInfo;
        div.innerHTML += "<table>";

        limits.forEach(function(limit, index) {
            let label_text = "";
            if (limit < 90) 
            {
                label_text = limit.toString() + ' - ' + (limit + 20).toString();
            }
            else
            {
                label_text = '90+';
            }
            labels.push("<tr><th><div class='legend_box' style=\"background-color: " + colors[index] + "\"></div></th><th><div class='legend_box max'>"+label_text+"</div></th></tr><br>");
        });
    
        div.innerHTML += labels.join("");

        div.innerHTML += "</table>";

        return div;
    };

    // Adding the legend to the map
    legend.addTo(myMap);
});