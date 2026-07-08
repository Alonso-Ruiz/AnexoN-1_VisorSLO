(function (window, document) {
    "use strict";

    function closeWelcomeModal() {
        var modal = document.getElementById("welcome-modal-overlay");
        if (modal) {
            modal.style.display = "none";
        }
    }

    function resetNorth() {
        if (window.map) {
            window.map.getView().animate({ rotation: 0, duration: 500 });
        }
    }

    function toggleLegend() {
        var content = document.getElementById("legend-content");
        var icon = document.getElementById("legend-icon");
        var text = window.VisorConfig.text;

        if (!content) {
            return;
        }

        if (window.innerWidth > 768) {
            if (content.style.display === "none") {
                content.style.display = "block";
                if (icon) {
                    icon.textContent = text.legendOpenIcon;
                }
            } else {
                content.style.display = "none";
                if (icon) {
                    icon.textContent = text.legendClosedIcon;
                }
            }
        } else {
            content.classList.toggle("show-mobile");
        }
    }

    function bindPanelToggle() {
        var panel = document.getElementById("info-panel");
        var button = document.getElementById("info-panel-toggle");
        var text = window.VisorConfig.text;

        if (!panel || !button) {
            return;
        }

        button.addEventListener("click", function () {
            panel.classList.toggle("open");
            button.classList.toggle("open");
            button.textContent = panel.classList.contains("open") ? text.panelOpen : text.panelClosed;
        });
    }

    function bindDeclarativeActions() {
        var closeButtons = document.querySelectorAll("[data-action='close-welcome']");
        var legendButtons = document.querySelectorAll("[data-action='toggle-legend']");
        var northButton = document.getElementById("north-arrow");

        closeButtons.forEach(function (button) {
            button.addEventListener("click", closeWelcomeModal);
        });

        legendButtons.forEach(function (button) {
            button.addEventListener("click", toggleLegend);
        });

        if (northButton) {
            northButton.addEventListener("click", resetNorth);
        }
    }

    function bindContextMenuGuard() {
        document.addEventListener("contextmenu", function (event) {
            var target = event.target;
            var tagName = target && target.tagName ? target.tagName.toLowerCase() : "";

            if (tagName === "canvas" || target.closest("#map")) {
                event.preventDefault();
            }
        }, false);
    }

    function bindNorthRotation(map) {
        var northIcon = document.getElementById("north-icon");

        if (!northIcon) {
            return;
        }

        map.getView().on("change:rotation", function () {
            northIcon.style.transform = "rotate(" + map.getView().getRotation() + "rad)";
        });
    }

    function initUiControls(map) {
        bindDeclarativeActions();
        bindPanelToggle();
        bindContextMenuGuard();
        bindNorthRotation(map);
    }

    window.closeWelcomeModal = closeWelcomeModal;
    window.resetNorth = resetNorth;
    window.toggleLegend = toggleLegend;
    window.VisorUi = {
        init: initUiControls
    };
})(window, document);
