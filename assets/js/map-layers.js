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
        var styleCache = new WeakMap();
        var heightValues = sloLayer.getSource().getFeatures().map(function (feature) {
            return parseFloat(String(feature.get("AlturaR_ml")).replace("m", "").trim());
        }).filter(Number.isFinite);
        var minHeight = Math.min.apply(Math, heightValues);
        var maxHeight = Math.max.apply(Math, heightValues);

        function getHeightColor(feature) {
            var value = parseFloat(String(feature.get("AlturaR_ml")).replace("m", "").trim());
            var stops = [
                { at: 0, color: [231, 108, 108] },
                { at: 1 / 3, color: [239, 162, 91] },
                { at: 2 / 3, color: [239, 213, 112] },
                { at: 1, color: [111, 190, 137] }
            ];

            if (!Number.isFinite(value) || !Number.isFinite(minHeight) || !Number.isFinite(maxHeight)) {
                return "rgba(255,255,255,0.01)";
            }

            var ratio = maxHeight === minHeight ? 0.5 : Math.max(0, Math.min(1, (value - minHeight) / (maxHeight - minHeight)));
            var upperIndex = stops.findIndex(function (stop) { return stop.at >= ratio; });
            var lower = stops[Math.max(0, upperIndex - 1)];
            var upper = stops[upperIndex < 0 ? stops.length - 1 : upperIndex];
            var progress = upper.at === lower.at ? 0 : (ratio - lower.at) / (upper.at - lower.at);
            var rgb = lower.color.map(function (channel, index) {
                return Math.round(channel + (upper.color[index] - channel) * progress);
            });

            return "rgba(" + rgb.join(",") + ",0.48)";
        }

        sloLayer.setZIndex(window.VisorConfig.layers.zIndex.sloGrid);
        sloLayer.set("declutter", true);
        sloLayer.setStyle(function (feature, resolution) {
            var bucket = resolution > 12 ? 0 : resolution < 1.5 ? 4 : resolution < 3 ? 3 : resolution < 6 ? 2 : 1;
            var cached = styleCache.get(feature);
            if (cached && cached.bucket === bucket && cached.revision === feature.getRevision()) {
                return cached.styles;
            }
            var baseStyle = typeof originalStyle === "function" ? originalStyle(feature, resolution) : originalStyle;
            var styles = [];

            if (baseStyle) {
                styles = Array.isArray(baseStyle) ? baseStyle.slice() : [baseStyle];
            }

            styles.unshift(new ol.style.Style({
                fill: new ol.style.Fill({ color: getHeightColor(feature) }),
                zIndex: window.VisorConfig.layers.zIndex.sloGrid
            }));

            var renderedStyles = styles.map(function (style) {
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
            styleCache.set(feature, { bucket: bucket, revision: feature.getRevision(), styles: renderedStyles });
            return renderedStyles;
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
                var data = window.json_lotesSanBorja_1;
                var features = [];
                var offset = 0;
                return new Promise(function (resolve, reject) {
                    function readBatch() {
                        try {
                            features.push.apply(features, format.readFeatures({
                                type: "FeatureCollection",
                                features: data.features.slice(offset, offset + 250)
                            }, { dataProjection: "EPSG:4326", featureProjection: "EPSG:3857" }));
                            offset += 250;
                            if (offset < data.features.length) {
                                window.setTimeout(readBatch, 0);
                                return;
                            }
                            if (window.style_lotesSanBorja_1 && features.length) {
                                lotsLayer.setStyle(window.style_lotesSanBorja_1(features[0], 1));
                            }
                            lotsSource.addFeatures(features);
                            window.json_lotesSanBorja_1 = null;
                            loaded = true;
                            resolve();
                        } catch (error) { reject(error); }
                    }
                    readBatch();
                });
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
        if (window.VisorAdditionalLayers) {
            window.VisorAdditionalLayers.configure(map);
        }

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
