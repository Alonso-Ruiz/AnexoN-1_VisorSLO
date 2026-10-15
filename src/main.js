import "ol/ol.css";
import "../vendor/resources/qgis2web.css";
import "../vendor/resources/fontawesome-all.min.css";
import "../assets/css/base.css";
import "../assets/css/components.css";
import "../assets/css/responsive.css";

let visorBootPromise;
let visorState = "loading";
let welcomeClosed = false;

function updateLoadingNotice() {
    const notice = document.getElementById("visor-loading-status");
    const message = document.getElementById("visor-loading-message");
    const retry = document.getElementById("visor-loading-retry");
    notice.hidden = !welcomeClosed || visorState === "ready";
    retry.hidden = visorState !== "error";
    message.textContent = visorState === "error"
        ? "No se pudo cargar el visor. Revisa tu conexión y vuelve a intentarlo."
        : "Cargando el mapa…";
}

function bootVisor() {
    if (!visorBootPromise) {
        document.documentElement.classList.add("is-loading-visor");
        visorBootPromise = import("./visor-app.js").then(() => {
            visorState = "ready";
        }).catch((error) => {
            visorState = "error";
            throw error;
        }).finally(() => {
            document.documentElement.classList.remove("is-loading-visor");
            updateLoadingNotice();
        });
    }

    return visorBootPromise;
}

function closeWelcomeModal() {
    if (welcomeClosed) return;
    welcomeClosed = true;
    const modal = document.getElementById("welcome-modal-overlay");

    if (modal) {
        modal.classList.add("is-closing");
        window.setTimeout(() => {
            modal.hidden = true;
        }, 260);
    }
    updateLoadingNotice();
    void bootVisor().catch(() => {});
}

document.querySelectorAll("[data-action='close-welcome']").forEach((button) => {
    button.addEventListener("click", closeWelcomeModal);
});

window.requestAnimationFrame(() => {
    void bootVisor().catch(() => {});
});

document.getElementById("visor-loading-retry").addEventListener("click", () => window.location.reload());

window.bootVisor = bootVisor;
window.closeWelcomeModal = closeWelcomeModal;
