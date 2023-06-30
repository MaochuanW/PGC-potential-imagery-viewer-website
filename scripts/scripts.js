// function login() {
//   const keycloak = new Keycloak({
//     realm: "pgc",
//     "auth-server-url": "https://account.pgc.umn.edu/auth",
//     "ssl-required": "external",
//     clientId: "imagery-viewers",
//     "public-client": true,
//     "enable-cors": true,
//     "cors-allowed-methods": "POST, PUT, DELETE, GET, HEAD",
//     "cors-allowed-headers":
//       "Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
//     "confidential-port": 0,
//   });

//   keycloak
//     .init({ checkLoginIframe: false })
//     .then((authenticated) => {
//       if (!authenticated) {
//         keycloak.login();
//       } else {
//         window.keycloak = keycloak; // Assign keycloak to a global variable so it can be accessed later.
//         console.log(authenticated ? "authenticated" : "not authenticated");

//         // Refresh the token every minute if it's valid
//         setInterval(() => {
//           if (!window.keycloak.isTokenExpired()) {
//             window.keycloak
//               .updateToken(30)
//               .then((refreshed) => {
//                 console.log("Token refreshed successfully");
//               })
//               .catch(() => {
//                 console.log("Error updating token");
//               });
//           }
//         }, 60000); // 60000 milliseconds = 1 minute
//       }
//     })
//     .catch(() => {
//       console.log("failed to initialize");
//     });
// }

// login(); 

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
  "esri/rest/support/MultipartColorRamp"
], function (
  esriConfig,
  Map,
  MapView,
  TileLayer,
  LayerList,
  Search,
  ScaleBar,
  ImageryTileLayer,
  ImageryLayer,
  Measurement,
  FeatureLayer,
  PopupTemplate,
  SimpleFillSymbol,
  SimpleLineSymbol,
  Color,
  Graphic,
  Query,
  GraphicsLayer,
  SpatialReference,
  TileInfo,
  CoordinateConversion,
  RasterStretchRenderer,
  AlgorithmicColorRamp,
  MultipartColorRamp
) {
  esriConfig.apiKey =
    "AAPK5b378c5a659a47668b94785aee29f811CspcF_qvBERUKbwD9AiaNB94Ie4mbJyNQAgY6gskPznuqWXfm7PU_M1CZJdpDT3i";
    document.addEventListener('DOMContentLoaded', (event) => {
      view.when(function(){
          loadExtentFromUrl(view);
      });
    });

  esriConfig.request.interceptors.push({
    urls: [
      "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_ant/ImageServer",
      "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_mul_ant/ImageServer",
      "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_ant/FeatureServer/0",
      "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_mul_ant/FeatureServer/0",
      "https://web.overlord.pgc.umn.edu/arcgis/rest/services/elevation/ncalm_mdv_lidar_201415_1m/ImageServer"
    ],

    // use the Before method to add token to query
    before: function (params) {
      // Check if the token is expired or not
      if (window.keycloak.isTokenExpired()) {
        console.log("Token is expired");
      } else {
        params.requestOptions.headers = {
          Authorization: "Bearer " + window.keycloak.token,
        };
      }
    },
  });


let currentFreeLayer; // This will keep track of the current layer
let currentCheckbox; // This will keep track of the current checkbox

function addLayer(layer, checkbox) {
    // If there is a current Free layer, remove it from the map
    if (currentFreeLayer) {
        map.remove(currentFreeLayer);
        // Uncheck the current checkbox
        if (currentCheckbox) {
            currentCheckbox.checked = false;
        }
    }

    // Add the new layer to the map and set it as the current layer
    map.add(layer);
    currentFreeLayer = layer;
    // Set the current checkbox
    currentCheckbox = checkbox;
}

  const map = new Map({});
  const AntCompBaseMap = new TileLayer({
    url: "https://overlord.pgc.umn.edu/arcgis/rest/services/imagery/ant_pgc_composite_mosaic/MapServer",
    title: "Antarctica Composite Basemap",
    spatialReference: {
      wkid: 3031,
    },
  });
  map.add(AntCompBaseMap);

  document
    .getElementById("AntCompBaseMapCheckbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        AntCompBaseMap.visible = true;
      } else {
        // If the checkbox is not checked, hide the layer
        AntCompBaseMap.visible = false;
      }
    });

  // Set the checkbox to be checked by default
  document.getElementById("AntCompBaseMapCheckbox").checked = true;
  AntCompBaseMap.visible = true;

  let layer1, layer2;

  document
    .getElementById("layer1Checkbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        layer1 = new TileLayer({
          url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_50k_topos/MapServer",
          title: "Layer 1",
        });
        addLayer(layer1, this);
        
        // Zoom to the coordinates when layer is added
        view.goTo({
          center: [162.382828, -77.689443],
          zoom: 10
        });
      } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer1);
        currentfreeLayer = null;
        currentCheckbox = null;
      }
    });

  document
    .getElementById("layer2Checkbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        layer2 = new ImageryLayer({
          url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_ant/ImageServer",
          title: "Layer 2",
        });
        map.add(layer2);

        // Uncheck and remove layer3 if it's currently displayed
        var layer3Checkbox = document.getElementById("layer3Checkbox");
        if (layer3Checkbox.checked) {
          layer3Checkbox.checked = false;
          map.remove(layer3);
        }
      } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer2);
      }
    });

  document
    .getElementById("layer3Checkbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        layer3 = new ImageryLayer({
          url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_mul_ant/ImageServer",
          title: "Layer 3",
        });
        layer3.bandIds = [2, 1, 0];
        map.add(layer3);

        // Uncheck and remove layer2 if it's currently displayed
        var layer2Checkbox = document.getElementById("layer2Checkbox");
        if (layer2Checkbox.checked) {
          layer2Checkbox.checked = false;
          map.remove(layer2);
        }
      } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer3);
      }
    });

    
    let layer4;

    document
        .getElementById("layer4Checkbox")
        .addEventListener("change", function () {
          if (this.checked) {
            // If the checkbox is checked, show the layer
            layer4 = new ImageryLayer({
              url: "https://overlord.pgc.umn.edu/arcgis/rest/services/elevation/ncalm_mdv_lidar_201415_1m/ImageServer",
              title: "Layer 4",
            });
    
            // Define multiple color ramps
            const colorRamp1 = new AlgorithmicColorRamp({
              fromColor: new Color([61, 1, 255]),  // Blue
              toColor: new Color([255, 255, 255]), // White
              algorithm: "hsv" // This specifies how the intermediate colors will be calculated
            });
            const colorRamp2 = new AlgorithmicColorRamp({
              fromColor: new Color([255, 255, 255]),  // White
              toColor: new Color([230, 0, 0]),       // Red
              algorithm: "hsv" // This specifies how the intermediate colors will be calculated
            });
    
            // Combine the color ramps into a multipart color ramp
            const multipartColorRamp = new MultipartColorRamp({
              colorRamps: [colorRamp1, colorRamp2]
            });
    
            // Create a new stretch renderer using the color ramp
            const renderer = new RasterStretchRenderer({
              stretchType: "percent-clip",
              numStandardDeviations: 3,
              dra: true,
              min: 0,
              max: 255,
              colorRamp: multipartColorRamp  // Here we are using the colorRamp that we defined earlier
            });
    
            // Set the renderer on the layer
            layer4.renderer = renderer;
    
            addLayer(layer4, this);
    
            // Immediately zoom to the coordinates when layer is added
            view.goTo({
              // Define the longitude, latitude and zoom level
              center: [162.382828, -77.689443],
              zoom: 10
            });
            
          } else {
            // If the checkbox is not checked, remove the layer
            map.remove(layer4);
            currentFreeLayer = null;
            currentCheckbox = null;
          }
        });
    
    let layer5;
    document
    .getElementById("layer5Checkbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        layer5 = new TileLayer({
          url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_250k_topos/MapServer",
          title: "Layer 5",
        });
        addLayer(layer5, this);
        
        // Zoom to the coordinates when layer is added
        view.goTo({
          center: [166.666664, -90.8499966],
          zoom: 5
        });
      } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer5);
        currentFreeLayer = null;
        currentCheckbox = null;
      }
    });

    let layer6;
    document
    .getElementById("layer6Checkbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        layer6 = new TileLayer({
          url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_500k_topos/MapServer",
          title: "Layer 6",
        });
        addLayer(layer6, this);
        
        // Zoom to the coordinates when layer is added
        view.goTo({
          center: [166.666664, -90.8499966],
          zoom: 5
        });
      } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer6);
        currentFreeLayer = null;
        currentCheckbox = null;
      }
    });
    
    let layer7;
    document
    .getElementById("layer7Checkbox")
    .addEventListener("change", function () {
      if (this.checked) {
        // If the checkbox is checked, show the layer
        layer7 = new TileLayer({
          url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_500k_sketch/MapServer",
          title: "Layer 7",
        });
        addLayer(layer7, this);
        
        // Zoom to the coordinates when layer is added
        view.goTo({
          center: [166.666664, -90.8499966],
          zoom: 5
        });
      } else {
        // If the checkbox is not checked, remove the layer
        map.remove(layer7);
        currentFreeLayer = null;
        currentCheckbox = null;
      }
    });
    



  const spatialReference = new SpatialReference({
    wkid: 3031,
  });

  // Create LODs from level 0 to 24
  const tileInfo = TileInfo.create({
    spatialReference,
    numLODs: 24,
  });

  const lods = tileInfo.lods;

  const view = new MapView({
    map: map,
    center: [166.666664, -90.8499966],
    zoom: 4,
    container: "viewDiv",
    spatialReference,
    constraints: {
      lods: lods,
      snapToZoom: false,
    },
  });

  let ccWidget = new CoordinateConversion({
    view: view,
    orientation: "expand-up",
  });

  window.openCoordinateWidget = openCoordinateWidget;

  function openCoordinateWidget() {
    if (!view.ui.find(ccWidget)) {
      view.ui.add(ccWidget, "manual");
      ccWidget.container.id = "coordinate-widget";

      setTimeout(() => {
        document
          .querySelector("#coordinate-widget .esri-widget--button")
          .click();
      }, 1);
    }
  }

// Smooth zoom effect using mouse scroll
let accumulatedDeltaY = 0;
let zooming = false;
let scrollDirection = null; // Keep track of scroll direction
let zoomController = new AbortController(); // Controller to abort zooming
const zoomThreshold = 50; // Adjust the scroll delta threshold for zoom action

view.on("mouse-wheel", function (event) {
  event.stopPropagation();
  event.preventDefault();

  const deltaY = event.deltaY;
  const zoomFactor = 1; // Adjust the zoom speed (smaller value for slower zoom-in)

  // Check if the scroll direction has changed
  const newScrollDirection = deltaY > 0 ? 'down' : 'up';
  if (scrollDirection && newScrollDirection !== scrollDirection) {
    zoomController.abort(); // Abort the ongoing zoom if scroll direction changes
    zoomController = new AbortController(); // Instantiate a new controller for the next zoom
    accumulatedDeltaY = deltaY; // Reset accumulatedDeltaY with the new deltaY
  } else {
    accumulatedDeltaY += deltaY; // Accumulate deltaY normally
  }
  scrollDirection = newScrollDirection; // Update the scroll direction

  if (!zooming && Math.abs(accumulatedDeltaY) >= zoomThreshold) {
    zooming = true;
    const zoomDirection = accumulatedDeltaY > 0 ? -1 : 1;
    const zoomLevel = view.zoom + zoomDirection * zoomFactor;

    view
      .goTo({
        zoom: zoomLevel,
      }, {
        duration: 150, // Adjust the animation duration as needed
        easing: "linear", // Use linear easing for smoother zoom
        signal: zoomController.signal, // Use signal to potentially cancel ongoing zoom actions
      })
      .then(() => {
        zooming = false;
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          // If it's an AbortError, we expect it, do nothing
        } else {
          console.error(error);
        }
        zooming = false;
      });

      accumulatedDeltaY = 0;
    }
  });

  document.getElementById("zoomInBtn").addEventListener("click", function () {
    let zoomLevel = view.zoom + 1;
    view.goTo({ zoom: zoomLevel });
  });

  document.getElementById("zoomOutBtn").addEventListener("click", function () {
    let zoomLevel = view.zoom - 1;
    view.goTo({ zoom: zoomLevel });
  });

  // Create the panchromatic cutline layer
  var panchromaticCutlineLayer = new FeatureLayer({
    url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_ant/FeatureServer/0",
  });

  // Create the multispectral cutline layer
  var multispectralCutlineLayer = new FeatureLayer({
    url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_mul_ant/FeatureServer/0",
  });

  // Variable to keep track of currently selected layer. Initially, it's the panchromaticCutlineLayer
  var currentLayer = panchromaticCutlineLayer;

  // Get checkboxes for layer selection
  var layer2Checkbox = document.getElementById("layer2Checkbox");
  var layer3Checkbox = document.getElementById("layer3Checkbox");

  // Event listener for layer2Checkbox (Panchromatic)
  layer2Checkbox.addEventListener("change", function () {
    if (this.checked) {
      // If layer2Checkbox is checked, select panchromatic layer and uncheck layer3Checkbox
      currentLayer = panchromaticCutlineLayer;
      layer3Checkbox.checked = false;
    } else {
      // If layer2Checkbox is unchecked, deselect the layer
      currentLayer = null;
    }

    // Update layer visibility
    panchromaticCutlineLayer.visible = this.checked;
    multispectralCutlineLayer.visible = layer3Checkbox.checked;
  });

  // Event listener for layer3Checkbox (Multispectral)
  layer3Checkbox.addEventListener("change", function () {
    if (this.checked) {
      // If layer3Checkbox is checked, select multispectral layer and uncheck layer2Checkbox
      currentLayer = multispectralCutlineLayer;
      layer2Checkbox.checked = false;
    } else {
      // If layer3Checkbox is unchecked, deselect the layer
      currentLayer = null;
    }

    // Update layer visibility
    panchromaticCutlineLayer.visible = layer2Checkbox.checked;
    multispectralCutlineLayer.visible = this.checked;
  });

  // Add event listener to capture map clicks
  view.on("click", function (event) {
    // Check if the measurement tool is active
    var isMeasurementToolActive = measurementWidget.activeTool !== null;

    // Call cutline function with the clicked feature and currentLayer
    // ONLY IF the measurement tool is not active
    if (!isMeasurementToolActive && currentLayer) {
      cutline(event.mapPoint, currentLayer);
    }
  });

  // Function that delete cutline and popup window when user click outside map frame
  var viewContainer = view.container;

  document.addEventListener("click", function (event) {
    var isClickInside = viewContainer.contains(event.target);

    if (!isClickInside) {
      view.popup.close();
    }
  });

  view.popup.watch("visible", function (newValue) {
    if (!newValue) {
      // If the popup is not visible...
      view.graphics.removeAll(); // Remove all graphics from the view
    }
  });

  function cutline(mapPoint, currentLayer) {
    // Create cutline symbol
    var cutlinePoly = new SimpleFillSymbol({
      style: "solid",
      color: [0, 0, 0, 0],
      outline: new SimpleLineSymbol({
        style: "solid",
        color: [0, 0, 0],
        width: 1,
      }),
    });

    // Create the query
    var query = currentLayer.createQuery();
    query.geometry = mapPoint;
    query.outFields = ["*"];
    query.returnGeometry = true;

    // Create the popup template
    var popupTemplate = {
      title: "Imagery Information",
      content: function (feature) {
        // Get the field values
        var attributes = feature.graphic.attributes;

        // Map sensor values to labels
        var sensorLabels = {
          WV01: "WorldView-1",
          WV02: "WorldView-2",
          WV03: "WorldView-3",
          QB02: "QuickBird",
          GE01: "GeoEye-1",
        };
        var sensorLabel = sensorLabels[attributes.sensor];

        // Build the content string
        var content = `
                <div style="font-size: 16px; color: black;">
                <p><b>Catalog ID:</b> <a href="${attributes.browseurl}" target="_blank" style="color: blue;">${attributes.cat_id}</a></p>
                <p><b>Sensor:</b> ${sensorLabel}</p>
                <p><b>Date:</b> ${attributes.acqdate}</p>
                <p><b>Sun Elevation:</b> ${attributes.sun_elev}</p>
                <p><b>Off-Nadir Angle:</b> ${attributes.off_nadir}</p>
                </div>
                `;

        return content;
      },
    };

    // Execute the query
    currentLayer.queryFeatures(query).then(function (result) {
      if (result.features.length > 0) {
        // Clear existing graphics before adding new ones
        view.graphics.removeAll();
        result.features.forEach(function (feature) {
          feature.symbol = cutlinePoly;
          var graphic = new Graphic({
            geometry: feature.geometry,
            symbol: feature.symbol,
            attributes: feature.attributes,
            popupTemplate: popupTemplate,
          });
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
  const measurementWidget = new Measurement({
    view: view,
  });

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
  rulerButton.addEventListener("click", function () {
    // Toggle the visibility of the toolbar div
    toolbarDiv.classList.toggle("show");
  });

  document.querySelector("#ruler").addEventListener("click", function () {
    let tooltipText = this.querySelector(".tooltip-text");
    tooltipText.style.visibility = "hidden";
  });

  // Create a ScaleBar widget
  const scaleBar = new ScaleBar({
    view: view,
    unit: "dual",
  });

  // Add the ScaleBar widget to the bottom left of the view
  view.ui.add(scaleBar, {
    position: "bottom-left",
  });

  // Remove Zoom widget from the view
  view.ui.remove("zoom");

  const layerList = new LayerList({ view: view });
  view.ui.add(layerList, "top-right");
  view.ui.remove(layerList);

  const searchWidget = new Search({ view: view });
  view.ui.add(searchWidget, { position: "top-right" });
  // Remove the LayerList widget from the UI
  //view.ui.remove(layerList);

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

  // Function to zoom to popular place
  function zoomToPopularPlace(coordinates) {
    console.log(coordinates);
    view.goTo({ center: coordinates, zoom: 15 });
    closeModal("popularPlacesModal");
  }
  // Attach toggle popular place list function to button click event
  document.getElementById("buck").addEventListener("click", function () {
    zoomToPopularPlace([-0.1411, 51.501]);
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

    return { xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax };
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

  function openShareModal(map) {
    var url = createShareableUrl(map);

    // Display the URL in the modal
    var modal = document.getElementById('Sharelinkmodal');
    var urlDisplay = modal.querySelector('.url-display'); // Add a selector for where to display the URL
    urlDisplay.innerHTML = `<a href="${url}" target="_blank">${url}</a>`; // Make it a clickable link

      // Set the href for the email button
      var emailButton = document.getElementById('emailButton');
      var encodedUrl = encodeURIComponent(url);  // Add this line
      emailButton.href = `mailto:?subject=Link to the map&body=${encodedUrl}`;

    // Show the modal
    modal.style.display = 'block';
  }

  document.getElementById('share').addEventListener('click', function() {
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

  window.onload = function () {
    // Ensure dropdowns and modals are hidden when page loads

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
      layerDropdown.style.display =
        layerDropdown.style.display === "none" ? "block" : "none";
    });

    // Event listener for the link button click
    document.getElementById("link").addEventListener("click", function () {
      LinkDropdown.style.display = 
        LinkDropdown.style.display === "none"? "block" : "none";
    });

    // Event listener for the maglass button click
    document.getElementById("maglass").addEventListener("click", function () {
      maglassDropdown.style.display =
        maglassDropdown.style.display === "none" ? "block" : "none";
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
      if (
        !layerDropdown.contains(event.target) &&
        !layerButton.contains(event.target)
      ) {
        layerDropdown.style.display = "none";
      }

      if (
        !maglassDropdown.contains(event.target) &&
        !maglassButton.contains(event.target)
      ) {
        maglassDropdown.style.display = "none";
      }

      if(
        !LinkDropdown.contains(event.target) &&
        !LinkButton.contains(event.target)
      ) {
        LinkDropdown.style.display = "none";
      }


    });
  };
});


