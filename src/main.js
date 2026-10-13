import "ol/ol.css";
import "../vendor/resources/qgis2web.css";
import "../vendor/resources/fontawesome-all.min.css";
import "../assets/css/base.css";
import "../assets/css/components.css";
import "../assets/css/responsive.css";

let visorBootPromise;

function bootVisor() {
    if (!visorBootPromise) {
        document.documentElement.classList.add("is-loading-visor");
        visorBootPromise = import("./visor-app.js").finally(() => {
            document.documentElement.classList.remove("is-loading-visor");
        });
    }

    return visorBootPromise;
}

async function closeWelcomeModal() {
    const modal = document.getElementById("welcome-modal-overlay");

    document.querySelectorAll("[data-action='close-welcome']").forEach((button) => {
        button.disabled = true;
    });

    await bootVisor();

    if (modal) {
        modal.classList.add("is-closing");
        window.setTimeout(() => {
            modal.hidden = true;
        }, 260);
    }
}

document.querySelectorAll("[data-action='close-welcome']").forEach((button) => {
    button.addEventListener("click", closeWelcomeModal);
});

window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
        window.setTimeout(() => {
            void bootVisor();
        }, 350);
    });
});

window.bootVisor = bootVisor;
window.closeWelcomeModal = closeWelcomeModal;
