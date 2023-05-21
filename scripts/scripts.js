require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Search",

], function (esriConfig, Map, MapView, TileLayer, LayerList, Search) {
    esriConfig.apiKey = "AAPK5b378c5a659a47668b94785aee29f811CspcF_qvBERUKbwD9AiaNB94Ie4mbJyNQAgY6gskPznuqWXfm7PU_M1CZJdpDT3i";

    const map = new Map({});

    const pgcLayer = new TileLayer({
        url: "https://overlord.pgc.umn.edu/arcgis/rest/services/imagery/ant_pgc_composite_mosaic/MapServer",
        title: "PGC Imagery Layer",
        spatialReference: {
            wkid: 3031
        }
    });
    map.add(pgcLayer);
    
    
    let layer1;

document.getElementById("layer1Checkbox").addEventListener("change", function () {
    if (this.checked) {
        // If the checkbox is checked, show the layer
        layer1 = new TileLayer({
            url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_50k_topos/MapServer", // Insert your tile layer URL here
            title: "Layer 1"
        });
        map.add(layer1);
    } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer1);
    }
});

    const view = new MapView({
        map: map,
        center: [
            166.666664, -77.8499966
        ], // Longitude, latitude
        zoom: 2, // Zoom level
        container: "viewDiv", // Div element
        spatialReference: {
            wkid: 3031
        }
    });

    
    // Remove Zoom widget from the view
    view.ui.remove("zoom");

    // Wait for the view to finish loading
    view.when(function () { // After the view has loaded, add listeners to the zoom buttons
        document.getElementById("zoomInBtn").addEventListener("click", function () {
            view.zoom += 1;
        });

        document.getElementById("zoomOutBtn").addEventListener("click", function () {
            view.zoom -= 1;
        });
    });

    const layerList = new LayerList({view: view});
    view.ui.add(layerList, "top-right");

    // Remove the LayerList widget from the UI
    view.ui.remove(layerList);


    // Function to zoom to popular place
    function zoomToPopularPlace(coordinates) {
        console.log(coordinates)
        view.goTo({center: coordinates, zoom: 15});
        togglePopularPlaceList();
    }

    const searchWidget = new Search({view: view});

    // Add the search widget to the top right corner of the view
    view.ui.add(searchWidget, {position: "top-right"});

    // Function to toggle popular place list
    function togglePopularPlaceList() {
        const popularPlaceList = document.getElementById("popularPlaceList");
        if (popularPlaceList.style.display === "none") {
            popularPlaceList.style.display = "block";
        } else {
            popularPlaceList.style.display = "none";
        }
    }
    function zoomToCoordinates() {
        console.log("zoom to coordinates")
        const x = parseFloat(document.getElementById("longitude").value);
        const y = parseFloat(document.getElementById("latitude").value);
        console.log(x, y)
        view.goTo({
            center: [
                x, y
            ],
            zoom: 15
        });
    }
    const zoomToCoordinatesbutton = document.getElementById("zoomBtn")
    zoomToCoordinatesbutton.addEventListener("click", zoomToCoordinates)


    // Attach toggle popular place list function to button click event
    document.getElementById("zoomToPopularPlaceBtn").addEventListener("click", togglePopularPlaceList);
    const buck = document.getElementById("buck")
    buck.addEventListener("click", function () {
        zoomToPopularPlace([-0.1411, 51.501])
    });
});


const tooltipButtons = document.querySelectorAll('.tooltip');
tooltipButtons.forEach(btn => {
    btn.addEventListener('mouseover', function () {
        this.querySelector('.tooltip-text').style.visibility = 'visible';
    });
    btn.addEventListener('mouseout', function () {
        this.querySelector('.tooltip-text').style.visibility = 'hidden';
    });
});

window.onload = function() {
    document.getElementById('layerBtn').addEventListener('click', function() {
      var dropdown = document.getElementById('layerDropdown');
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
  }
  