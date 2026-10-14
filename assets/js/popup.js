(function (window, document) {
    "use strict";

    function createTextElement(className, text) {
        var element = document.createElement("div");

        element.className = className;
        element.textContent = text;
        return element;
    }

    function createPopupSection(label, value, unit) {
        var section = document.createElement("div");
        var valueElement = createTextElement("slo-popup-value", value + " ");
        var unitElement = document.createElement("span");

        section.className = "slo-popup-section";
        unitElement.className = "slo-popup-unit";
        unitElement.textContent = unit;
        valueElement.appendChild(unitElement);
        section.appendChild(createTextElement("slo-popup-label", label));
        section.appendChild(valueElement);

        return section;
    }

    function renderSloPopup(container, terrainAltitude, allowedHeight, properties) {
        var wrapper = document.createElement("div");

        wrapper.className = "slo-popup";
        wrapper.appendChild(createTextElement("slo-popup-title", "Información de la cuadrícula SLO"));
        if (properties["Cód_Cuadr"] || properties.Nro_Cuadr) {
            wrapper.appendChild(createTextElement(
                "slo-popup-heading",
                "Cuadro " + (properties["Cód_Cuadr"] || properties.Nro_Cuadr)
            ));
        }
        wrapper.appendChild(createPopupSection("Altitud del terreno:", terrainAltitude, "m s.n.m."));
        wrapper.appendChild(createPopupSection(
            "Diferencia de altitud con la superficie del terreno (segun SLO):",
            allowedHeight,
            "metros maximos sobre el terreno"
        ));

        if (properties.Altitud_mi !== undefined && properties.Altitud_ma !== undefined) {
            wrapper.appendChild(createPopupSection(
                "Rango de altitud del terreno:",
                properties.Altitud_mi + " – " + properties.Altitud_ma,
                "m s.n.m."
            ));
        }

        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        container.appendChild(wrapper);
    }

    function renderAirfieldInfo(container, title) {
        var wrapper = document.createElement("div");

        wrapper.className = "slo-popup";
        wrapper.appendChild(createTextElement("slo-popup-title", title));
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(wrapper);
    }
    function renderApproachInfo(container, title, properties) {
        var wrapper = document.createElement("div");
        var details = properties.Text || properties.Comentario;

        wrapper.className = "slo-popup";
        wrapper.appendChild(createTextElement("slo-popup-title", title));
        wrapper.appendChild(createTextElement("slo-popup-label", "Parámetros de aproximación"));
        if (details) {
            wrapper.appendChild(createTextElement("slo-popup-description", details));
        } else {
            wrapper.appendChild(createTextElement("slo-popup-description", "La trayectoria no incluye parámetros adicionales."));
        }
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
        container.appendChild(wrapper);
    }

    function hidePopup(popupContainer, popupContent, overlay) {
        if (overlay) {
            overlay.setPosition(undefined);
        }

        popupContainer.style.display = "none";

        while (popupContent.firstChild) {
            popupContent.removeChild(popupContent.firstChild);
        }
    }

    function getFeaturePriority(layer) {
        if (layer === window.lyr_CuadranteSLO100mx100m_2) {
            return 100;
        }
        return layer.get("title") === "Aeródromo Las Palmas" ? 95 : 90;
    }
    function initSloPopup(map, highlightOverlay) {
        map.on("singleclick", function (event) {
            var clickedFeature = null;
            var clickedLayer = null;
            var clickedPriority = -1;
            highlightOverlay.getSource().clear();
            map.forEachFeatureAtPixel(event.pixel, function (feature, layer) {
                var isExistingSloGrid = layer === window.lyr_CuadranteSLO100mx100m_2 &&
                    Object.prototype.hasOwnProperty.call(feature.getProperties(), "AlturaR_ml");
                if (layer && (layer.get("interactive") === true || isExistingSloGrid)) {
                    var priority = getFeaturePriority(layer);
                    if (priority > clickedPriority) {
                        clickedFeature = feature;
                        clickedLayer = layer;
                        clickedPriority = priority;
                    }
                }
                return clickedPriority === 100;
            }, {
                hitTolerance: 8,
                layerFilter: function (layer) {
                    return layer === window.lyr_CuadranteSLO100mx100m_2 ||
                        (layer.get("interactive") === true && layer !== window.lyr_Lmitedistrital_SanBorja_4);
                }
            });

            (function () {
                var popupContainer = document.getElementById("popup");
                var popupContent = document.getElementById("popup-content");
                var overlay = map.getOverlays().getArray()[0];
                var allowedHeightRaw;
                var terrainAltitudeRaw;
                var allowedHeight;
                var terrainAltitude;
                var properties;

                if (!popupContainer || !popupContent) {
                    return;
                }

                if (!clickedFeature) {
                    hidePopup(popupContainer, popupContent, overlay);
                    return;
                }

                properties = clickedFeature.getProperties();
                allowedHeightRaw = clickedFeature.get("AlturaR_ml");
                terrainAltitudeRaw = clickedFeature.get("Altitud_me");

                highlightOverlay.getSource().addFeature(clickedFeature);
                if (allowedHeightRaw !== null && allowedHeightRaw !== undefined) {
                    allowedHeight = String(allowedHeightRaw).replace("m", "").trim();
                    terrainAltitude = terrainAltitudeRaw !== null && terrainAltitudeRaw !== undefined
                        ? parseFloat(terrainAltitudeRaw).toFixed(2)
                        : "0.00";
                    renderSloPopup(popupContent, terrainAltitude, allowedHeight, properties);
                } else if (clickedLayer && clickedLayer.get("title") &&
                    clickedLayer.get("title").indexOf("Trayectoria de aproximación") !== -1) {
                    renderApproachInfo(popupContent, clickedLayer.get("title"), properties);
                } else {
                    renderAirfieldInfo(popupContent, clickedLayer.get("title"));
                }
                if (overlay) {
                    overlay.setPosition(event.coordinate);
                }
                popupContainer.style.display = "block";
            })();
        });
    }

    window.VisorPopup = {
        init: initSloPopup
    };
})(window, document);
