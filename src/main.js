import "ol/ol.css";
import "../vendor/resources/qgis2web.css";
import "../assets/css/base.css";
import "../assets/css/components.css";
import "../assets/css/responsive.css";

import Autolinker from "autolinker";
import Collection from "ol/Collection.js";
import Feature from "ol/Feature.js";
import Map from "ol/Map.js";
import Overlay from "ol/Overlay.js";
import View from "ol/View.js";
import * as extent from "ol/extent.js";
import Attribution from "ol/control/Attribution.js";
import Control from "ol/control/Control.js";
import ScaleLine from "ol/control/ScaleLine.js";
import GeoJSON from "ol/format/GeoJSON.js";
import LayerGroup from "ol/layer/Group.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorSource from "ol/source/Vector.js";
import XYZ from "ol/source/XYZ.js";
import CircleStyle from "ol/style/Circle.js";
import Fill from "ol/style/Fill.js";
import Stroke from "ol/style/Stroke.js";
import Style from "ol/style/Style.js";
import Text from "ol/style/Text.js";

window.ol = {
    Collection,
    Feature,
    Map,
    Overlay,
    View,
    extent,
    control: {
        Attribution,
        Control,
        ScaleLine
    },
    format: {
        GeoJSON
    },
    layer: {
        Group: LayerGroup,
        Tile: TileLayer,
        Vector: VectorLayer
    },
    source: {
        Vector: VectorSource,
        XYZ
    },
    style: {
        Circle: CircleStyle,
        Fill,
        Stroke,
        Style,
        Text
    }
};

window.Autolinker = Autolinker;

const legacyScripts = [
    "vendor/resources/qgis2web_expressions.js",
    "vendor/resources/functions.js",
    "data/layers/lotesSanBorja_1.js",
    "data/layers/CuadranteSLO100mx100m_2.js",
    "data/layers/LmiteSuperficieCnica_3.js",
    "data/layers/Lmitedistrital_SanBorja_4.js",
    "data/styles/lotesSanBorja_1_style.js",
    "data/styles/CuadranteSLO100mx100m_2_style.js",
    "data/styles/LmiteSuperficieCnica_3_style.js",
    "data/styles/Lmitedistrital_SanBorja_4_style.js",
    "data/layers/layers.js",
    "vendor/resources/qgis2web.js",
    "assets/js/config.js",
    "assets/js/ui.js",
    "assets/js/map-layers.js",
    "assets/js/search.js",
    "assets/js/popup.js",
    "assets/js/app.js"
];

function loadLegacyScript(path) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = `${import.meta.env.BASE_URL}${path}`;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`No se pudo cargar ${path}`));
        document.body.appendChild(script);
    });
}

for (const script of legacyScripts) {
    await loadLegacyScript(script);
}
