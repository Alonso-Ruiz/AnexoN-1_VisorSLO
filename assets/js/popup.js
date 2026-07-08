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

    function renderSloPopup(container, terrainAltitude, allowedHeight) {
        var wrapper = document.createElement("div");

        wrapper.className = "slo-popup";
        wrapper.appendChild(createPopupSection("Altitud del terreno:", terrainAltitude, "m s.n.m."));
        wrapper.appendChild(createPopupSection(
            "Diferencia de altitud con la superficie del terreno (segun SLO):",
            allowedHeight,
            "metros maximos sobre el terreno"
        ));

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

    function initSloPopup(map, highlightOverlay) {
        map.on("singleclick", function (event) {
            var clickedFeature = null;

            highlightOverlay.getSource().clear();
            map.forEachFeatureAtPixel(event.pixel, function (feature) {
                if (Object.prototype.hasOwnProperty.call(feature.getProperties(), "AlturaR_ml")) {
                    clickedFeature = feature;
                    return true;
                }

                return false;
            });

            window.setTimeout(function () {
                var popupContainer = document.getElementById("popup");
                var popupContent = document.getElementById("popup-content");
                var overlay = map.getOverlays().getArray()[0];
                var allowedHeightRaw;
                var terrainAltitudeRaw;
                var allowedHeight;
                var terrainAltitude;

                if (!popupContainer || !popupContent) {
                    return;
                }

                if (!clickedFeature) {
                    hidePopup(popupContainer, popupContent, overlay);
                    return;
                }

                allowedHeightRaw = clickedFeature.get("AlturaR_ml");
                terrainAltitudeRaw = clickedFeature.get("Altitud_me");

                if (allowedHeightRaw === null || allowedHeightRaw === undefined) {
                    hidePopup(popupContainer, popupContent, overlay);
                    return;
                }

                highlightOverlay.getSource().addFeature(clickedFeature);
                allowedHeight = String(allowedHeightRaw).replace("m", "").trim();
                terrainAltitude = terrainAltitudeRaw !== null && terrainAltitudeRaw !== undefined
                    ? parseFloat(terrainAltitudeRaw).toFixed(2)
                    : "0.00";

                renderSloPopup(popupContent, terrainAltitude, allowedHeight);
                if (overlay) {
                    overlay.setPosition(event.coordinate);
                }
                popupContainer.style.display = "block";
            }, 15);
        });
    }

    window.VisorPopup = {
        init: initSloPopup
    };
})(window, document);
