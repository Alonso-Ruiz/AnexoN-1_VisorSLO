(function (window) {
    "use strict";

    window.VisorConfig = {
        paths: {
            streetsGeojson: "./data/vias.geojson",
            lotsLayerScript: "data/layers/lotesSanBorja_1.js",
            lotsStyleScript: "data/styles/lotesSanBorja_1_style.js",
            googleSatelliteUrl: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        },
        layers: {
            satellite: {
                title: "Google Satellite",
                attribution: "\u00a9 Google",
                zIndex: -999,
                opacity: 0.5
            },
            zIndex: {
                lots: 10,
                streets: 30,
                districtBoundary: 20,
                sloGrid: 50,
                highlight: 999
            }
        },
        search: {
            visibleResolutionLimit: 4,
            maxResults: 6,
            fitPadding: [100, 100, 100, 100],
            fitDuration: 1200,
            maxZoom: 18,
            nameFields: ["NOMBRECOMP", "NOMBRE", "NOM_VIA", "VIA"]
        },
        performance: {
            lotsLoadResolution: 4
        },
        text: {
            panelOpen: "CERRAR",
            panelClosed: "\u25c0 BASE LEGAL Y NOTAS",
            legendOpenIcon: "\u25bc",
            legendClosedIcon: "\u25b2"
        }
    };
})(window);
