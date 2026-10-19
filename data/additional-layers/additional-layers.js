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
        title: "RWY 20 / RWY 02",
        group: "airfield",
        zIndex: 30,
        interactive: true,
        style: lineStyle("rgba(45,51,54,0.96)", 3)
    });
    var thresholdLayer = addVectorLayer({
        data: "json_UMBRAL20_8",
        title: "RWY 20",
        group: "airfield",
        zIndex: 31,
        interactive: true,
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

    function labelStyle(text, placement, color) {
        return new ol.style.Text({
            text: text,
            font: "600 12px Arial, sans-serif",
            placement: placement || "point",
            repeat: placement === "line" ? 420 : undefined,
            overflow: true,
            offsetY: -14,
            fill: new ol.style.Fill({ color: color || "#303b40" }),
            stroke: new ol.style.Stroke({ color: "rgba(255,255,255,0.95)", width: 3 })
        });
    }

    // Use the runway outline for its clickable interior and southern end.
    var runwayRing = runwayLayer.getSource().getFeatures()[0].getGeometry().getCoordinates()[0];
    var runwayArea = new ol.Feature(new ol.geom.Polygon([runwayRing]));
    runwayLayer.getSource().addFeature(runwayArea);
    runwayLayer.setStyle(new ol.style.Style({
        stroke: new ol.style.Stroke({ color: "rgba(45,51,54,0.96)", width: 3 }),
        fill: new ol.style.Fill({ color: "rgba(45,51,54,0.04)" })
    }));
    runwayLayer.set("popupPriority", 97);
    thresholdLayer.set("popupPriority", 99);
    thresholdLayer.getStyle().setText(labelStyle("RWY 20"));
    var southEdge = runwayRing.slice(0, -1).sort(function (a, b) { return a[1] - b[1]; }).slice(0, 2);
    var threshold02Layer = new ol.layer.Vector({
        source: new ol.source.Vector({ features: [new ol.Feature(new ol.geom.Point([
            (southEdge[0][0] + southEdge[1][0]) / 2,
            (southEdge[0][1] + southEdge[1][1]) / 2
        ]))] }),
        style: new ol.style.Style({
            image: new ol.style.Circle({ radius: 5,
                fill: new ol.style.Fill({ color: "#303b40" }),
                stroke: new ol.style.Stroke({ color: "#fff", width: 1.5 }) }),
            text: labelStyle("RWY 02")
        }),
        zIndex: 60,
        properties: { title: "RWY 02", interactive: true, popupPriority: 99 }
    });
    additionalLayers.push({ layer: threshold02Layer, group: "airfield" });

    function surfaceBoundary(sourceLayer, text) {
        var features = [];
        sourceLayer.getSource().getFeatures().forEach(function (feature) {
            var geometry = feature.getGeometry();
            if (!geometry) return;
            var polygons = geometry.getType() === "MultiPolygon" ? geometry.getCoordinates() : [geometry.getCoordinates()];
            polygons.forEach(function (rings) {
                if (rings[0] && rings[0].length) features.push(new ol.Feature(new ol.geom.MultiLineString([rings[0]])));
            });
        });
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({ color: "rgba(183,72,75,0.85)", width: 1.5, lineDash: [10, 5] }),
                text: labelStyle(text, "line", "#a83232")
            }),
            declutter: true,
            zIndex: 61,
            properties: { interactive: false }
        });
        additionalLayers.push({ layer: layer, group: "surfaces" });
        return layer;
    }
    var conicalStart = surfaceBoundary(horizontalSurfaceLayer, "Inicio de superficie cónica");
    var conicalEnd = surfaceBoundary(conicalSurfaceLayer, "Fin de superficie cónica");

    function showDistrictName(map) {
        var feature = districtsLayer.getSource().getFeatures().find(function (item) {
            return String(item.get("DISTRITO")).toUpperCase() === "SAN BORJA";
        });
        if (!feature) return;
        var geometry = feature.getGeometry();
        var polygon = geometry.getType() === "MultiPolygon"
            ? geometry.getPolygons().sort(function (a, b) { return b.getArea() - a.getArea(); })[0] : geometry;
        var element = document.createElement("div");
        element.className = "district-name-card";
        element.textContent = "San Borja";
        var overlay = new ol.Overlay({ element: element, positioning: "center-center", stopEvent: false });
        overlay.setPosition(polygon.getInteriorPoint().getCoordinates().slice(0, 2));
        map.addOverlay(overlay);
        function resize() {
            var zoom = map.getView().getZoom() || 14;
            element.style.fontSize = Math.max(11, Math.min(17, 17 - (zoom - 13) * 1.2)) + "px";
            element.style.display = zoom >= 15 ? "none" : "block";
        }
        resize();
        map.getView().on("change:resolution", resize);
    }
    layerGroups = {
        surfaces: [conicalSurfaceLayer, horizontalSurfaceLayer, approach20Layer, approach02Layer, conicalStart, conicalEnd],
        airfield: [airbaseLayer, runwayLayer, thresholdLayer, threshold02Layer],
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
        showDistrictName(map);
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
