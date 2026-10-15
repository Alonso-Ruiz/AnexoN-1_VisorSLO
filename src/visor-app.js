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
import Point from "ol/geom/Point.js";
import MultiLineString from "ol/geom/MultiLineString.js";
import Polygon from "ol/geom/Polygon.js";
import LayerGroup from "ol/layer/Group.js";
import TileLayer from "ol/layer/Tile.js";
import VectorLayer from "ol/layer/Vector.js";
import VectorImageLayer from "ol/layer/VectorImage.js";
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
    geom: { Point, MultiLineString, Polygon },
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
        Vector: VectorLayer,
        VectorImage: VectorImageLayer
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

import legacyScripts from "./legacy-scripts.json";
import legacyBundleUrl from "virtual:visor-legacy";

function loadLegacyScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.async = false;
        script.src = url;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`No se pudo cargar ${url}`));
        document.body.appendChild(script);
    });
}

if (legacyBundleUrl) {
    await loadLegacyScript(legacyBundleUrl);
} else {
    // Download together; async=false preserves the required execution order.
    await Promise.all(legacyScripts.map((path) => loadLegacyScript(`${import.meta.env.BASE_URL}${path}`)));
}

if (!window.VisorAppReady) {
    throw new Error("El visor no pudo completar su inicialización.");
}
