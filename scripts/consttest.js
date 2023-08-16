const viewers = {
  antarctica: {
    layersObj: {
        ms: {
            type: 'Tilelayer',
            url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_mul_ant/ImageServer",
            title: "Multispectral Mosaic"
        },
        pan: {
            type: 'Tilelayer',
            url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_mul_ant/ImageServer",
            title: "Multispectral Mosaic"
        },
        basemap: {
            type: 'Tilelayer',
            url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_mul_ant/ImageServer",
            title: "Multispectral Mosaic"
        }
    },
    layers: [
      {
        id: "AntCompBaseMap",
        type: "TileLayer",
        url: "https://overlord.pgc.umn.edu/arcgis/rest/services/imagery/ant_pgc_composite_mosaic/MapServer",
        title: "Antarctica Composite Basemap",
      },
      {
        id: "layer2",
        type: "ImageryLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_ant/ImageServer",
        title: "Layer 2",
      },
      {
        id: "antlabel",
        type: "MapImageLayer",
        url: "https://gis.ngdc.noaa.gov/arcgis/rest/services/antarctic/reference/MapServer",
        title: "Antarctica label",
      },
      {
        id: "layer3",
        type: "ImageryLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_mul_ant/ImageServer",
        title: "Layer 3",
      },
      {
        id: "layer4",
        type: "ImageryLayer",
        url: "https://overlord.pgc.umn.edu/arcgis/rest/services/elevation/ncalm_mdv_lidar_201415_1m/ImageServer",
        title: "Layer 4",
      },
      {
        id: "layer5",
        type: "TileLayer",
        url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_250k_topos/MapServer",
        title: "Layer 5",
      },
      {
        id: "layer6",
        type: "TileLayer",
        url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_500k_topos/MapServer",
        title: "Layer 6",
      },
      {
        id: "layer7",
        type: "TileLayer",
        url: "https://overlord.pgc.umn.edu/arcgis/rest/services/maps/ant_usgs_500k_sketch/MapServer",
        title: "Layer 7",
      },
      {
        id: "panchromaticCutlineLayer",
        type: "FeatureLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_ant/FeatureServer/0",
        visible: false,
      },
      {
        id: "multispectralCutlineLayer",
        type: "FeatureLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_mul_ant/FeatureServer/0",
        title: "Flightline Layer",
        visible: false,
      },
    ],

    spatialReference: {
      wkid: 3031,
    },

    popularPlaces: [
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
    ],
  },

  arctic: {
    layers: [
      {
        id: "labelname",
        type: "MapImageLayer",
        url: "https://gis.ngdc.noaa.gov/arcgis/rest/services/arctic_ps/reference/MapServer",
        title: "country names",
      },
      {
        id: "arcticDEMbasemap",
        type: "TileLayer",
        url: "https://services.arcgisonline.com/arcgis/rest/services/Polar/Arctic_Imagery/MapServer",
        title: "ArcticDEM Basemap",
      },
      {
        id: "panchromaticLayer",
        type: "ImageryLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_arc/ImageServer",
        title: "Panchromatic Layer",
        visible: true,
      },
      {
        id: "panchromaticCutlineLayer",
        type: "FeatureLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_arc/FeatureServer/0",
        visible: false,
      },
      {
        id: "flightlineLayer",
        type: "FeatureLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/reference/ak_usgs_ahap_aerial_index/FeatureServer/1",
        title: "Flightline Layer",
        visible: false,
      },
    ],

    spatialReference: {
      wkid: 5936,
    },

    popularPlaces: [
      {
        id: "toolik",
        coordinates: [-149.59427, 68.62765],
        zoomLevel: 15,
      },
      {
        id: "thule",
        coordinates: [-68.71456, 76.52995],
        zoomLevel: 13,
      },
      {
        id: "raven",
        coordinates: [-46.3, 66.5],
        zoomLevel: 12,
      },
      {
        id: "neem",
        coordinates: [-50.0, 79.0],
        zoomLevel: 12,
      },
      {
        id: "summit",
        coordinates: [-38.46041, 72.57969],
        zoomLevel: 12,
      },
      {
        id: "barrow",
        coordinates: [-156.78861, 71.29056],
        zoomLevel: 14,
      },
      {
        id: "northslope",
        coordinates: [-153.82207, 69.53351],
        zoomLevel: 8,
      },
      {
        id: "southeast",
        coordinates: [-135.97524, 57.82791],
        zoomLevel: 7,
      },
      {
        id: "kangerlussuaq",
        coordinates: [-50.69134, 67.00868],
        zoomLevel: 14,
      },
      {
        id: "helheim",
        coordinates: [-38.199999, 66.3499986],
        zoomLevel: 11,
      },
      {
        id: "jakobshavn",
        coordinates: [-49.54602, 69.12016],
        zoomLevel: 11,
      },
      {
        id: "petermann",
        coordinates: [-59.4999, 80.49999],
        zoomLevel: 11,
      },
      {
        id: "baffin",
        coordinates: [-69.67582, 67.86153],
        zoomLevel: 9,
      },
      {
        id: "svalbard",
        coordinates: [20.34933, 78.71985],
        zoomLevel: 13,
      },
    ],
  },
  world: {
    layers: [
      {
        id: "labelbasemap",
        type: "TileLayer",
        url: "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",
        title: "label basemap",
      },
      {
        id: "worldbasemap",
        type: "TileLayer",
        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
        title: "world Basemap",
      },
      {
        id: "hmaL8rgb",
        type: "ImageryLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/md_pgc_comm_opt_mono_mosaic_pan_hma/ImageServer",
        title: "hmaL8rgb",
      },
      {
        id: "panchromaticCutlineLayer",
        type: "FeatureLayer",
        url: "https://web.overlord.pgc.umn.edu/arcgis/rest/services/fridge/cut_pgc_comm_opt_mono_mosaic_pan_hma/FeatureServer/0",
      },
    ],

    spatialReference: {
      wkid: 3857,
    },

    popularPlaces: [
      {
        id: "kathmandu",
        coordinates: [85.3206, 27.70169],
        zoomLevel: 13,
      },
      {
        id: "southcamp",
        coordinates: [86.851323, 28.14277],
        zoomLevel: 13,
      },
      {
        id: "mounteverest",
        coordinates: [86.922623, 27.986065],
        zoomLevel: 13,
      },
    ],
  },
};