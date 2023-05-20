require([
    "esri/config", 
    "esri/Map", 
    "esri/views/MapView", 
    "esri/layers/TileLayer", 
    "esri/widgets/LayerList",
    "esri/widgets/Search",
  ], function(esriConfig, Map, MapView, TileLayer, LayerList, Search) {
    esriConfig.apiKey = "AAPK5b378c5a659a47668b94785aee29f811CspcF_qvBERUKbwD9AiaNB94Ie4mbJyNQAgY6gskPznuqWXfm7PU_M1CZJdpDT3i";

    const map = new Map({
      
    });



    const usgsLayer = new TileLayer({
      url: "https://overlord.pgc.umn.edu/arcgis/rest/services/imagery/ant_pgc_composite_mosaic/MapServer",
      title: "PGC Imagery Layer",
      spatialReference: {
        wkid: 3031}
    });
     map.add(usgsLayer);



    

    const view = new MapView({
      map: map,
      center: [166.666664, -77.8499966], // Longitude, latitude
      zoom: 13, // Zoom level
      container: "viewDiv" ,// Div element
      spatialReference: {
        wkid: 3031}
    });
    // Remove Zoom widget from the view
      view.ui.remove("zoom");
    // Wait for the view to finish loading
    view.when(function() {
      // After the view has loaded, add listeners to the zoom buttons
      document.getElementById("zoomInBtn").addEventListener("click", function() {
        view.zoom += 1;
      });
    
      document.getElementById("zoomOutBtn").addEventListener("click", function() {
        view.zoom -= 1;
      });
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

    //not working!!!!
    function login(){
        const keycloak = new Keycloak({
            "realm": "pgc",
            "auth-server-url": "https://account.dev.pgc.umn.edu/auth",
            "ssl-required": "external",
            "resource": "imagery-viewers",
            "public-client": true,
            "enable-cors": true,
            "cors-allowed-methods" : "POST, PUT, DELETE, GET, HEAD",
            "cors-allowed-headers" : "Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
            "confidential-port": 0
          })
          console.log(keycloak)
    }
      
    login()


    // Attach toggle popular place list function to button click event
    document.getElementById("zoomToPopularPlaceBtn").addEventListener("click", togglePopularPlaceList);
    const buck = document.getElementById("buck")
    buck.addEventListener("click", function() {
      zoomToPopularPlace([-0.1411, 51.501])
    });
  });

  