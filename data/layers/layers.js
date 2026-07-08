var wms_layers = [];
var format_lotesSanBorja_1 = new ol.format.GeoJSON();
var features_lotesSanBorja_1 = format_lotesSanBorja_1.readFeatures(json_lotesSanBorja_1,
    { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
var jsonSource_lotesSanBorja_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_lotesSanBorja_1.addFeatures(features_lotesSanBorja_1);
var lyr_lotesSanBorja_1 = new ol.layer.Vector({
    declutter: false,
    source: jsonSource_lotesSanBorja_1,
    style: style_lotesSanBorja_1,
    popuplayertitle: 'lotes San Borja',
    interactive: false,
    title: '<img src="data/styles/legend/lotesSanBorja_1.png" /> lotes San Borja'
});
var format_CuadranteSLO100mx100m_2 = new ol.format.GeoJSON();
var features_CuadranteSLO100mx100m_2 = format_CuadranteSLO100mx100m_2.readFeatures(json_CuadranteSLO100mx100m_2,
    { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
var jsonSource_CuadranteSLO100mx100m_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_CuadranteSLO100mx100m_2.addFeatures(features_CuadranteSLO100mx100m_2);
var lyr_CuadranteSLO100mx100m_2 = new ol.layer.Vector({
    declutter: false,
    source: jsonSource_CuadranteSLO100mx100m_2,
    style: style_CuadranteSLO100mx100m_2,
    popuplayertitle: 'Cuadrante SLO 100m x 100m',
    interactive: true,
    title: '<img src="data/styles/legend/CuadranteSLO100mx100m_2.png" /> Cuadrante SLO 100m x 100m'
});
var format_LmiteSuperficieCnica_3 = new ol.format.GeoJSON();
var features_LmiteSuperficieCnica_3 = format_LmiteSuperficieCnica_3.readFeatures(json_LmiteSuperficieCnica_3,
    { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
var jsonSource_LmiteSuperficieCnica_3 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_LmiteSuperficieCnica_3.addFeatures(features_LmiteSuperficieCnica_3);
var lyr_LmiteSuperficieCnica_3 = new ol.layer.Vector({
    declutter: false,
    source: jsonSource_LmiteSuperficieCnica_3,
    style: style_LmiteSuperficieCnica_3,
    popuplayertitle: 'Limite Superficie Conica',
    interactive: false,
    title: '<img src="data/styles/legend/LmiteSuperficieCnica_3.png" /> Limite Superficie Conica'
});
var format_Lmitedistrital_SanBorja_4 = new ol.format.GeoJSON();
var features_Lmitedistrital_SanBorja_4 = format_Lmitedistrital_SanBorja_4.readFeatures(json_Lmitedistrital_SanBorja_4,
    { dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857' });
var jsonSource_Lmitedistrital_SanBorja_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Lmitedistrital_SanBorja_4.addFeatures(features_Lmitedistrital_SanBorja_4);
var lyr_Lmitedistrital_SanBorja_4 = new ol.layer.Vector({
    declutter: false,
    source: jsonSource_Lmitedistrital_SanBorja_4,
    style: style_Lmitedistrital_SanBorja_4,
    popuplayertitle: 'Limite distrital San Borja',
    interactive: true,
    title: '<img src="data/styles/legend/Lmitedistrital_SanBorja_4.png" /> Limite distrital San Borja'
});
var group_Solorepre = new ol.layer.Group({
    layers: [],
    fold: 'close',
    title: 'Solo repre'
});
var group_SuperficieLimitadoradeObstculosSLO = new ol.layer.Group({
    layers: [],
    fold: 'close',
    title: 'Superficie Limitadora de Obstaculos (SLO)'
});
var group_BASESUPERIOR = new ol.layer.Group({
    layers: [],
    fold: 'close',
    title: 'BASE SUPERIOR'
});
var group_0 = new ol.layer.Group({
    layers: [],
    fold: 'open',
    title: '0'
});
var group_SegmentohorizontalMalla = new ol.layer.Group({
    layers: [],
    fold: 'close',
    title: 'Segmento horizontal - Malla'
});
var group_SegmentoverticalMalla = new ol.layer.Group({
    layers: [],
    fold: 'close',
    title: 'Segmento vertical - Malla'
});
var group_BASEVIAL = new ol.layer.Group({
    layers: [],
    fold: 'open',
    title: 'BASE VIAL'
});
var group_BASEINFERIOR = new ol.layer.Group({
    layers: [],
    fold: 'open',
    title: 'BASE INFERIOR'
});
var group_BASELOTESENTORNO = new ol.layer.Group({
    layers: [],
    fold: 'open',
    title: 'BASE LOTES ENTORNO'
});

lyr_lotesSanBorja_1.setVisible(true); lyr_CuadranteSLO100mx100m_2.setVisible(true); lyr_LmiteSuperficieCnica_3.setVisible(true); lyr_Lmitedistrital_SanBorja_4.setVisible(true);
var layersList = [lyr_lotesSanBorja_1, lyr_CuadranteSLO100mx100m_2, lyr_LmiteSuperficieCnica_3, lyr_Lmitedistrital_SanBorja_4];
lyr_lotesSanBorja_1.set('fieldAliases', { 'CUC': 'CUC', 'Sector': 'Sector', 'COD_LOTE': 'COD_LOTE', 'subsectore': 'subsectore', 'periodo': 'periodo', 'M2_CONSTRU': 'M2_CONSTRU', 'AREA_M2': 'AREA_M2', 'ID': 'ID', });
lyr_CuadranteSLO100mx100m_2.set('fieldAliases', { 'FID': 'FID', 'Altitud_co': 'Altitud_co', 'Altitud_me': 'Altitud_me', 'Altitud_mi': 'Altitud_mi', 'Altitud_ma': 'Altitud_ma', 'Alt_+45': 'Alt_+45', 'SC_5%': 'SC_5%', 'Altura_ml': 'Altura_ml', 'AlturaR_ml': 'AlturaR_ml', 'Nro_Cuadr': 'Nro_Cuadr', 'Horizontal': 'Horizontal', 'Vertical': 'Vertical', 'Cod_Cuadr': 'Cod_Cuadr', 'Alt_RD_Pis': 'Alt_RD_Pis', });
lyr_LmiteSuperficieCnica_3.set('fieldAliases', { 'fid': 'fid', 'Layer': 'Layer', 'PaperSpace': 'PaperSpace', 'SubClasses': 'SubClasses', 'Linetype': 'Linetype', 'EntityHand': 'EntityHand', 'Text': 'Text', 'Comentario': 'Comentario', 'NOMBRE': 'NOMBRE', });
lyr_Lmitedistrital_SanBorja_4.set('fieldAliases', { 'UBIGEO': 'UBIGEO', 'CCDD': 'CCDD', 'CCPP': 'CCPP', 'CCDI': 'CCDI', 'DEPARTAMEN': 'DEPARTAMEN', 'PROVINCIA': 'PROVINCIA', 'DISTRITO': 'DISTRITO', 'OBJECTID': 'OBJECTID', 'ESRI_OID': 'ESRI_OID', 'Area': 'Area', });
lyr_lotesSanBorja_1.set('fieldImages', { 'CUC': 'TextEdit', 'Sector': 'TextEdit', 'COD_LOTE': 'TextEdit', 'subsectore': 'TextEdit', 'periodo': 'TextEdit', 'M2_CONSTRU': 'TextEdit', 'AREA_M2': 'TextEdit', 'ID': 'TextEdit', });
lyr_CuadranteSLO100mx100m_2.set('fieldImages', { 'FID': 'TextEdit', 'Altitud_co': 'TextEdit', 'Altitud_me': 'TextEdit', 'Altitud_mi': 'TextEdit', 'Altitud_ma': 'TextEdit', 'Alt_+45': 'TextEdit', 'SC_5%': 'TextEdit', 'Altura_ml': 'TextEdit', 'AlturaR_ml': 'TextEdit', 'Nro_Cuadr': 'TextEdit', 'Horizontal': 'TextEdit', 'Vertical': 'TextEdit', 'Cod_Cuadr': 'TextEdit', 'Alt_RD_Pis': 'Range', });
lyr_LmiteSuperficieCnica_3.set('fieldImages', { 'fid': 'Range', 'Layer': 'TextEdit', 'PaperSpace': 'CheckBox', 'SubClasses': 'TextEdit', 'Linetype': 'TextEdit', 'EntityHand': 'TextEdit', 'Text': 'TextEdit', 'Comentario': 'TextEdit', 'NOMBRE': 'TextEdit', });
lyr_Lmitedistrital_SanBorja_4.set('fieldImages', { 'UBIGEO': 'TextEdit', 'CCDD': 'TextEdit', 'CCPP': 'TextEdit', 'CCDI': 'TextEdit', 'DEPARTAMEN': 'TextEdit', 'PROVINCIA': 'TextEdit', 'DISTRITO': 'TextEdit', 'OBJECTID': 'TextEdit', 'ESRI_OID': 'TextEdit', 'Area': 'TextEdit', });
lyr_lotesSanBorja_1.set('fieldLabels', { 'CUC': 'no label', 'Sector': 'no label', 'COD_LOTE': 'no label', 'subsectore': 'no label', 'periodo': 'no label', 'M2_CONSTRU': 'no label', 'AREA_M2': 'no label', 'ID': 'no label', });
lyr_CuadranteSLO100mx100m_2.set('fieldLabels', { 'FID': 'hidden field', 'Altitud_co': 'hidden field', 'Altitud_me': 'hidden field', 'Altitud_mi': 'hidden field', 'Altitud_ma': 'hidden field', 'Alt_+45': 'hidden field', 'SC_5%': 'hidden field', 'Altura_ml': 'hidden field', 'AlturaR_ml': 'header label - always visible', 'Nro_Cuadr': 'hidden field', 'Horizontal': 'hidden field', 'Vertical': 'hidden field', 'Cod_Cuadr': 'hidden field', 'Alt_RD_Pis': 'hidden field', });
lyr_LmiteSuperficieCnica_3.set('fieldLabels', { 'fid': 'header label - always visible', 'Layer': 'header label - always visible', 'PaperSpace': 'header label - always visible', 'SubClasses': 'header label - always visible', 'Linetype': 'header label - always visible', 'EntityHand': 'header label - always visible', 'Text': 'header label - always visible', 'Comentario': 'header label - always visible', 'NOMBRE': 'header label - always visible', });
lyr_Lmitedistrital_SanBorja_4.set('fieldLabels', { 'UBIGEO': 'hidden field', 'CCDD': 'hidden field', 'CCPP': 'hidden field', 'CCDI': 'hidden field', 'DEPARTAMEN': 'hidden field', 'PROVINCIA': 'hidden field', 'DISTRITO': 'header label - visible with data', 'OBJECTID': 'hidden field', 'ESRI_OID': 'hidden field', 'Area': 'hidden field', });
lyr_Lmitedistrital_SanBorja_4.on('precompose', function (evt) {
    evt.context.globalCompositeOperation = 'normal';
});



