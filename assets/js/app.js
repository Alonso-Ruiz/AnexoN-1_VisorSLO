(function (window) {
    "use strict";

    function boot() {
        if (!window.map) {
            window.setTimeout(boot, 100);
            return;
        }

        window.VisorUi.init(window.map);

        var highlightOverlay = window.VisorLayers.configure(window.map);

        window.VisorSearch.init(window.map, highlightOverlay);
        window.VisorPopup.init(window.map, highlightOverlay);
    }

    boot();
})(window);
