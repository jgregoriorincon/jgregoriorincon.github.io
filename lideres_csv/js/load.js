/*jslint browser: true*/
/*global $, jQuery, alert, console, Dptos, Mpios, Departamentos, Municipios, Sector, Tematicas, NivelTerritorial, L, GeoJSON, loadTematica, loadSector, loadTerritorial, filtrarTodo, limpiarSeleccion, styleDptos, styleMpios, highlightFeature, listaDepartamentos, listaSector, listaTematicas, listaNivelTerritorial, Stamen_Watercolor, positron, positronLabels, OpenStreetMap_Mapnik, Esri_WorldStreetMap, zoomToFeatureDptos */
/*jslint plusplus: true */

// Variables globales
var map, cartodbAttribution;
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

var hechos_departamento, hechos_municipio;
var hechos_departamento_geo, hechos_departamento_layer;
var hechos_municipio_geo, hechos_municipio_layer;
var hechos_municipio_data;

var hechoIcon = L.icon({
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
    for (i = 0; i < listaAnnos.length; i++) {
        lista += "<option value='" + listaAnnos[i] + "'>" + listaAnnos[i] + "</option>";
    }
    $("#selAnnos").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaTipoHecho.length; i++) {
        lista += "<option value='" + listaTipoHecho[i] + "'>" + listaTipoHecho[i] + "</option>";
    }
    $("#selTipoHecho").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaGrupo.length; i++) {
        lista += "<option value='" + listaGrupo[i] + "'>" + listaGrupo[i] + "</option>";
    }
    $("#selGrupo").html(lista);

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < listaEsAgente.length; i++) {
        lista += "<option value='" + listaEsAgente[i] + "'>" + listaEsAgente[i] + "</option>";
    }
    $("#selEsAgente").html(lista);

    /* ------------------- MAPA ------------------*/
    map = L.map('map', {
        maxZoom: 18,
        minZoom: 5,
        zoomControl: true,
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
    
    hechos_departamento = datosHechos;
    hechos_municipio = datosHechos;

    hechos_departamento_geo = GeoJSON.parse(hechos_departamento, {
                    Point: ["LAT_DPTO", "LONG_DPTO"]
                });
    hechos_municipio_geo = GeoJSON.parse(hechos_municipio, {
                    Point: ["LAT_MPIO", "LONG_MPIO"]
                });

    loadMap();

});
