 var meteorIcon = L.icon({
     iconUrl: 'Icons/meteor.png',
// //    shadowUrl: '',
     iconSize:     [38, 35], // size of the icon
//  //   shadowSize:   [50, 64], // size of the shadow
     iconAnchor:   [0, 0], // point of the icon which will correspond to marker's location
//  //   shadowAnchor: [4, 62],  // the same for the shadow
     popupAnchor:  [10, 20] // point from which the popup should open relative to the iconAnchor
 });
// var foundIcon = L.icon({
//     iconUrl: 'Icons/found.png',
// //    shadowUrl: '',
//     iconSize:     [38, 95], // size of the icon
//  //   shadowSize:   [50, 64], // size of the shadow
//     iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
// //    shadowAnchor: [4, 62],  // the same for the shadow
//     popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
// });

// Store the API variables
let baseURL = "https://data.nasa.gov/api/views/gh4g-9sfh/rows.json?accessType=DOWNLOAD";
let fell = "&fall=Fell";
let fall = "&fall=Found";
let year = "&year=";


//Years to show markers
// const yearsToShow = [1983, 1993, 2003, 2013, 2023];
// const years1983to2023 = Array.from({ length: 2023 - 1983 + 1 }, (_, index) => 1983 + index);


//Declare markerLayerGroup
let markerLayerGroup;

// create map since it doesn't require any external data
var baseMap = initMap();

// Function to load data for specific year
function loadDataForYear(selectedYear) { // 'all', '1983', '1993'
    // Fetch and filter data based on the selected year or range
    let dynamicURL = baseURL + fell + fall;

    // if (selectedYear !== 'all') {
        // If selected year isn't 'all', then fetch data for that year
        // dynamicURL += year + selectedYear;
    // }

    //d3.select('#year-selector').property('value')
    dynamicURL += year + selectedYear;

    console.log("Fetching data from:", dynamicURL);

    d3.json(dynamicURL).then(function(response) {
        console.log("Data fetched successfully:", response);

        // Ensure markerLayerGroup is defined
        if (!markerLayerGroup) {
            markerLayerGroup = L.layerGroup().addTo(myMap);
        } else {
            // Clear existing markers from the layer group
            markerLayerGroup.clearLayers();
        }

        let markers = [];
        let mapData = response.data;

        // testing smaller set
        // mapData=mapData.slice(0, 20);

        // Filter data based on the selected year
        if (selectedYear !== 'all') {
            mapData = mapData.filter(entry => {
                // Assuming the year information is at a specific index in the data array
                const timeStamp = entry[14];
                if (timeStamp) {
                    entryYear=timeStamp.substring(0, 4);
                    return entryYear === selectedYear;
                } else {
                    return false;
                }
                // console.log('Selected Year:', selectedYear);
                // console.log('Entry Year', entryYear);

            });
        }
        console.log("mapData: ", mapData[1]);
        //Limit number of markers per year (20000)
        const maxMarkersPerYear = 20000;
        for (let i = 0; i < Math.min(maxMarkersPerYear, mapData.length); i++) {
            let location = mapData[i];
            let lat = location[15];
            let lon = location[16];
            if (lat && lon) {
                let marker = L.marker([parseFloat(lat), parseFloat(lon)], {icon: meteorIcon})
                .bindPopup("Name: " + location[8]
                         + "<br>Mass(g): " + location[12]
                         + "<br>Fell or Found: " + location[13]
                         + "<br>Latitude: " + location[15]
                         + "<br>Longitude: " + location[16])
                .on('mouseover', function () {
                     this.openPopup();
                })
                .on('mouseout', function () {
                    this.closePopup();
                });
                markers.push(marker);
            }
        }

        // Add the new markers to the layer group
        markers.forEach(marker => {
            markerLayerGroup.addLayer(marker);
        });

        // debug line, can be ditched later
        console.log("Markers added to the map.");

        
    })
    .catch(function(error) {
        console.error("Error fetching data:", error);
    });
    
    
    // todo: flesh out the data handling
    // the steps are:
    // 1. get the data, maybe from a json or csv?
    // 2. if 'year' is not 'all', filter the data to just that year
    // 3. wipe the old data off the map before adding new stuff
    // 4. plot the new data points on the map
    // note: 'all' means any year from 1983 to 2023
}


// setting up the map here
var myMap;

// we're starting with a basic look BUT COULD APPLY A WATERCOLOR OR TONER OVERLAY
function initMap() {
    // the map gets going with these settings but checks if map is already init
    if (!myMap) {
        myMap = L.map("map", {
        center: [20, 0], // where the map first looks
        zoom: 2 // how close we're starting
    });
    // OPTION 1 using openstreetmap for our base layer (replace with layers here)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    }

    return myMap;
}

// dropdown listener setup
function setupDropdown() {
    var selector = document.getElementById("yearSelect");
    selector.addEventListener("change", handleYearChange);
}

// this bit reacts to the dropdown changes
// it tells 'loadDataForYear' what to do next
function handleYearChange(event) {
    const selectedYear = event.target.value;

    // Clear existing markers when the year is changed
    if (markerLayerGroup) {
        markerLayerGroup.clearLayers();
    }
    loadDataForYear(selectedYear);

}
// the main kickoff function
// gets the map and dropdown ready, and loads initial data
function init() {
    initMap();
    setupDropdown();

    loadDataForYear('all').then(() => {

    });
    //Loop through years and load data for each
    // for (const yearToShow of yearsToShow) {
    //     loadDataForYear(yearToShow);
    // }
}
// when the page loads, we start here
window.onload = function() {
    init();
};


// notes for michael and brian:
// in 'loadDataForYear', you need to add the actual data fetching and displaying logic
// feel free to tweak the map settings or add cool features
// the dropdown is all set (i think), it's just about what happens when the year option changes
// JUST SAYING, but we could make it really cool looking like here https://maps.stamen.com/#watercolor/12/37.7706/-122.3782
// and changing up the background and font styling with some borders. if we're bored.
