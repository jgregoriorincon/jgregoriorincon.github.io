/*jslint browser: true*/
/*global $, jQuery, alert, console, Observatorios, Nodos, Dptos, Mpios, Departamentos, Municipios, Sector, Tematicas, NivelTerritorial, L, GeoJSON, loadTematica, loadSector, loadTerritorial, filtrarTodo, limpiarSeleccion, styleNodos, styleDptos, styleMpios, getColorNodos, highlightFeature, resetHighlightNodos, renderMarkersBase, listaDepartamentos, listaSector, listaTematicas, listaNivelTerritorial, Stamen_Watercolor, positron, positronLabels, OpenStreetMap_Mapnik, Esri_WorldStreetMap, getColorNodos, zoomToFeatureNodos, zoomToFeatureDptos */
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
    for (i = 0; i < listaDepartamentos.length; i++) {
        lista += "<option value='" + listaDepartamentos[i].CODIGO + "'>" + listaDepartamentos[i].NOMBRE + "</option>";
    }
    $("#selDepartamento").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaTipoAccion.length; i++) {
        lista += "<option value='" + listaTipoAccion[i] + "'>" + listaTipoAccion[i] + "</option>";
    }
    $("#selTipoAccion").html(lista);

    lista = "<option value='all'>Todas</option>";
    for (i = 0; i < listaTipoLider.length; i++) {
        lista += "<option value='" + listaTipoLider[i] + "'>" + listaTipoLider[i] + "</option>";
    }
    $("#selTipoLider").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaResponsables.length; i++) {
        lista += "<option value='" + listaResponsables[i] + "'>" + listaResponsables[i] + "</option>";
    }
    $("#selResponsable").html(lista);

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

    Stamen_Watercolor.addTo(map);
    positronLabels.addTo(map);

    console.log("Listo Alfa!");

    loadMap();

    console.log("Listo Geo!");

});
