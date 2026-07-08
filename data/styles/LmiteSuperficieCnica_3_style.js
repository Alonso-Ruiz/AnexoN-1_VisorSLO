var size = 0;
var placement = 'point';

var style_LmiteSuperficieCnica_3 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("");
    var labelFont = "13.0px \'Montserrat SemiBold\', sans-serif";
    var labelFill = "#b50909";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = "left";
    var offsetX = 0;
    var offsetY = 0;
    var placement = 'line';
    if (feature.get("NOMBRE") !== null) {
        labelText = String(feature.get("NOMBRE"));
    }
    var style = [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(183,72,75,1.0)', lineDash: [18.24,9.12], lineCap: 'square', lineJoin: 'bevel', width: 4.56}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth)
    })];

    return style;
};
