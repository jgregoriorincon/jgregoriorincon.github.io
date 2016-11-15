/*jslint browser: true*/
/*global $, jQuery, alert, console, Observatorios, Nodos, Dptos, Mpios, Departamentos, Municipios, Sector, Tematicas, NivelTerritorial, L, GeoJSON, loadTematica, loadSector, loadTerritorial, filtrarTodo, limpiarSeleccion, styleNodos, styleDptos, styleMpios, getColorNodos, highlightFeature, resetHighlightNodos, renderMarkersBase, listaNodos, listaSector, listaTematicas, listaNivelTerritorial, positron, positronLabels, OpenStreetMap_Mapnik, Esri_WorldStreetMap, getColorNodos, zoomToFeatureNodos, zoomToFeatureDptos */
/*jslint plusplus: true */

// Variables globales
var map, cartodbAttribution;
// Controles
var info, legend, volver;


// Datos Totales
var filtroData, filtroLayer;
var NodosLayer, DptosLayer, MpiosLayer;

// Seleccion
var NodoSeleccionado, DptoSeleccionado, MpioSeleccionado, CodDaneSeleccionado;

var nodoAnterior, dptoAnterior, mpioAnterior, nivelActual;

// Funcion Principal
$(document).ready(function () {
    "use strict";

    /* ------------------- MAPA ------------------*/
    map = L.map('mapNodos', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: false,
        scrollWheelZoom: true
    });

    map.setView([4.5, -73.0], 6);


    map.createPane('labels');

    // This pane is above markers but below popups
    map.getPane('labels').style.zIndex = 500;

    // Layers in this pane are non-interactive and do not obscure mouse/touch events
    map.getPane('labels').style.pointerEvents = 'none';

    positron.addTo(map);
    positronLabels.addTo(map);

    console.log("Listo Alfa!");

    loadMap();

    console.log("Listo Geo!");

});
