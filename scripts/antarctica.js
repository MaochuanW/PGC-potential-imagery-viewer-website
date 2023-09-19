function login() {
  const keycloak = new Keycloak({
    realm: "pgc",
    "auth-server-url": "https://account.pgc.umn.edu/auth",
    "ssl-required": "external",
    clientId: "imagery-viewers",
    "public-client": true,
    "enable-cors": true,
    "cors-allowed-methods": "POST, PUT, DELETE, GET, HEAD",
    "cors-allowed-headers":
      "Access-Control-Allow-Origin, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization",
    "confidential-port": 0,
  });

  function refreshTokenIfNeeded() {
    if (window.keycloak.isTokenExpired()) {
      window.keycloak
        .updateToken(70) // Refresh the token immediately if it's expired
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
        setupMap(mapObj);

        loginButton.addEventListener("click", () => {
          keycloak.login();
        });

        continueButton.addEventListener("click", () => {
          modal.style.display = "none";
        });
      } else {
        window.keycloak = keycloak; // Assign keycloak to a global variable so it can be accessed later.
        console.log(authenticated ? "authenticated" : "not authenticated");
        setupMap(mapObj);

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

let url = new URL(window.location);
let pathname = url.pathname; // '/world.html'
let filename = pathname.split("/").pop(); // 'world.html'
let collection = filename.split(".")[0]; // 'world'
const mapObj = viewers[collection];
console.log(mapObj)

function setupMap(mapObj) {
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
    "esri/geometry/geometryEngine",
    "esri/geometry/projection",
    "esri/symbols/SimpleMarkerSymbol"
], function (esriConfig, Map, MapView, TileLayer, LayerList, Search, ScaleBar, ImageryTileLayer, ImageryLayer, Measurement, FeatureLayer, PopupTemplate, SimpleFillSymbol, SimpleLineSymbol, Color, Graphic, Query, GraphicsLayer, SpatialReference, TileInfo, CoordinateConversion, RasterStretchRenderer, AlgorithmicColorRamp, MultipartColorRamp, MapImageLayer, WMSLayer, Sketch, geometryEngine,projection,SimpleMarkerSymbol) {
    document.addEventListener("DOMContentLoaded", (event) => {
      view.when(function () {
        loadExtentFromUrl(view);
      });
    });

    esriConfig.request.interceptors.push({
      urls: ["https://web.overlord.pgc.umn.edu"],

      before: function (params) {
        if (window.keycloak.isTokenExpired()) {
          console.log("Token is expired, skipping request");
          params.requestOptions.body = ""; // Empty the body to effectively skip the request
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

    // Create the PopupTemplate
    const popupTemplatecomnap = { 
      title: "Information",
      content: [
          {
              type: "fields",
              fieldInfos: [
                  {
                      fieldName: "photo_url",
                      label: "URL for photo",
                      format: {
                          places: 0,
                          digitSeparator: true
                      }
                  },
                  {
                      fieldName: "webcam_url",
                      label: "Webcam URL",
                      format: {
                          places: 0,
                          digitSeparator: true
                      }
                  },
                  {
                      fieldName: "english_name",
                      label: "English Name",
                      format: {
                          places: 0,
                          digitSeparator: true
                      }
                  },
                  {
                      fieldName: "official_name",
                      label: "Official Name",
                      format: {
                          places: 0,
                          digitSeparator: true
                      }
                  }, 
                  {
                      fieldName: "seasonality",
                      label: "seasonality",
                      format: {
                          places: 0,
                          digitSeparator: true
                      }
                  },
                  {
                    fieldName: "status",
                    label: "status",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                  },
                  {
                    fieldName: "year_established",
                    label: "year established",
                    format: {
                        places: 0,
                        digitSeparator: true
                    }
                  },
              ]
          }
      ]
  };

    const comnapRenderer = {

      "type": "simple",
        "symbol": {
          "type": "picture-marker",
          "url": "http://static.arcgis.com/images/Symbols/NPS/npsPictograph_0231b.png",
          "width": "18px",
          "height": "18px"
        
      }
    }
    const antlabel = new MapImageLayer({
      url: "https://gis.ngdc.noaa.gov/arcgis/rest/services/antarctic/reference/MapServer",
      title: "Antarctica label",
    });
    const basemap = mapObj.layers.find(layer => layer.id === 'AntCompBaseMap')
    const AntCompBaseMap = new TileLayer({
      url: basemap.url,
      title: "Antarctica Composite Basemap",
      spatialReference: {
        wkid: 3031,
      },
    });

    let layer2 = new ImageryLayer({
      url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_ant/ImageServer",
      title: "Layer 2",
    });

    map.addMany([AntCompBaseMap, layer2, antlabel]); // Adding all three layers at once

    function ensureLabelOnTop() {
      map.remove(antlabel);
      map.add(antlabel);
    }

    document
      .getElementById("AntCompBaseMapCheckbox")
      .addEventListener("change", function () {
        if (this.checked) {
          AntCompBaseMap.visible = true;
        } else {
          AntCompBaseMap.visible = false;
        }
        ensureLabelOnTop();
      });

    document.getElementById("AntCompBaseMapCheckbox").checked = true;
    AntCompBaseMap.visible = true;

    document
      .getElementById("AntLabelCheckbox")
      .addEventListener("change", function () {
        if (this.checked) {
          antlabel.visible = true;
        } else {
          antlabel.visible = false;
        }
        ensureLabelOnTop();
      });

    document.getElementById("AntLabelCheckbox").checked = true;
    antlabel.visible = true;

    let layer1;

    document
      .getElementById("layer1Checkbox")
      .addEventListener("change", function () {
        if (this.checked) {
          layer1 = new TileLayer({
            url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_50k_topos/MapServer",
            title: "Layer 1",
          });
          addLayer(layer1, this);

          // Check the current zoom level
          if (view.zoom < 10) {
            view.goTo({
              center: [162.382828, -77.689443],
              zoom: 10,
            });
          }
        } else {
          map.remove(layer1);
          currentFreeLayer = null;
          currentCheckbox = null;
        }
        ensureLabelOnTop();
      });

    document
      .getElementById("layer2Checkbox")
      .addEventListener("change", function () {
        var layer3Checkbox = document.getElementById("layer3Checkbox");
        if (this.checked) {
          layer2.visible = true;
          map.add(layer2);

          if (layer3Checkbox.checked) {
            layer3Checkbox.checked = false;
            layer3.visible = false;
            map.remove(layer3);
          }
        } else {
          layer2.visible = false;
          map.remove(layer2);
        }
        ensureLabelOnTop();
      });

    document.getElementById("layer2Checkbox").checked = true;
    layer2.visible = true;

    document
      .getElementById("layer3Checkbox")
      .addEventListener("change", function () {
        var layer2Checkbox = document.getElementById("layer2Checkbox");
        if (this.checked) {
          layer3 = new ImageryLayer({
            url: mapObj.layersObj.ms.url,
            title: "Layer 3",
          });
          layer3.bandIds = [2, 1, 0];
          map.add(layer3);

          if (layer2Checkbox.checked) {
            layer2Checkbox.checked = false;
            layer2.visible = false;
            map.remove(layer2);
          }
        } else {
          layer3.visible = false;
          map.remove(layer3);
        }
        ensureLabelOnTop();
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
            fromColor: new Color([61, 1, 255]), // Blue
            toColor: new Color([255, 255, 255]), // White
            algorithm: "hsv", // This specifies how the intermediate colors will be calculated
          });
          const colorRamp2 = new AlgorithmicColorRamp({
            fromColor: new Color([255, 255, 255]), // White
            toColor: new Color([230, 0, 0]), // Red
            algorithm: "hsv", // This specifies how the intermediate colors will be calculated
          });

          // Combine the color ramps into a multipart color ramp
          const multipartColorRamp = new MultipartColorRamp({
            colorRamps: [colorRamp1, colorRamp2],
          });

          // Create a new stretch renderer using the color ramp
          const renderer = new RasterStretchRenderer({
            stretchType: "percent-clip",
            numStandardDeviations: 3,
            dra: true,
            min: 0,
            max: 255,
            colorRamp: multipartColorRamp, // Here we are using the colorRamp that we defined earlier
          });

          // Set the renderer on the layer
          layer4.renderer = renderer;

          addLayer(layer4, this);

          // Immediately zoom to the coordinates when layer is added
          if (view.zoom < 10) {
            view.goTo({
              // Define the longitude, latitude and zoom level
              center: [162.382828, -77.689443],
              zoom: 10,
            });
          }
        } else {
          // If the checkbox is not checked, remove the layer
          map.remove(layer4);
          currentFreeLayer = null;
          currentCheckbox = null;
        }
        ensureLabelOnTop();
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
          if (view.zoom < 5) {
            view.goTo({
              center: [166.666664, -90.8499966],
              zoom: 5,
            });
          }
        } else {
          // If the checkbox is not checked, remove the layer
          map.remove(layer5);
          currentFreeLayer = null;
          currentCheckbox = null;
        }
        ensureLabelOnTop();
      });

    let layer6;
    document
      .getElementById("layer7Checkbox")
      .addEventListener("change", function () {
        if (this.checked) {
          // If the checkbox is checked, show the layer
          layer6 = new TileLayer({
            url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_500k_sketch/MapServer",
            title: "Layer 6",
          });
          addLayer(layer6, this);

          // Zoom to the coordinates when layer is added
          view.goTo({
            center: [166.666664, -90.8499966],
            zoom: 5,
          });
        } else {
          // If the checkbox is not checked, remove the layer
          map.remove(layer6);
          currentFreeLayer = null;
          currentCheckbox = null;
        }
        ensureLabelOnTop();
      });

    let layer7;
    document
      .getElementById("ComnapCheckbox")
      .addEventListener("change", function () {
        if (this.checked) {
          // If the checkbox is checked, show the layer
          layer7 = new FeatureLayer({
            url: "https://overlord.pgc.umn.edu/arcgis/rest/services/reference/ant_comnap_antarctic_facilities/FeatureServer/0",
            popupTemplate: popupTemplatecomnap,
            renderer: comnapRenderer,
            title: "Layer 7",
          });
          addLayer(layer7, this);

          // Zoom to the coordinates when layer is added
          if (view.zoom < 5) {
            view.goTo({
              center: [166.666664, -90.8499966],
              zoom: 5,
            });
          }
        } else {
          // If the checkbox is not checked, remove the layer
          map.remove(layer7);
          currentFreeLayer = null;
          currentCheckbox = null;
        }
        ensureLabelOnTop();
      });

    const spatialReference = new SpatialReference({ wkid: 3031 });

    // Create LODs from level 0 to 24
    const tileInfo = TileInfo.create({ spatialReference, numLODs: 24 });

    const lods = tileInfo.lods;

    const view = new MapView({
      map: map,
      center: [166.666664, -90.8499966],
      zoom: 5,
      container: "viewDiv",
      spatialReference,
      constraints: {
        lods: lods,
        snapToZoom: true,
      },
    });

    var redCircleSymbol = new SimpleMarkerSymbol({
      color: [255, 0, 0, 0.5],
      style: "circle",
      size: "12px",
      outline: {
        color: [255, 0, 0],
        width: 1,
      },
    });

    let ccWidget = new CoordinateConversion({
      view: view,
      orientation: "expand-up",
      locationSymbol: redCircleSymbol,
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

    // // Smooth zoom effect using mouse scroll
    // let accumulatedDeltaY = 0;
    // let zooming = false;
    // let scrollDirection = null; // Keep track of scroll direction
    // let zoomController = new AbortController(); // Controller to abort zooming
    // const zoomThreshold = 50; // Adjust the scroll delta threshold for zoom action

    // view.on("mouse-wheel", function (event) {
    //   event.stopPropagation();
    //   event.preventDefault();

    //   const deltaY = event.deltaY;
    //   const zoomFactor = 1;
    //   // Adjust the zoom speed (smaller value for slower zoom-in)

    //   // Check if the scroll direction has changed
    //   const newScrollDirection = deltaY > 0 ? "down" : "up";
    //   if (scrollDirection && newScrollDirection !== scrollDirection) {
    //     zoomController.abort(); // Abort the ongoing zoom if scroll direction changes
    //     zoomController = new AbortController(); // Instantiate a new controller for the next zoom
    //     accumulatedDeltaY = deltaY; // Reset accumulatedDeltaY with the new deltaY
    //   } else {
    //     accumulatedDeltaY += deltaY; // Accumulate deltaY normally
    //   }
    //   scrollDirection = newScrollDirection; // Update the scroll direction

    //   if (!zooming && Math.abs(accumulatedDeltaY) >= zoomThreshold) {
    //     zooming = true;
    //     const zoomDirection = accumulatedDeltaY > 0 ? -1 : 1;
    //     const zoomLevel = view.zoom + zoomDirection * zoomFactor;

    //     view
    //       .goTo(
    //         {
    //           zoom: zoomLevel,
    //         },
    //         {
    //           duration: 150, // Adjust the animation duration as needed
    //           easing: "linear", // Use linear easing for smoother zoom
    //           signal: zoomController.signal, // Use signal to potentially cancel ongoing zoom actions
    //         }
    //       )
    //       .then(() => {
    //         zooming = false;
    //       })
    //       .catch((error) => {
    //         if (error.name === "AbortError") {
    //           // If it's an AbortError, we expect it, do nothing
    //         } else {
    //           console.error(error);
    //         }
    //         zooming = false;
    //       });

    //     accumulatedDeltaY = 0;
    //   }
    // });

    document.getElementById("zoomInBtn").addEventListener("click", function () {
      let zoomLevel = view.zoom + 1;
      view.goTo({ zoom: zoomLevel });
    });

    document
      .getElementById("zoomOutBtn")
      .addEventListener("click", function () {
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
            // Project the geometry to EPSG:4326
            const geoPolygon = projection.project(polygon, { wkid: 4326 });
            
            // Calculate geodesic area
            const geodesicArea = geometryEngine.geodesicArea(geoPolygon, "square-kilometers");
            
            measurements.innerHTML =
              "<b>Geodesic area</b>: " + geodesicArea.toFixed(2) + " km\xB2";
          }
          
          function getLength(line) {
            // Project the geometry to EPSG:4326
            const geoPolyline = projection.project(line, { wkid: 4326 });
            
            // Calculate geodesic length
            const geodesicLength = geometryEngine.geodesicLength(geoPolyline, "kilometers");
            
            measurements.innerHTML =
              "<b>Geodesic length</b>: " + geodesicLength.toFixed(2) + " km";
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
                <div style="font-family: Arial, sans-serif; color: #333; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9;  align-items: center;">
                    <div style="display: flex; flex-direction: column; width: 100%; margin-bottom: 10px;">
                        <div style="background-color: #00897b; color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Sensor</p>
                            <p style="margin: 0; font-size: 16px; text-align: center;">${sensorLabel}</p>
                        </div>
                        <div style="background-color: #d81b60; color: #fff; padding: 15px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Date</p>\
                            <p style="margin: 0; font-size: 16px; text-align: center;">${
                              attributes.acqdate
                            }</p>
                        </div>
                    </div>
                    <div style="background-color: #0050b3; color: #fff; padding: 10px; border-radius: 5px; margin-bottom: 10px; width: 94%;">
                        <p style="margin: 0; font-size: 14px; text-align: center;">Catalog ID</p>
                        <a href="${
                          attributes.browseurl
                        }" target="_blank" style="color: #fff; text-decoration: underline; font-size: 16px; display: block; text-align: center;">${
            attributes.cat_id
          }</a>

                    </div>
                    <div style="display: flex; flex-direction: column; width: 100%;">
                        <div style="background-color: #fc6600; color: #fff; padding: 13px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Sun Elevation</p>
                            <p style="margin: 0; font-size: 16px; text-align: center;">${parseFloat(
                              attributes.sun_elev
                            ).toFixed(2)}%</p>
                        </div>
                        <div style="background-color: #6d4c41; color: #fff; padding: 13px; border-radius: 5px; margin-bottom: 0px;">
                            <p style="margin: 0; font-size: 14px; text-align: center;">Off-Nadir Angle</p>
                            <p style="margin: 0; font-size: 16px; text-align: center;">${parseFloat(
                              attributes.off_nadir
                            ).toFixed(2)}%</p>
                        </div>
                    </div>
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
    const measurementWidget = new Measurement({ view: view });

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
    const scaleBar = new ScaleBar({ view: view, unit: "dual" });

    // Add the ScaleBar widget to the bottom left of the view
    view.ui.add(scaleBar, { position: "bottom-left" });

    // Remove Zoom widget from the view
    view.ui.remove("zoom");

    const layerList = new LayerList({ view: view });
    view.ui.add(layerList, "top-right");
    view.ui.remove(layerList);

    const searchWidget = new Search({ view: view });
    view.ui.add(searchWidget, { position: "top-right" });
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
        id: "mcmurdo",
        coordinates: [166.66664, -77.849996],
        zoomLevel: 15,
      },
      {
        id: "amundson",
        coordinates: [-90.0, -139.2666656],
        zoomLevel: 15,
      },
      {
        id: "palmer",
        coordinates: [-64.053056, -64.774167],
        zoomLevel: 15,
      },
      {
        id: "byrdcamp",
        coordinates: [-119.5333312, -80.0166666],
        zoomLevel: 15,
      },
      {
        id: "shackleton",
        coordinates: [-176.333332, -84.583331],
        zoomLevel: 13,
      },
      {
        id: "WAIS",
        coordinates: [-112.086389, -79.467472],
        zoomLevel: 15,
      },
      {
        id: "peninsula",
        coordinates: [-63, -66],
        zoomLevel: 7,
      },
      {
        id: "anvers",
        coordinates: [-63.58, -64.55],
        zoomLevel: 12,
      },
      {
        id: "marie",
        coordinates: [-139.1, -75.183],
        zoomLevel: 15,
      },
      {
        id: "dryvalley",
        coordinates: [164.731711, -76.441301],
        zoomLevel: 8,
      },
      {
        id: "pine",
        coordinates: [-100.0, -75.16666],
        zoomLevel: 8,
      },
      {
        id: "rossisland",
        coordinates: [166.949996, -77.5166],
        zoomLevel: 10,
      },
      {
        id: "taylor",
        coordinates: [163.0, -77.6166642],
        zoomLevel: 10,
      },
      {
        id: "victoria",
        coordinates: [158.871909, -74.6591],
        zoomLevel: 9,
      },
      {
        id: "vinson",
        coordinates: [-85.617147, -78.525483],
        zoomLevel: 13,
      },
    ];

    // Function to zoom to popular place
    function zoomToPopularPlace(coordinates, zoomLevel) {
      console.log(coordinates);
      view.goTo({ center: coordinates, zoom: zoomLevel });
      closeModal("popularPlacesModal");
    }

    // Attach event listeners to popular places
    popularPlaces.forEach((place) => {
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

      return { xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax };
    }

    // Function to create the shareable URL
    function createShareableUrl(map) {
      var state = getCurrentState(map);
      var baseUrl = window.location.href.split("?")[0]; // remove existing parameters
      var url = new URL(baseUrl);

      url.searchParams.append("xmin", state.xmin);
      url.searchParams.append("ymin", state.ymin);
      url.searchParams.append("xmax", state.xmax);
      url.searchParams.append("ymax", state.ymax);

      return url.toString();
    }

    function updateUrl(view) {
      var newUrl = createShareableUrl(view);
      window.history.pushState({}, "", newUrl);
    }

    // Add event listener for 'extent' property
    view.watch("extent", function (newValue, oldValue, property, object) {
      updateUrl(object);
    });

    function openShareModal(map) {
      var url = createShareableUrl(map);

      // Display the URL in the modal
      var modal = document.getElementById("Sharelinkmodal");
      var urlDisplay = modal.querySelector(".url-display"); // Add a selector for where to display the URL
      urlDisplay.innerHTML = `<a href="${url}" target="_blank">${url}</a>`;
      // Make it a clickable link

      // Set the href for the email button
      var emailButton = document.getElementById("emailButton");
      var encodedUrl = encodeURIComponent(url);
      emailButton.href = `mailto:?subject=Link to the map&body=${encodedUrl}`;

      // Show the modal
      modal.style.display = "block";
    }

    document.getElementById("share").addEventListener("click", function () {
      openShareModal(view);
    });

    function loadExtentFromUrl(view) {
      console.log("Running loadExtentFromUrl function.");

      var url = new URL(window.location.href);
      var xmin = parseFloat(url.searchParams.get("xmin"));
      var ymin = parseFloat(url.searchParams.get("ymin"));
      var xmax = parseFloat(url.searchParams.get("xmax"));
      var ymax = parseFloat(url.searchParams.get("ymax"));

      console.log(`xmin: ${xmin}, ymin: ${ymin}, xmax: ${xmax}, ymax: ${ymax}`);

      if (!isNaN(xmin) && !isNaN(ymin) && !isNaN(xmax) && !isNaN(ymax)) {
        var extent = {
          xmin: xmin,
          ymin: ymin,
          xmax: xmax,
          ymax: ymax,
          spatialReference: view.spatialReference,
        };
        console.log("Parsed extent:", extent);
        view.extent = extent;
      }
    }
    // Call the function passing the view object as an argument
    loadExtentFromUrl(view);

    // This code fixes the click problem for both sets of buttons and dropdown menus

    //window.onload = function () {
      // Ensure dropdowns and modals are hidden when page loads

      var layerDropdown = document.getElementById("layerDropdown");
      var maglassDropdown = document.getElementById("maglassDropdown");
      var coordinatesModal = document.getElementById("coordinatesModal");
      var popularPlacesModal = document.getElementById("popularPlacesModal");
      var LinkDropdown = document.getElementById("LinkDropdown");
      var shareModal = document.getElementById("Sharelinkmodal");
      var linkmodal = document.getElementById("helpmodal");

      layerDropdown.style.display = "none";
      maglassDropdown.style.display = "none";
      coordinatesModal.style.display = "none";
      popularPlacesModal.style.display = "none";
      LinkDropdown.style.display = "none";
      shareModal.style.display = "none";
      linkmodal.style.display = "none";

      // Event listener for the layer button click
      document
        .getElementById("layerBtn")
        .addEventListener("click", function () {
          layerDropdown.style.display =
            layerDropdown.style.display === "none" ? "block" : "none";
        });

      // Event listener for the link button click
      document.getElementById("link").addEventListener("click", function () {
        LinkDropdown.style.display =
          LinkDropdown.style.display === "none" ? "block" : "none";
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
        var LinkDropdown = document.getElementById("LinkDropdown");

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

        if (
          !LinkDropdown.contains(event.target) &&
          !LinkButton.contains(event.target)
        ) {
          LinkDropdown.style.display = "none";
        }
      });
    
  });
}
