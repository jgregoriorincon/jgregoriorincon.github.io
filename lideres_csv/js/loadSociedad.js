/*jslint browser: true*/
/*global $, jQuery, alert, console, Dptos, Departamentos, Sector, Tematicas, NivelTerritorial, L, GeoJSON, loadTematica, loadSector, loadTerritorial, filtrarTodo, limpiarSeleccion, styleDptos, highlightFeature, listaDepartamentos, listaSector, listaTematicas, listaNivelTerritorial, Stamen_Watercolor, positron, positronLabels, OpenStreetmapSociedad_mapSociedadnik, Esri_WorldStreetmapSociedad, zoomToFeatureDptos */
/*jslint plusplus: true */

// Variables globales
var mapSociedad, cartodbAttribution;
// Controles
var info, legendDpto, legendMpio, volver;

// Datos Totales
var filtroDataDptoPunto, filtroDataDptoPuntoLayer;
var filtroDataMpioPunto, filtroDataMpioPuntoLayer;

var filtroDataDptoPoly, filtroDataDptoPolyLayer;
var filtroDataMpioPoly, filtroDataMpioPolyLayer;

var DptosLayer, MpiosLayer;
var DptosLayerBack,MpiosLayerBack;

var dptoAnterior, mpioAnterior, nivelActual;
var DptoSeleccionado, MpioSeleccionado;

var sociedad_departamento, sociedad_municipio;
var sociedad_departamento_geo, sociedad_departamento_layer;
var sociedad_municipio_geo, sociedad_municipio_layer;
var sociedad_municipio_data;

var SociedadIcon = L.icon({
    iconUrl: 'css/Map-Marker.png',
    iconSize: [32, 32],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var metodo = "k";
var clases = 5;

// Funcion Principal
$(document).ready(function () {
    "use strict";

    $('#buscarPalabraBtn').on('click', function (event) {
        filtrarTodo();
    });

    $('#buscarPalabra').keypress(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });

    var i, lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaDepartamentos.length; i++) {
        lista += "<option value='" + listaDepartamentos[i].CODIGO + "'>" + listaDepartamentos[i].NOMBRE + "</option>";
    }
    $("#selDepartamento").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaSector.length; i++) {
        lista += "<option value='" + listaSector[i] + "'>" + listaSector[i] + "</option>";
    }
    $("#selSector").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaTipoSociedad.length; i++) {
        lista += "<option value='" + listaTipoSociedad[i] + "'>" + listaTipoSociedad[i] + "</option>";
    }
    $("#selTipoSociedad").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaAlcance.length; i++) {
        lista += "<option value='" + listaAlcance[i] + "'>" + listaAlcance[i] + "</option>";
    }
    $("#selAlcance").html(lista);

    /* ------------------- mapSociedadA ------------------*/
    mapSociedad = L.map('mapSociedad', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: true,
        scrollWheelZoom: true
    });

    mapSociedad.setView([4.5, -73.0], 6);


    mapSociedad.createPane('labels');

    // This pane is above markers but below popups
    mapSociedad.getPane('labels').style.zIndex = 500;

    // Layers in this pane are non-interactive and do not obscure mouse/touch events
    mapSociedad.getPane('labels').style.pointerEvents = 'none';

    Stamen_Watercolor.addTo(mapSociedad);
    positronLabels.addTo(mapSociedad);
    
    sociedad_departamento = datosSociedadCivil;
    sociedad_municipio = datosSociedadCivil;

    sociedad_departamento_geo = GeoJSON.parse(sociedad_departamento, {
                    Point: ["LAT_DPTO", "LONG_DPTO"]
                });
    sociedad_municipio_geo = GeoJSON.parse(sociedad_municipio, {
                    Point: ["LAT_MPIO", "LONG_MPIO"]
                });

    loadMap();

});
