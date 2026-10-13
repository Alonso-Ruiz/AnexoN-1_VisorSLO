(function (window, document) {
    "use strict";

    function createSatelliteLayer() {
        var satelliteConfig = window.VisorConfig.layers.satellite;

        return new ol.layer.Tile({
            title: satelliteConfig.title,
            source: new ol.source.XYZ({
                url: window.VisorConfig.paths.googleSatelliteUrl,
                attributions: satelliteConfig.attribution
            }),
            zIndex: satelliteConfig.zIndex,
            visible: true,
            opacity: satelliteConfig.opacity
        });
    }

    function bindSatelliteControls(satelliteLayer) {
        var toggle = document.getElementById("googleMapsToggle");
        var opacitySlider = document.getElementById("opacity-slider");
        var mobileOpacitySlider = document.getElementById("mobile-opacity-slider");

        var initialOpacity = String(satelliteLayer.getOpacity());
        if (opacitySlider) opacitySlider.value = initialOpacity;
        if (mobileOpacitySlider) mobileOpacitySlider.value = initialOpacity;

        if (toggle) {
            toggle.addEventListener("change", function (event) {
                satelliteLayer.setVisible(event.target.checked);
            });
        }

        if (opacitySlider) {
            opacitySlider.addEventListener("input", updateOpacity);
        }

        if (mobileOpacitySlider) {
            mobileOpacitySlider.addEventListener("input", updateOpacity);
        }

        function updateOpacity(event) {
            var value = parseFloat(event.target.value);

            satelliteLayer.setVisible(value > 0);
            satelliteLayer.setOpacity(value);
            if (opacitySlider) opacitySlider.value = event.target.value;
            if (mobileOpacitySlider) mobileOpacitySlider.value = event.target.value;
        }
    }

    function applyDistrictBoundaryStyle() {
        if (!window.lyr_Lmitedistrital_SanBorja_4) {
            return;
        }

        window.lyr_Lmitedistrital_SanBorja_4.setZIndex(window.VisorConfig.layers.zIndex.districtBoundary);
        window.lyr_Lmitedistrital_SanBorja_4.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: "#2c3e50",
                width: 4,
                lineDash: [12, 8]
            })
        }));
    }

    function applySloGridStyle() {
        if (!window.lyr_CuadranteSLO100mx100m_2) {
            return;
        }

        var sloLayer = window.lyr_CuadranteSLO100mx100m_2;
        var originalStyle = sloLayer.getStyle();

        sloLayer.setZIndex(window.VisorConfig.layers.zIndex.sloGrid);
        sloLayer.set("declutter", true);
        sloLayer.setStyle(function (feature, resolution) {
            var baseStyle = typeof originalStyle === "function" ? originalStyle(feature, resolution) : originalStyle;
            var styles = [];

            if (baseStyle) {
                styles = Array.isArray(baseStyle) ? baseStyle.slice() : [baseStyle];
            }

            styles.unshift(new ol.style.Style({
                fill: new ol.style.Fill({ color: "rgba(255,255,255,0.01)" }),
                zIndex: window.VisorConfig.layers.zIndex.sloGrid
            }));

            return styles.map(function (style) {
                if (!style.getText()) {
                    return style;
                }

                var clonedStyle = style.clone();
                var text = clonedStyle.getText();

                if (resolution > 12) {
                    text.setText("");
                } else {
                    var fontSize = "11px";

                    if (resolution < 1.5) {
                        fontSize = "16px";
                    } else if (resolution < 3) {
                        fontSize = "14px";
                    } else if (resolution < 6) {
                        fontSize = "12px";
                    }

                    text.setFont("bold " + fontSize + " \"Helvetica Neue\", Arial, sans-serif");
                    text.getFill().setColor("#1a252f");
                    text.setStroke(new ol.style.Stroke({ color: "rgba(255,255,255,0.95)", width: 4 }));
                }

                clonedStyle.setZIndex(100);
                return clonedStyle;
            });
        });
    }

    function createHighlightOverlay(map) {
        return new ol.layer.Vector({
            source: new ol.source.Vector(),
            map: map,
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({ color: "#ffcc33", width: 3 }),
                fill: new ol.style.Fill({ color: "rgba(255, 204, 51, 0.4)" })
            }),
            zIndex: window.VisorConfig.layers.zIndex.highlight
        });
    }

    function loadScript(path) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement("script");

            script.src = path;
            script.async = true;
            script.onload = resolve;
            script.onerror = function () {
                reject(new Error("No se pudo cargar " + path));
            };
            document.body.appendChild(script);
        });
    }

    function configureDeferredLots(map) {
        var lotsLayer = window.lyr_lotesSanBorja_1;
        var lotsSource = window.jsonSource_lotesSanBorja_1;
        var format = window.format_lotesSanBorja_1;
        var loading = false;
        var loaded = false;
        var loadResolution = window.VisorConfig.performance.lotsLoadResolution;

        if (!lotsLayer || !lotsSource || !format) {
            return;
        }

        function shouldLoadLots() {
            return map.getView().getResolution() <= loadResolution;
        }

        function loadLots() {
            if (loaded || loading || !shouldLoadLots()) {
                return;
            }

            loading = true;
            Promise.all([
                loadScript(window.VisorConfig.paths.lotsStyleScript),
                loadScript(window.VisorConfig.paths.lotsLayerScript)
            ]).then(function () {
                var features = format.readFeatures(window.json_lotesSanBorja_1, {
                    dataProjection: "EPSG:4326",
                    featureProjection: "EPSG:3857"
                });

                lotsSource.addFeatures(features);

                if (window.style_lotesSanBorja_1) {
                    lotsLayer.setStyle(window.style_lotesSanBorja_1);
                }

                window.json_lotesSanBorja_1 = null;
                loaded = true;
            }).catch(function (error) {
                console.error(error);
            }).finally(function () {
                loading = false;
            });
        }

        map.on("moveend", loadLots);
        window.setTimeout(loadLots, 800);
    }

    function configureProjectLayers(map) {
        var satelliteLayer = createSatelliteLayer();

        map.getLayers().insertAt(0, satelliteLayer);
        bindSatelliteControls(satelliteLayer);

        if (window.lyr_LmiteSuperficieCnica_3) {
            window.lyr_LmiteSuperficieCnica_3.setVisible(false);
        }

        if (window.lyr_lotesSanBorja_1) {
            window.lyr_lotesSanBorja_1.setZIndex(window.VisorConfig.layers.zIndex.lots);
        }

        applyDistrictBoundaryStyle();
        applySloGridStyle();
        configureDeferredLots(map);

        map.addControl(new ol.control.ScaleLine({
            units: "metric",
            bar: false,
            text: true,
            minWidth: window.matchMedia("(max-width: 768px)").matches ? 48 : 100
        }));

        return createHighlightOverlay(map);
    }

    window.VisorLayers = {
        configure: configureProjectLayers
    };
})(window, document);
