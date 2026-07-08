var size = 0;
var placement = 'point';

var style_CuadranteSLO100mx100m_2 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("");
    var labelFont = "11.700000000000001px \'Arial Black\', sans-serif";
    var labelFill = "#323232";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 0;
    var offsetY = 0;
    var placement = 'point';
    if (feature.get("Cód_Cuadr") !== null) {
        labelText = String(feature.get("Cód_Cuadr"));
    }
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(0,4,238,1.0)', lineDash: null, lineCap: 'square', lineJoin: 'bevel', width: 1.52}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];

    return style;
};
