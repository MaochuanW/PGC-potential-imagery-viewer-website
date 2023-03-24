const sitePrefix = `/PGC-potential-imagery-viewer-website/`;

function printLog() {
    return true;
};

(function () {

    if (printLog() == true) {
        console.log("Loading Global");
    };

    // arcgis JS
    let arcgisJS = document.createElement("script");
    arcgisJS.onload = function () {
        if (printLog() == true) {
            console.log("Loaded arcgisJS");
        };
    };
    arcgisJS.src = "https://js.arcgis.com/4.26/";
    // arcgisJS.defer = true;

    // arcgis CSS
    let arcCSS = document.createElement("link");
    arcCSS.onload = function () {
        if (printLog() == true) {
            console.log("Loaded arcCSS");
        };
    };
    arcCSS.rel = "stylesheet";
    arcCSS.href = "https://js.arcgis.com/4.26/esri/themes/light/main.css";

    // arcgis SCRIPT
    let arcgisScript = document.createElement("script");
    arcgisScript.innerHTML = `require([
        "esri/config", 
        "esri/Map", 
        "esri/views/MapView", 
        "esri/layers/TileLayer", 
        "esri/widgets/LayerList",
        "esri/widgets/Search",
      ], function(esriConfig, Map, MapView, TileLayer, LayerList, Search) {
        esriConfig.apiKey = "AAPK5b378c5a659a47668b94785aee29f811CspcF_qvBERUKbwD9AiaNB94Ie4mbJyNQAgY6gskPznuqWXfm7PU_M1CZJdpDT3i";

        const map = new Map({
          basemap: "arcgis-topographic" // Basemap layer service
        });


    
        const usgsLayer = new TileLayer({
          url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer",
          title: "USGS Topographic Map"
        });
        // map.add(usgsLayer);

        const view = new MapView({
          map: map,
          center: [92.762425, 11.67583], // Longitude, latitude
          zoom: 13, // Zoom level
          container: "viewDiv" // Div element
        });

        const layerList = new LayerList({
          view: view
        });
        view.ui.add(layerList, "top-right");

        // Function to zoom to popular place
        function zoomToPopularPlace(coordinates) {
          console.log(coordinates)
          view.goTo({
            center: coordinates,
            zoom: 15
          });
          togglePopularPlaceList();
        }
        
        const searchWidget = new Search({
        view: view
      });

      // Add the search widget to the top right corner of the view
      view.ui.add(searchWidget, {
        position: "top-right"
      });
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
          console.log(x,y)
          view.goTo({
            center: [x, y],
            zoom: 15
          });
        }
        const zoomToCoordinatesbutton = document.getElementById("zoomBtn")
        zoomToCoordinatesbutton.addEventListener("click", zoomToCoordinates)

          
        // Attach toggle popular place list function to button click event
        document.getElementById("zoomToPopularPlaceBtn").addEventListener("click", togglePopularPlaceList);
        const buck = document.getElementById("buck")
        buck.addEventListener("click", function() {
          zoomToPopularPlace([-0.1411, 51.501])
        });
      });`;

    document.head.appendChild(arcgisJS);
    document.head.appendChild(arcgisCSS);
    document.head.appendChild(arcgisScript);
})();