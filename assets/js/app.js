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

        window.VisorUi.init(window.map);

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
