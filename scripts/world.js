function login() {
    const keycloak = new Keycloak({
        realm: "pgc",
        "auth-server-url": "https://account.pgc.umn.edu/auth",
        "ssl-required": "external",
        clientId: "imagery-viewers",
        "public-client": true,
        "enable-cors": true,
        "cors-allowed-methods": "POST, PUT, DELETE, GET, HEAD",
        "cors-allowed-headers": "Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
        "confidential-port": 0,
    });

    function refreshTokenIfNeeded() {
        if (window.keycloak.isTokenExpired()) { 
            window.keycloak
                .updateToken(70)  // Refresh the token immediately if it's expired
                .then(() => {
                    console.log("Token refreshed successfully");
                })
                .catch((error) => {
                    console.log("Error updating token", error);
                    window.keycloak.logout();
                });
        }
    }

    keycloak
        .init({ checkLoginIframe: false })
        .then((authenticated) => {
            if (!authenticated) {
                // Display the login modal
                const modal = document.getElementById("pgcModal");
                modal.style.display = "block";

                // Add click event listeners to the buttons
                const loginButton = document.getElementById("loginButton");
                const continueButton = document.getElementById("continueButton");
                loadEsriConfig(authenticated)
                loginButton.addEventListener("click", () => {
                    keycloak.login();
                });


                document.addEventListener("DOMContentLoaded", function() {
                    const divLoginButton = document.getElementById("login");
                    if (divLoginButton) {
                      divLoginButton.addEventListener("click", () => {
                        console.log("Div clicked, trying to login...");
                        keycloak.login();
                      });
                    } else {
                      console.error("Div with id 'login' not found!");
                    }
                  });

                continueButton.addEventListener("click", () => {
                    modal.style.display = "none";
                });
            } else {
                window.keycloak = keycloak; // Assign keycloak to a global variable so it can be accessed later.
                console.log(authenticated ? "authenticated" : "not authenticated");
                loadEsriConfig(authenticated)
                // Refresh the token every minute if it's valid
                refreshTokenIfNeeded();
                setInterval(refreshTokenIfNeeded, 60000); // 60000 milliseconds = 1 minute
            }
        })
        .catch((error) => {
            console.log("failed to initialize", error);
        });
}

login();

function loadEsriConfig(authenticated) {

    require([
        "esri/config",
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/TileLayer",
        "esri/widgets/LayerList",
        "esri/widgets/Search",
        "esri/widgets/ScaleBar",
        "esri/layers/ImageryTileLayer",
        "esri/layers/ImageryLayer",
        "esri/widgets/Measurement",
        "esri/layers/FeatureLayer",
        "esri/PopupTemplate",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/Graphic",
        "esri/rest/support/Query",
        "esri/layers/GraphicsLayer",
        "esri/geometry/SpatialReference",
        "esri/layers/support/TileInfo",
        "esri/widgets/CoordinateConversion",
        "esri/renderers/RasterStretchRenderer",
        "esri/rest/support/AlgorithmicColorRamp",
        "esri/rest/support/MultipartColorRamp",
        "esri/layers/MapImageLayer",
        "esri/layers/WMSLayer",
        "esri/widgets/Sketch",
        "esri/geometry/geometryEngine"
    ], function (esriConfig, Map, MapView, TileLayer, LayerList, Search, ScaleBar, ImageryTileLayer, ImageryLayer, Measurement, FeatureLayer, PopupTemplate, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic, Query, GraphicsLayer, SpatialReference, TileInfo, CoordinateConversion, RasterStretchRenderer, AlgorithmicColorRamp, MultipartColorRamp, MapImageLayer, WMSLayer, Sketch, geometryEngine) {
    esriConfig.apiKey = "AAPK5b378c5a659a47668b94785aee29f811CspcF_qvBERUKbwD9AiaNB94Ie4mbJyNQAgY6gskPznuqWXfm7PU_M1CZJdpDT3i";
    document.addEventListener('DOMContentLoaded', (event) => {
        view.when(function () {
            loadExtentFromUrl(view);
        });
    });

    esriConfig.request.interceptors.push({
        urls: [
            "https://overlord.pgc.umn.edu/arcgis/rest/services/imagery/hma_pgc_mosaic_L8_rgb/MapServer", "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_hma/FeatureServer/0", "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_hma/ImageServer"
        ],

        before: function (params) {
            if (window.keycloak.isTokenExpired()) {
                console.log("Token is expired, skipping request");
                params.requestOptions.body = "";  // Empty the body to effectively skip the request
            } else {
                params.requestOptions.headers = {
                    Authorization: "Bearer " + window.keycloak.token
                };
            }
        }
    });

    document.getElementById('logout').addEventListener('click', function() {
        if (window.keycloak && window.keycloak.authenticated) {
            window.keycloak.logout();
        } else {
            console.log('Not logged in or Keycloak instance is not available');
        }
    });


    let currentFreeLayer; // This will keep track of the current layer
    let currentCheckbox; // This will keep track of the current checkbox

    function addLayer(layer, checkbox) {
        if (currentFreeLayer) {
            map.remove(currentFreeLayer);
            if (currentCheckbox) {
                currentCheckbox.checked = false;
            }
        }

        map.add(layer);
        currentFreeLayer = layer;
        currentCheckbox = checkbox;
    }

    const map = new Map({});

    const labelbasemap = new TileLayer({
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer", 
        title: "label basemap"
    });

    const worldbasemap = new TileLayer({
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer", 
        title: "world Basemap"
    });

    // Initialize hmaL8rgb layer
    let hmaL8rgb = new ImageryLayer({
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_hma/ImageServer", 
        title: "hmaL8rgb",
    });

    // Add the layers to the map, with labelbasemap added last to ensure it's on top
    map.addMany([worldbasemap, hmaL8rgb, labelbasemap]);

    document.getElementById("EsriBasemapCheckbox").addEventListener("change", function () {
        worldbasemap.visible = this.checked;
    });

    // Set the checkbox to be checked by default
    document.getElementById("EsriBasemapCheckbox").checked = true;
    worldbasemap.visible = true;

    document.getElementById("EsriLabelBasemapCheckbox").addEventListener("change", function () {
        labelbasemap.visible = this.checked;
    });

    // Set the checkbox to be checked by default
    document.getElementById("EsriLabelBasemapCheckbox").checked = true;
        labelbasemap.visible = true;

    document.getElementById("hmaL8rgb").addEventListener("change", function () {
        hmaL8rgb.visible = this.checked;
    });

    // Set the checkbox to be checked by default
    document.getElementById("hmaL8rgb").checked = true;
    hmaL8rgb.visible = true;




    const spatialReference = new SpatialReference({wkid: 3857});

    // Create LODs from level 0 to 24
    const tileInfo = TileInfo.create({spatialReference, numLODs: 24});

    const lods = tileInfo.lods;

    const view = new MapView({
        map: map,
        center: [
            88.690219, 28.925347
        ],
        zoom: 4,
        container: "viewDiv",
        spatialReference,
        constraints: {
            lods: lods,
            snapToZoom: true
        }
    });

    let ccWidget = new CoordinateConversion({view: view, orientation: "expand-up"});

    window.openCoordinateWidget = openCoordinateWidget;

    function openCoordinateWidget() {
        if (! view.ui.find(ccWidget)) {
            view.ui.add(ccWidget, "manual");
            ccWidget.container.id = "coordinate-widget";

            setTimeout(() => {
                document.querySelector("#coordinate-widget .esri-widget--button").click();
            }, 1);
        }
    }

    

    document.getElementById("zoomInBtn").addEventListener("click", function () {
        let zoomLevel = view.zoom + 1;
        view.goTo({zoom: zoomLevel});
    });

    document.getElementById("zoomOutBtn").addEventListener("click", function () {
        let zoomLevel = view.zoom - 1;
        view.goTo({zoom: zoomLevel});
    });

    // Create the panchromatic cutline layer
    var panchromaticCutlineLayer = new FeatureLayer({url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_hma/FeatureServer/0"});


    // Variable to keep track of currently selected layer. Initially, it's the panchromaticCutlineLayer
    var currentLayer = panchromaticCutlineLayer;


    // Add event listener to capture map clicks
    view.on("click", function (event) { 
        var isMeasurementToolActive = measurementWidget.activeTool !== null;
    
        // Check if the measurement tool is not active and hmaL8rgb is visible
        if (!isMeasurementToolActive && hmaL8rgb.visible && currentLayer) {
            cutline(event.mapPoint, currentLayer);
        }
    });

    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

    const sketch = new Sketch({
      layer: graphicsLayer,
      view: view,
      availableCreateTools: ["polyline", "polygon", "rectangle"],
      creationMode: "update",
      updateOnGraphicClick: true,
      visibleElements: {
        createTools: {
          point: false,
          circle: false
        },
        selectionTools:{
          "lasso-selection": false,
          "rectangle-selection":false,
        },
        settingsMenu: false,
        undoRedoMenu: false
      }
    });

    view.ui.add(sketch, "top-right");

    const measurements = document.getElementById("measurements");
    view.ui.add(measurements, "manual");

    function getArea(polygon) {
      const geodesicArea = geometryEngine.geodesicArea(polygon, "square-kilometers");
      const planarArea = geometryEngine.planarArea(polygon, "square-kilometers");

      measurements.innerHTML =
      "<b>Geodesic area</b>:  " + geodesicArea.toFixed(2) + " km\xB2" + " |   <b>Planar area</b>: " + planarArea.toFixed(2) + "  km\xB2";

    }

    function getLength(line) {
      const geodesicLength = geometryEngine.geodesicLength(line, "kilometers");
      const planarLength = geometryEngine.planarLength(line, "kilometers");

      measurements.innerHTML =
        "<b>Geodesic length</b>:  " + geodesicLength.toFixed(2) + " km" + " |   <b>Planar length</b>: " + planarLength.toFixed(2) + "  km";

    }

    function switchType(geom) {
      switch (geom.type) {
        case "polygon":
          getArea(geom);
          break;
        case "polyline":
          getLength(geom);
          break;
        default:
          console.log("No value found");
      }
    }

    sketch.on("update", (e) => {
        const geometry = e.graphics[0].geometry;

        if (e.state === "start") {
          switchType(geometry);
        }

        if (e.state === "complete") {
          graphicsLayer.remove(graphicsLayer.graphics.getItemAt(0));
          measurements.innerHTML = null;
        }

        if (
          e.toolEventInfo &&
          (e.toolEventInfo.type === "scale-stop" ||
            e.toolEventInfo.type === "reshape-stop" ||
            e.toolEventInfo.type === "move-stop")
        ) {
          switchType(geometry);
        }
    });


    // Function that delete cutline and popup window when user click outside map frame
    var viewContainer = view.container;

    document.addEventListener("click", function (event) {
        var isClickInside = viewContainer.contains(event.target);

        if (! isClickInside) {
            view.popup.close();
        }
    });

    view.popup.watch("visible", function (newValue) {
        if (! newValue) { // If the popup is not visible...
            view.graphics.removeAll(); // Remove all graphics from the view
        }
    });

    function cutline(mapPoint, currentLayer) { // Create cutline symbol
        var cutlinePoly = new SimpleFillSymbol({
            style: "solid",
            color: [
                0, 0, 0, 0
            ],
            outline: new SimpleLineSymbol(
                {
                    style: "solid",
                    color: [
                        0, 0, 0
                    ],
                    width: 1
                }
            )
        });

        // Create the query
        var query = currentLayer.createQuery();
        query.geometry = mapPoint;
        query.outFields = ["*"];
        query.returnGeometry = true;

        // Create the popup template
        var popupTemplate = {
            title: "Imagery Information",
            content: function (feature) { // Get the field values
                var attributes = feature.graphic.attributes;

                // Map sensor values to labels
                var sensorLabels = {
                    WV01: "WorldView-1",
                    WV02: "WorldView-2",
                    WV03: "WorldView-3",
                    QB02: "QuickBird",
                    GE01: "GeoEye-1"
                };
                var sensorLabel = sensorLabels[attributes.sensor];

                // Build the content string
                var content = `
                <div style="font-family: Arial, sans-serif; color: #333; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;  align-items: center;">
                    <div style="display: flex; flex-direction: column; width: 100%; margin-bottom: 10px;">
                        <div style="background-color: #00897b; color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Sensor</p>
                            <p style="margin: 0; font-size: 16px; text-align: center;">${sensorLabel}</p>
                        </div>
                        <div style="background-color: #d81b60; color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Date</p>\
                            <p style="margin: 0; font-size: 16px; text-align: center;">${attributes.acqdate}</p>
                        </div>
                    </div>
                    <div style="background-color: #0050b3; color: #fff; padding: 10px; border-radius: 5px; margin-bottom: 10px; width: 94%;">
                        <p style="margin: 0; font-size: 14px; text-align: center;">Catalog ID</p>
                        <a href="${attributes.browseurl}" target="_blank" style="color: #fff; text-decoration: underline; font-size: 16px; display: block; text-align: center;">${attributes.cat_id}</a>

                    </div>
                    <div style="display: flex; flex-direction: column; width: 100%;">
                        <div style="background-color: #fc6600; color: #fff; padding: 13px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Sun Elevation</p>
                            <p style="margin: 0; font-size: 16px; text-align: center;">${parseFloat(attributes.sun_elev).toFixed(2)}%</p>
                        </div>
                        <div style="background-color: #6d4c41; color: #fff; padding: 13px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Off-Nadir Angle</p>
                            <p style="margin: 0; font-size: 16px; text-align: center;">${parseFloat(attributes.off_nadir).toFixed(2)}%</p>
                        </div>
                    </div>
                </div>
                `;

                return content;
            }
        };

        // Execute the query
        currentLayer.queryFeatures(query).then(function (result) {
            if (result.features.length > 0) { // Clear existing graphics before adding new ones
                view.graphics.removeAll();
                result.features.forEach(function (feature) {
                    feature.symbol = cutlinePoly;
                    var graphic = new Graphic({geometry: feature.geometry, symbol: feature.symbol, attributes: feature.attributes, popupTemplate: popupTemplate});
                    view.graphics.add(graphic);
                });
                // Open the popup at the clicked location and set its content to be the content of the first graphic
                view.popup.open({
                    features: view.graphics.items, // Pass in the graphics to display in the popup
                    location: mapPoint, // Set the location of the popup to the mapPoint
                });
            }
        });
    }

    // Function to create a measurement tool
    const distanceButton = document.getElementById("distance");
    const areaButton = document.getElementById("area");
    const clearButton = document.getElementById("clear");

    // Create a new instance of the Measurement widget
    const measurementWidget = new Measurement({view: view});

    // Add the Measurement widget to the top-left corner of the view
    view.ui.add(measurementWidget, "top-left");

    // Function to enable the measurement of distance
    function distanceMeasurement() {
        measurementWidget.activeTool = "distance";
    }

    // Function to enable the measurement of area
    function areaMeasurement() {
        measurementWidget.activeTool = "area";
    }

    // Function to clear measurements
    function clearMeasurements() {
        measurementWidget.clear();
    }

    distanceButton.addEventListener("click", function () {
        distanceMeasurement();
    });

    areaButton.addEventListener("click", function () {
        areaMeasurement();
    });

    clearButton.addEventListener("click", function () {
        clearMeasurements();
    });

    // Get references to the ruler button and the toolbar div
    var rulerButton = document.getElementById("ruler");
    var toolbarDiv = document.getElementById("toolbarDiv");

    // Add a click event listener to the ruler button
    rulerButton.addEventListener("click", function () { // Toggle the visibility of the toolbar div
        toolbarDiv.classList.toggle("show");
    });

    document.querySelector("#ruler").addEventListener("click", function () {
        let tooltipText = this.querySelector(".tooltip-text");
        tooltipText.style.visibility = "hidden";
    });

    // Create a ScaleBar widget
    const scaleBar = new ScaleBar({view: view, unit: "dual"});

    // Add the ScaleBar widget to the bottom left of the view
    view.ui.add(scaleBar, {position: "bottom-left"});

    // Remove Zoom widget from the view
    view.ui.remove("zoom");

    const layerList = new LayerList({view: view});
    view.ui.add(layerList, "top-right");
    view.ui.remove(layerList);

    const searchWidget = new Search({view: view});
    view.ui.add(searchWidget, {position: "top-right"});
    // Remove the LayerList widget from the UI
    // view.ui.remove(layerList);

    window.openModal = openModal;
    window.closeModal = closeModal;
    function openModal(modalId, event) {
        var modal = document.getElementById(modalId);
        modal.style.display = "block";
    }

    function closeModal(modalId) {
        var modal = document.getElementById(modalId);
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target.className === "modal") {
            event.target.style.display = "none";
        }
    };

    // Popular places data
    const popularPlaces = [
        {
            id: "kathmandu",
            coordinates: [
                85.3206, 27.70169
            ],
            zoomLevel: 13
        },
        {
            id: "southcamp",
            coordinates: [
                86.851323, 28.14277
            ],
            zoomLevel: 13
        },
        {
            id: "mounteverest",
            coordinates: [
                86.922623, 27.986065
            ],
            zoomLevel: 13
        },
    ];

    // Function to zoom to popular place
    function zoomToPopularPlace(coordinates, zoomLevel) {
        console.log(coordinates);
        view.goTo({center: coordinates, zoom: zoomLevel});
        closeModal("popularPlacesModal");
    }

    // Attach event listeners to popular places
    popularPlaces.forEach(place => {
        const button = document.getElementById(place.id);
        button.addEventListener("click", function () {
            zoomToPopularPlace(place.coordinates, place.zoomLevel);
        });
    });

    const tooltipButtons = document.querySelectorAll(".tooltip");
    tooltipButtons.forEach((btn) => {
        btn.addEventListener("mouseover", function () {
            this.querySelector(".tooltip-text").style.visibility = "visible";
        });
        btn.addEventListener("mouseout", function () {
            this.querySelector(".tooltip-text").style.visibility = "hidden";
        });
    });


    // Function to get the current extent and create an object
    function getCurrentState(view) {
        var xmin = view.extent.xmin;
        var ymin = view.extent.ymin;
        var xmax = view.extent.xmax;
        var ymax = view.extent.ymax;

        return {xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax};
    }

    // Function to create the shareable URL
    function createShareableUrl(map) {
        var state = getCurrentState(map);
        var baseUrl = window.location.href.split('?')[0]; // remove existing parameters
        var url = new URL(baseUrl);

        url.searchParams.append('xmin', state.xmin);
        url.searchParams.append('ymin', state.ymin);
        url.searchParams.append('xmax', state.xmax);
        url.searchParams.append('ymax', state.ymax);

        return url.toString();
    }

    function updateUrl(view) {
        var newUrl = createShareableUrl(view);
        window.history.pushState({}, '', newUrl);
    }

    // Add event listener for 'extent' property
    view.watch('extent', function(newValue, oldValue, property, object) {
        updateUrl(object);
    });

    function openShareModal(map) {
        var url = createShareableUrl(map);

        // Display the URL in the modal
        var modal = document.getElementById('Sharelinkmodal');
        var urlDisplay = modal.querySelector('.url-display'); // Add a selector for where to display the URL
        urlDisplay.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
        // Make it a clickable link

        // Set the href for the email button
        var emailButton = document.getElementById('emailButton');
        var encodedUrl = encodeURIComponent(url); // Add this line
        emailButton.href = `mailto:?subject=Link to the map&body=${encodedUrl}`;

        // Show the modal
        modal.style.display = 'block';
    }

    document.getElementById('share').addEventListener('click', function () {
        openShareModal(view);
    });

    function loadExtentFromUrl(view) {
        console.log('Running loadExtentFromUrl function.');

        var url = new URL(window.location.href);
        var xmin = parseFloat(url.searchParams.get('xmin'));
        var ymin = parseFloat(url.searchParams.get('ymin'));
        var xmax = parseFloat(url.searchParams.get('xmax'));
        var ymax = parseFloat(url.searchParams.get('ymax'));

        console.log(`xmin: ${xmin}, ymin: ${ymin}, xmax: ${xmax}, ymax: ${ymax}`);

        if (!isNaN(xmin) && !isNaN(ymin) && !isNaN(xmax) && !isNaN(ymax)) {
            var extent = {
                xmin: xmin,
                ymin: ymin,
                xmax: xmax,
                ymax: ymax,
                spatialReference: view.spatialReference
            };
            console.log('Parsed extent:', extent);
            view.extent = extent;
        }
    }
    // Call the function passing the view object as an argument
    loadExtentFromUrl(view);


    // This code fixes the click problem for both sets of buttons and dropdown menus

    //window.onload = function () { // Ensure dropdowns and modals are hidden when page loads

        var layerDropdown = document.getElementById("layerDropdown");
        var maglassDropdown = document.getElementById("maglassDropdown");
        var coordinatesModal = document.getElementById("coordinatesModal");
        var popularPlacesModal = document.getElementById("popularPlacesModal");
        var LinkDropdown = document.getElementById("LinkDropdown");
        var shareModal = document.getElementById("Sharelinkmodal")
        var linkmodal = document.getElementById("helpmodal")

        layerDropdown.style.display = "none";
        maglassDropdown.style.display = "none";
        coordinatesModal.style.display = "none";
        popularPlacesModal.style.display = "none";
        LinkDropdown.style.display = "none";
        shareModal.style.display = "none";
        linkmodal.style.display = "none";

        // Event listener for the layer button click
        document.getElementById("layerBtn").addEventListener("click", function () {
            layerDropdown.style.display = layerDropdown.style.display === "none" ? "block" : "none";
        });

        // Event listener for the link button click
        document.getElementById("link").addEventListener("click", function () {
            LinkDropdown.style.display = LinkDropdown.style.display === "none" ? "block" : "none";
        });

        // Event listener for the maglass button click
        document.getElementById("maglass").addEventListener("click", function () {
            maglassDropdown.style.display = maglassDropdown.style.display === "none" ? "block" : "none";
        });

        // Event listener to hide the dropdown menus when clicking anywhere on the map
        document.addEventListener("click", function (event) {
            var layerDropdown = document.getElementById("layerDropdown");
            var maglassDropdown = document.getElementById("maglassDropdown");
            var LinkDropdown = document.getElementById("LinkDropdown")

            var layerButton = document.getElementById("layerBtn");
            var maglassButton = document.getElementById("maglass");
            var LinkButton = document.getElementById("link");

            // Make sure the dropdowns and buttons themselves can be clicked without hiding the dropdowns
            if (! layerDropdown.contains(event.target) && ! layerButton.contains(event.target)) {
                layerDropdown.style.display = "none";
            }

            if (! maglassDropdown.contains(event.target) && ! maglassButton.contains(event.target)) {
                maglassDropdown.style.display = "none";
            }

            if (! LinkDropdown.contains(event.target) && ! LinkButton.contains(event.target)) {
                LinkDropdown.style.display = "none";
            }


        });
    
});
}