(function (window) {
    "use strict";

    window.VisorConfig = {
        paths: {
            streetsGeojson: "./data/vias.geojson",
            googleSatelliteUrl: "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
        },
        layers: {
            satellite: {
                title: "Google Satellite",
                attribution: "© Google",
                zIndex: -999,
                opacity: 1
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
        text: {
            panelOpen: "CERRAR",
            panelClosed: "◀ BASE LEGAL Y NOTAS",
            legendOpenIcon: "▼",
            legendClosedIcon: "▲"
        }
    };
})(window);
