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
        if (document.body.classList.contains("mobile-legend-open")) {
            closeMobilePanels();
            return;
        }
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

    function closeMobilePanels() {
        document.body.classList.remove("mobile-legend-open", "mobile-transparency-open", "mobile-legal-open");
        document.querySelectorAll("[data-mobile-panel]").forEach(function (button) {
            button.classList.remove("is-active");
            button.setAttribute("aria-expanded", "false");
        });
    }

    function setMobilePanel(panelName) {
        var className = "mobile-" + panelName + "-open";
        var isOpen = document.body.classList.contains(className);

        closeMobilePanels();
        if (isOpen) {
            return;
        }

        document.body.classList.add(className);
        var button = document.querySelector("[data-mobile-panel='" + panelName + "']");
        if (button) {
            button.classList.add("is-active");
            button.setAttribute("aria-expanded", "true");
        }
    }

    function bindMobileNavigation() {
        document.querySelectorAll("[data-mobile-panel]").forEach(function (button) {
            button.addEventListener("click", function () {
                setMobilePanel(button.dataset.mobilePanel);
            });
        });

        var closeButton = document.getElementById("mobile-info-close");
        if (closeButton) {
            closeButton.addEventListener("click", closeMobilePanels);
        }
    }

    function bindInstitutionalInfo() {
        var panel = document.getElementById("institutional-title");
        var button = document.getElementById("institutional-info-button");
        var hideTimer;

        if (!panel || !button) {
            return;
        }

        if (button.dataset.boundInstitutionalInfo === "true") {
            return;
        }

        button.dataset.boundInstitutionalInfo = "true";

        if (window.innerWidth > 768) {
            panel.classList.add("is-visible");
            button.setAttribute("aria-expanded", "false");
            return;
        }

        function showPanel() {
            window.clearTimeout(hideTimer);
            panel.classList.add("is-visible");
            button.setAttribute("aria-expanded", "true");

            hideTimer = window.setTimeout(function () {
                panel.classList.remove("is-visible");
                button.setAttribute("aria-expanded", "false");
            }, 5200);
        }

        button.addEventListener("click", showPanel);
        showPanel();
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
        bindInstitutionalInfo();
        bindDeclarativeActions();
        bindPanelToggle();
        bindMobileNavigation();
        bindContextMenuGuard();
        bindNorthRotation(map);
    }

    window.closeWelcomeModal = closeWelcomeModal;
    window.resetNorth = resetNorth;
    window.toggleLegend = toggleLegend;
    window.bindInstitutionalInfo = bindInstitutionalInfo;
    window.VisorUi = {
        init: initUiControls
    };
})(window, document);
