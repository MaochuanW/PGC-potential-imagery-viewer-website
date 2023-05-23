function login() {
    const keycloak = new Keycloak({
        "realm": "pgc",
        "auth-server-url": "https://account.pgc.umn.edu/auth",
        "ssl-required": "external",
        "clientId": "imagery-viewers",
        "public-client": true,
        "enable-cors": true,
        "cors-allowed-methods" : "POST, PUT, DELETE, GET, HEAD",
        "cors-allowed-headers" : "Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
        "confidential-port": 0
    });

    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
        console.log(authenticated ? 'authenticated' : 'not authenticated');
    }).catch(() => {
        console.log('failed to initialize');
    });
}
login();

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/widgets/ScaleBar",
    "esri/layers/ImageryTileLayer"
], function (esriConfig, Map, MapView, TileLayer, LayerList, Search, ScaleBar, ImageryTileLayer) {
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
                url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_50k_topos/MapServer",
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
        center: [166.666664, -90.8499966],
        zoom: 2,
        container: "viewDiv",
        spatialReference: {
            wkid: 3031
        }
    });

    // Create a ScaleBar widget
    const scaleBar = new ScaleBar({
        view: view,
        unit: "dual"
    });

    // Add the ScaleBar widget to the bottom left of the view
    view.ui.add(scaleBar, {
        position: "bottom-left"
    });

    // Remove Zoom widget from the view
    view.ui.remove("zoom");

    // Wait for the view to finish loading
    view.when(function () {
        document.getElementById("zoomInBtn").addEventListener("click", function () {
            view.zoom += 1;
        });

        document.getElementById("zoomOutBtn").addEventListener("click", function () {
            view.zoom -= 1;
        });
    });

    const layerList = new LayerList({ view: view });
    view.ui.add(layerList, "top-right");

    // Function to zoom to popular place
    function zoomToPopularPlace(coordinates) {
        console.log(coordinates)
        view.goTo({ center: coordinates, zoom: 15 });
        togglePopularPlaceList();
    }

    const searchWidget = new Search({ view: view });
    view.ui.add(searchWidget, { position: "top-right" });
    // Remove the LayerList widget from the UI
    view.ui.remove(layerList);

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
            center: [x, y],
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

    const tooltipButtons = document.querySelectorAll('.tooltip');
    tooltipButtons.forEach(btn => {
        btn.addEventListener('mouseover', function () {
            this.querySelector('.tooltip-text').style.visibility = 'visible';
        });
        btn.addEventListener('mouseout', function () {
            this.querySelector('.tooltip-text').style.visibility = 'hidden';
        });
    });

    // Event listener to hide the dropdown menu when clicking anywhere on the map
    view.container.addEventListener("click", function (event) {
        const dropdown = document.getElementById('layerDropdown');
        if (event.target !== dropdown && event.target !== document.getElementById('layerBtn')) {
            dropdown.style.display = 'none';
        }
    });

    // This code fix the click problem for buttons (click twice to toggle dropdown...wtf)
    window.onload = function () {
        // Ensure dropdown is hidden when page loads
        var dropdown = document.getElementById('layerDropdown');
        dropdown.style.display = 'none';

        // Event listener for the button click
        document.getElementById('layerBtn').addEventListener('click', function () {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

    // This gives zoom in/out a smooth effect
    document.getElementById("zoomInBtn").addEventListener("click", function () {
        let zoomLevel = view.zoom + 1;
        view.goTo({ zoom: zoomLevel });
    });
        
    document.getElementById("zoomOutBtn").addEventListener("click", function () {
        let zoomLevel = view.zoom - 1;
        view.goTo({ zoom: zoomLevel });
    });
        
    };
});








/* let keycloak = null;
function login() {
    keycloak = new Keycloak({
        "realm": "pgc",
        "auth-server-url": "https://account.pgc.umn.edu/auth",
        "ssl-required": "external",
        "clientId": "imagery-viewers",
        "public-client": true,
        "enable-cors": true,
        "cors-allowed-methods" : "POST, PUT, DELETE, GET, HEAD",
        "cors-allowed-headers" : "Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
        "confidential-port": 0
    });

    keycloak.init({ onLoad: 'login-required' }).then(authenticated => {
        console.log(authenticated ? 'authenticated' : 'not authenticated');

        keycloak.updateToken(5).then(refreshed => {
            if (refreshed) {
                console.log('Token was successfully refreshed');
            } else {
                console.log('Token is still valid');
            }
        }).catch(() => {
            console.log('Failed to refresh the token, or the session has expired');
        });

    }).catch(() => {
        console.log('failed to initialize');
    });
}

login();

require([
    "esri/config",
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/TileLayer",
    "esri/widgets/LayerList",
    "esri/widgets/Search",
    "esri/layers/ImageryTileLayer",
    "esri/widgets/ScaleBar"
], function (esriConfig, Map, MapView, TileLayer, LayerList, Search, ScaleBar, ImageryTileLayer) {
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
                url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_50k_topos/MapServer",
                title: "Layer 1"
            });
            map.add(layer1);
        } else {
            // If the checkbox is not checked, remove the layer
            map.remove(layer1);
        }
    });

    esriConfig.request.interceptors.push({
        urls: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_ant/ImageServer",
        headers: {
            Authorization: "Bearer " + keycloak.token
        }
    });

    const layer2 = new ImageryTileLayer({
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_ant/ImageServer",
        title: "Layer 2",
        // Add additional properties if needed.
    });

    document.getElementById("layer2Checkbox").addEventListener("change", function () {
        if (this.checked) {
            // If the checkbox is checked, show the layer
            map.add(layer2);
        } else {
            // If the checkbox is not checked, remove the layer
            map.remove(layer2);
        }
    }); */