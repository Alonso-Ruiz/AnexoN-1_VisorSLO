(function (window) {
    "use strict";

    if (window.bindInstitutionalInfo) {
        window.bindInstitutionalInfo();
    }

    function boot() {
        if (!window.map) {
            window.setTimeout(boot, 100);
            return;
        }

        if (window.matchMedia("(min-width: 769px)").matches) {
            window.map.getView().setZoom(window.map.getView().getZoom() - 1);
        }

        window.VisorUi.init(window.map);

        // The custom popup owns selection; avoid a second hit scan and popup render.
        ["onSingleClickFeatures", "onSingleClickWMS"].forEach(function (name) {
            if (typeof window[name] === "function") window.map.un("singleclick", window[name]);
        });
        if (typeof window.onPointerMove === "function") window.map.un("pointermove", window.onPointerMove);
        if (typeof window.pointerOnFeature === "function") {
            window.map.un("pointermove", window.pointerOnFeature);
            var hoverTimer;
            window.map.on("pointermove", function (event) {
                window.clearTimeout(hoverTimer);
                if (event.dragging) return;
                hoverTimer = window.setTimeout(function () {
                    if (!window.map.getView().getInteracting() && !window.map.getView().getAnimating()) {
                        window.pointerOnFeature(event);
                    }
                }, 80);
            });
            window.map.on("movestart", function () { window.clearTimeout(hoverTimer); });
        }

        var highlightOverlay = window.VisorLayers.configure(window.map);
        var searchInitialized = false;

        function initSearch() {
            if (searchInitialized) {
                return;
            }

            searchInitialized = true;
            window.VisorSearch.init(window.map, highlightOverlay);
        }

        function scheduleSearch() {
            var searchInput = document.getElementById("street-search");

            if (searchInput) {
                searchInput.addEventListener("focus", initSearch, { once: true });
            }

            window.setTimeout(initSearch, 4500);
        }

        scheduleSearch();
        window.VisorPopup.init(window.map, highlightOverlay);
    }

    boot();
})(window);
