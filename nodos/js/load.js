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
var ObservatoriosLayer;

// Seleccion
var NodoSeleccionado, DptoSeleccionado, MpioSeleccionado;
var NodosSur, NodosCentro, NodosCaribe;
var NodoSur, NodoCentro, NodoCaribe;

var NodosSurPutumayo, NodosSurNarino, NodosSurValleCauca, NodosSurCauca;
var NodosCentroBogota, NodosCentroMeta, NodosCentroBoyaca, NodosCentroSantander, NodosCentroNteSantander;
var NodosCaribeBolivar, NodosCaribeSucre, NodosCaribeMagdalena, NodosCaribeAtlantico;

var nodoAnterior, dptoAnterior, mpioAnterior, nivelActual;

var observatorioIcon = L.icon({
    iconUrl: 'css/Map-Marker.png',
    iconSize: [32, 32],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

// Funcion Principal
$(document).ready(function () {
    "use strict";

    var i, lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaNodos.length; i++) {
        lista += "<option value='" + listaNodos[i] + "'>" + listaNodos[i] + "</option>";
    }
    $("#selNodo").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaSector.length; i++) {
        lista += "<option value='" + listaSector[i] + "'>" + listaSector[i] + "</option>";
    }
    $("#selSector").html(lista);

    lista = "<option value='all'>Todas</option>";
    for (i = 0; i < listaTematicas.length; i++) {
        lista += "<option value='" + listaTematicas[i] + "'>" + listaTematicas[i] + "</option>";
    }
    $("#selTematica").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaNivelTerritorial.length; i++) {
        lista += "<option value='" + listaNivelTerritorial[i] + "'>" + listaNivelTerritorial[i] + "</option>";
    }
    $("#selTerritorial").html(lista);

    $("#buscarPalabra").bind("keypress keyup keydown", function (event) {
        filtrarTodo();
    });

    /* ------------------- MAPA ------------------*/
    map = L.map('map', {
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
