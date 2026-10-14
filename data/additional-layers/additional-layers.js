(function (window, document) {
    "use strict";

    var additionalLayers = [];
    var layerGroups = {};
    function addVectorLayer(options) {
        var format = new ol.format.GeoJSON();
        var features = format.readFeatures(window[options.data], {
            dataProjection: "EPSG:4326",
            featureProjection: "EPSG:3857"
        });
        var LayerClass = options.group === "mesh" || options.group === "districts"
            ? ol.layer.VectorImage : ol.layer.Vector;
        var layer = new LayerClass({
            imageRatio: 1.5,
            source: new ol.source.Vector({ features: features }),
            style: options.style,
            visible: false,
            declutter: true,
            renderBuffer: 64
        });

        layer.set("title", options.title);
        layer.set("interactive", options.interactive !== false);
        layer.setZIndex(options.zIndex);
        additionalLayers.push({ layer: layer, group: options.group });
        return layer;
    }

    function polygonStyle(fillColor, strokeColor, strokeWidth, dash) {
        return new ol.style.Style({
            fill: new ol.style.Fill({ color: fillColor }),
            stroke: new ol.style.Stroke({ color: strokeColor, width: strokeWidth, lineDash: dash })
        });
    }

    function lineStyle(color, width, dash) {
        return new ol.style.Style({
            stroke: new ol.style.Stroke({ color: color, width: width, lineDash: dash })
        });
    }

    var districtsLayer = addVectorLayer({
        data: "json_DistritosdeLimaMetropolitana_1",
        title: "Distritos de Lima Metropolitana",
        group: "districts",
        zIndex: 12,
        interactive: false,
        style: polygonStyle("rgba(255,255,255,0.01)", "rgba(110,120,128,0.58)", 1)
    });
    var airbaseLayer = addVectorLayer({
        data: "json_BASEAEREALASPALMAS_2",
        title: "Aeródromo Las Palmas",
        group: "airfield",
        zIndex: 28,
        interactive: true,
        style: polygonStyle("rgba(82,128,151,0.24)", "rgba(48,84,104,0.9)", 2, [7, 4])
    });
    var conicalSurfaceLayer = addVectorLayer({
        data: "json_SuperficieCnicaSC_3",
        title: "Superficie cónica (SC)",
        group: "surfaces",
        zIndex: 22,
        interactive: false,
        style: polygonStyle("rgba(226,166,76,0.17)", "rgba(190,130,43,0.78)", 1.3)
    });
    var horizontalSurfaceLayer = addVectorLayer({
        data: "json_SuperficieHorizontalInternaSHI_4",
        title: "Superficie horizontal interna (SHI)",
        group: "surfaces",
        zIndex: 23,
        interactive: false,
        style: polygonStyle("rgba(67,158,184,0.16)", "rgba(38,121,151,0.82)", 1.3)
    });
    var approach20Layer = addVectorLayer({
        data: "json_SuperificedeAproximacinRWY_20_5",
        title: "Trayectoria de aproximación RWY 20",
        group: "surfaces",
        zIndex: 25,
        interactive: true,
        style: lineStyle("rgba(196,58,69,0.9)", 2.2, [9, 5])
    });
    var approach02Layer = addVectorLayer({
        data: "json_SuperificedeAproximacinRWY_02_6",
        title: "Trayectoria de aproximación RWY 02",
        group: "surfaces",
        zIndex: 25,
        interactive: true,
        style: lineStyle("rgba(196,58,69,0.9)", 2.2, [4, 4])
    });
    var runwayLayer = addVectorLayer({
        data: "json_PistadeAterrizaje_7",
        title: "Pista de aterrizaje",
        group: "airfield",
        zIndex: 30,
        interactive: false,
        style: lineStyle("rgba(45,51,54,0.96)", 3)
    });
    var thresholdLayer = addVectorLayer({
        data: "json_UMBRAL20_8",
        title: "Umbral 20",
        group: "airfield",
        zIndex: 31,
        interactive: false,
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 6,
                fill: new ol.style.Fill({ color: "rgba(35,42,45,0.95)" }),
                stroke: new ol.style.Stroke({ color: "#ffffff", width: 1.5 })
            })
        })
    });
    var verticalLayer = addVectorLayer({
        data: "json_VerticalLineas_9",
        title: "Líneas verticales",
        group: "mesh",
        zIndex: 34,
        interactive: false,
        style: lineStyle("rgba(215,25,28,0.78)", 1.3)
    });
    var horizontalLayer = addVectorLayer({
        data: "json_HorizontalLineas_10",
        title: "Líneas horizontales",
        group: "mesh",
        zIndex: 34,
        interactive: false,
        style: lineStyle("rgba(52,112,178,0.78)", 1.3)
    });
    var mesh02Layer = addVectorLayer({
        data: "json_02MallaVerticalHorizontal_12",
        title: "Malla vertical horizontal",
        group: "mesh",
        zIndex: 35,
        interactive: false,
        style: lineStyle("rgba(145,82,45,0.78)", 1.1)
    });
    var mesh01Layer = addVectorLayer({
        data: "json_01MallaVerticalInicial_13",
        title: "Malla vertical inicial",
        group: "mesh",
        zIndex: 35,
        interactive: false,
        style: lineStyle("rgba(196,60,57,0.74)", 1.1)
    });
    var officialLineLayer = addVectorLayer({
        data: "json_lnealmite_of_15",
        title: "Línea límite oficial",
        group: "mesh",
        zIndex: 36,
        interactive: false,
        style: lineStyle("rgba(183,72,75,0.9)", 2.1, [10, 5])
    });
    layerGroups = {
        surfaces: [conicalSurfaceLayer, horizontalSurfaceLayer, approach20Layer, approach02Layer],
        airfield: [airbaseLayer, runwayLayer, thresholdLayer],
        mesh: [
            verticalLayer,
            horizontalLayer,
            mesh02Layer,
            mesh01Layer,
            officialLineLayer
        ].filter(Boolean),
        districts: [districtsLayer]
    };

    function setGroupVisibility(name, visible) {
        (layerGroups[name] || []).forEach(function (layer) {
            layer.setVisible(visible);
        });
        var checkbox = document.querySelector('[data-additional-layer-group="' + name + '"]');
        var button = document.querySelector('[data-toggle-layer-group="' + name + '"]');

        if (checkbox) {
            checkbox.checked = visible;
        }
        if (button) {
            button.setAttribute("aria-pressed", String(visible));
            button.classList.toggle("is-active", visible);
        }
    }

    function configure(map) {
        additionalLayers.forEach(function (entry) {
            map.addLayer(entry.layer);
            entry.layer.setVisible(false);
        });

        var defaultVisibility = {
            surfaces: true,
            airfield: true,
            mesh: false,
            districts: true
        };

        Object.keys(defaultVisibility).forEach(function (name) {
            setGroupVisibility(name, defaultVisibility[name]);
            var checkbox = document.querySelector('[data-additional-layer-group="' + name + '"]');
            var button = document.querySelector('[data-toggle-layer-group="' + name + '"]');

            if (checkbox) {
                checkbox.checked = defaultVisibility[name];
                checkbox.addEventListener("change", function (event) {
                    setGroupVisibility(name, event.target.checked);
                });
            }
            if (button) {
                button.addEventListener("click", function () {
                    var group = layerGroups[name] || [];
                    var shouldShow = group.some(function (layer) { return !layer.getVisible(); });
                    setGroupVisibility(name, shouldShow);
                });
            }
        });

        map.getView().fit([-8578279.96, -1371895.13, -8564921.62, -1354245.08], {
            size: map.getSize(),
            padding: [72, 90, 82, 90],
            maxZoom: 14,
            duration: 0
        });
    }

    window.VisorAdditionalLayers = {
        configure: configure
    };
})(window, document);
