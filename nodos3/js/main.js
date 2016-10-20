var NodoSeleccionado, DptoSeleccionado, MpioSeleccionado;
var DptosLayer, MpiosLayer;
var NodosSurPutumayo, NodosSurNarino, NodosSurValleCauca, NodosSurCauca;
var NodosCentroBogota, NodosCentroMeta, NodosCentroBoyaca, NodosCentroSantander, NodosCentroNteSantander;
var NodosCaribeBolivar, NodosCaribeSucre, NodosCaribeMagdalena, NodosCaribeAtlantico;
var NodosSur, NodosCentro, NodosCaribe;
var ObservatoriosLayer;
var ObservatorioSeleccionadosLayer;

var filtroData;
var filtroLayer;

/* Overlay Layers */
var highlight = L.geoJson(null);
/*var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};*/
/* ------------------- MAPA ------------------*/
var map = L.map('map', {
    maxZoom: 18,
    minZoom: 5,
    zoomControl: false
        //, scrollWheelZoom: false
});
map.setView([4.5, -73.0], 6);
map.createPane('labels');
// This pane is above markers but below popups
map.getPane('labels').style.zIndex = 650;
// Layers in this pane are non-interactive and do not obscure mouse/touch events
map.getPane('labels').style.pointerEvents = 'none';
var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>';
var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution
}).addTo(map);
var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
    attribution: cartodbAttribution,
    pane: 'labels'
}).addTo(map);
// Capa de NODOS
var NodosLayer = L.geoJson(undefined, {
        style: styleNodos,
        onEachFeature: function (feature, layer) {
            if (feature.properties.NODO !== "Resto") {
                /*
                layer.bindTooltip("Nodo " + feature.properties.NODO, {
                    permanent: false,
                    direction: "left"
                });*/
                layer.on('mouseover', highlightFeature);
                layer.on('mouseout', resetHighlightNodos);
                layer.on('click', zoomToFeatureNodos);
            }
        }
    })
    // Resaltado
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info.update(layer.feature.properties);
}
// Resaltado
function highlightFeatureMpios(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
    /*
        if (layer.feature.properties.TIENE == 'SI') {
            layer.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layer.bringToFront();
            }


        }
    */
}
// Quitar Resaltado NODOS
function resetHighlightNodos(e) {
    NodosLayer.resetStyle(e.target);
    NodosLayer.setStyle(styleNodos);
    info.update();
}
// Zoom al elemento
function zoomToFeatureNodos(e) {
    var layer = e.target;
    map.fitBounds(e.target.getBounds());
    NodoSeleccionado = layer.feature.properties.NODO;
    map.hasLayer(NodosLayer) === true && map.removeLayer(NodosLayer);
    map.hasLayer(NodosSur) === true && map.removeLayer(NodosSur);
    map.hasLayer(NodosCentro) === true && map.removeLayer(NodosCentro);
    map.hasLayer(NodosCaribe) === true && map.removeLayer(NodosCaribe);
    // Capa de DEPARTAMENTOS
    DptosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.NODO == NodoSeleccionado)
        },
        style: styleNodos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.DEPTO, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);
            layer.on('click', zoomToFeatureDptos);
        }
    })
    map.hasLayer(positronLabels) === true && map.removeLayer(positronLabels);
    DptosLayer.addData(Dptos);
    map.addLayer(DptosLayer);
    if (NodoSeleccionado == 'Sur') {
        NodosSurPutumayo = renderMarkersData(NodoSurPutumayo);
        NodosSurNarino = renderMarkersData(NodoSurNarino);
        NodosSurValleCauca = renderMarkersData(NodoSurValleCauca);
        NodosSurCauca = renderMarkersData(NodoSurCauca, 300);
        map.addLayer(NodosSurPutumayo);
        map.addLayer(NodosSurNarino);
        map.addLayer(NodosSurValleCauca);
        map.addLayer(NodosSurCauca);
    } else if (NodoSeleccionado == 'Centro') {
        NodosCentroBogota = renderMarkersData(NodoCentroBogota);
        NodosCentroMeta = renderMarkersData(NodoCentroMeta);
        NodosCentroBoyaca = renderMarkersData(NodoCentroBoyaca);
        NodosCentroSantander = renderMarkersData(NodoCentroSantander);
        NodosCentroNteSantander = renderMarkersData(NodoCentroNteSantander);
        map.addLayer(NodosCentroBogota);
        map.addLayer(NodosCentroMeta);
        map.addLayer(NodosCentroBoyaca);
        map.addLayer(NodosCentroSantander);
        map.addLayer(NodosCentroNteSantander);
    } else if (NodoSeleccionado == 'Caribe') {
        NodosCaribeAtlantico = renderMarkersData(NodoCaribeAtlantico);
        NodosCaribeMagdalena = renderMarkersData(NodoCaribeMagdalena);
        NodosCaribeSucre = renderMarkersData(NodoCaribeSucre);
        NodosCaribeBolivar = renderMarkersData(NodoCaribeBolivar, 1500);
        map.addLayer(NodosCaribeAtlantico);
        map.addLayer(NodosCaribeMagdalena);
        map.addLayer(NodosCaribeSucre);
        map.addLayer(NodosCaribeBolivar);
    }
}
// Quitar Resaltado DEPARTAMENTOS
function resetHighlightDptos(e) {
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleNodos);
}
// Zoom al elemento
function zoomToFeatureDptos(e) {
    var layer = e.target;
    map.fitBounds(e.target.getBounds());
    DptoSeleccionado = layer.feature.properties.DEPTO;
    map.hasLayer(DptosLayer) === true && map.removeLayer(DptosLayer);
    map.hasLayer(NodosSurPutumayo) === true && map.removeLayer(NodosSurPutumayo);
    map.hasLayer(NodosSurValleCauca) === true && map.removeLayer(NodosSurValleCauca);
    map.hasLayer(NodosSurCauca) === true && map.removeLayer(NodosSurCauca);
    map.hasLayer(NodosSurNarino) === true && map.removeLayer(NodosSurNarino);
    map.hasLayer(NodosCentroBogota) === true && map.removeLayer(NodosCentroBogota);
    map.hasLayer(NodosCentroBoyaca) === true && map.removeLayer(NodosCentroBoyaca);
    map.hasLayer(NodosCentroMeta) === true && map.removeLayer(NodosCentroMeta);
    map.hasLayer(NodosCentroSantander) === true && map.removeLayer(NodosCentroSantander);
    map.hasLayer(NodosCentroNteSantander) === true && map.removeLayer(NodosCentroNteSantander);
    map.hasLayer(NodosCaribeAtlantico) === true && map.removeLayer(NodosCaribeAtlantico);
    map.hasLayer(NodosCaribeBolivar) === true && map.removeLayer(NodosCaribeBolivar);
    map.hasLayer(NodosCaribeMagdalena) === true && map.removeLayer(NodosCaribeMagdalena);
    map.hasLayer(NodosCaribeSucre) === true && map.removeLayer(NodosCaribeSucre);
    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.DEPTO == DptoSeleccionado)
        },
        style: styleMpios,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeatureMpios);
            //layer.on('mouseout', resetHighlightMpios);
            layer.on('click', zoomToFeatureMpios);
        }
    })
    MpiosLayer.addData(Mpios);
    map.addLayer(MpiosLayer);
    switch (DptoSeleccionado) {
    case 'PUTUMAYO':
        NodosSurPutumayo = renderMarkersData(NodoSurPutumayo, 5);
        map.addLayer(NodosSurPutumayo);
        break;
    case 'NARIÑO':
        NodosSurNarino = renderMarkersData(NodoSurNarino, 20);
        map.addLayer(NodosSurNarino);
        break;
    case 'CAUCA':
        NodosSurCauca = renderMarkersData(NodoSurCauca, 15);
        map.addLayer(NodosSurCauca);
        break;
    case 'VALLE DEL CAUCA':
        NodosSurValleCauca = renderMarkersData(NodoSurValleCauca, 50);
        map.addLayer(NodosSurValleCauca);
        break;
    case 'META':
        NodosCentroMeta = renderMarkersData(NodoCentroMeta, 5);
        map.addLayer(NodosCentroMeta);
        break;
    case 'SANTANDER':
        NodosCentroSantander = renderMarkersData(NodoCentroSantander, 5);
        map.addLayer(NodosCentroSantander);
        break;
    case 'NORTE DE SANTANDER':
        NodosCentroNteSantander = renderMarkersData(NodoCentroNteSantander, 15);
        map.addLayer(NodosCentroNteSantander);
        break;
    case 'BOYACÁ':
        NodosCentroBoyaca = renderMarkersData(NodoCentroBoyaca, 5);
        map.addLayer(NodosCentroBoyaca);
        break;
    case 'BOGOTÁ D.C.':
        NodosCentroBogota = renderMarkersData(NodoCentroBogota, 25);
        map.addLayer(NodosCentroBogota);
        break;
        /*case 'CUNDINAMARCA':
            NodosCentroCundinamarca = renderMarkersData(NodoCentroCundinamarca, 5);
            map.addLayer(NodosCentroCundinamarca);
            break;*/
    case 'ATLANTICO':
        NodosCaribeAtlantico = renderMarkersData(NodoCaribeAtlantico, 5);
        map.addLayer(NodosCaribeAtlantico);
        break;
    case 'MAGDALENA':
        NodosCaribeMagdalena = renderMarkersData(NodoCaribeMagdalena, 5);
        map.addLayer(NodosCaribeMagdalena);
        break;
    case 'SUCRE':
        NodosCaribeSucre = renderMarkersData(NodoCaribeSucre, 5);
        map.addLayer(NodosCaribeSucre);
        break;
    case 'BOLÍVAR':
        NodosCaribeBolivar = renderMarkersData(NodoCaribeBolivar, 15);
        map.addLayer(NodosCaribeBolivar);
        break;
    }
}
// Quitar Resaltado MUNIcipios
function resetHighlightMpios(e) {
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleMpios);
}
// Zoom al elemento
function zoomToFeatureMpios(e) {
    var layer = e.target;
    if (layer.feature.properties.TIENE == 'SI') {
        map.fitBounds(e.target.getBounds());
        MpioSeleccionado = layer.feature.properties.COD_DANE;
        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });
        map.addLayer(positron);
        // Capa de MUNICIPIOS
        MpiosLayer = L.geoJson(undefined, {
            filter: function (feature) {
                return (feature.properties.COD_DANE == MpioSeleccionado)
            },
            style: styleNodos,
            onEachFeature: function (feature, layer) {
                layer.bindTooltip(feature.properties.NOMBRE, {
                    permanent: true,
                    direction: "auto"
                });
                layer.on('mouseover', highlightFeatureMpios);
                //layer.on('mouseout', resetHighlightMpios);
                //layer.on('click', zoomToFeatureMpios);
            }
        })
        MpiosLayer.addData(Mpios);
        map.addLayer(MpiosLayer);
        var ObservatoriosData = JSON.parse(JSON.stringify(Observatorios));
        ObservatoriosData.features = ObservatoriosData.features.filter(function (a) {
            return a.properties.CODDANE == MpioSeleccionado;
        });
        ObservatoriosLayer = renderMarkersData(ObservatoriosData, 50);
        map.addLayer(ObservatoriosLayer);
    }
}
NodosLayer.addData(Nodos);
NodosLayer.addTo(map);

/// OJO
NodoSur = JSON.parse(JSON.stringify(Observatorios));
NodoSur.features = NodoSur.features.filter(function (a) {
    return a.properties.NODO == 'Sur';
});
NodosSur = renderMarkersBase(NodoSur);
//NodosSur = renderMarkersData(NodoSur, 0.01);

NodoCentro = JSON.parse(JSON.stringify(Observatorios));
NodoCentro.features = NodoCentro.features.filter(function (a) {
    return a.properties.NODO == 'Centro';
});
NodosCentro = renderMarkersBase(NodoCentro);

NodoCaribe = JSON.parse(JSON.stringify(Observatorios));
NodoCaribe.features = NodoCaribe.features.filter(function (a) {
    return a.properties.NODO == 'Caribe';
});
NodosCaribe = renderMarkersBase(NodoCaribe);

map.addLayer(NodosSur);
map.addLayer(NodosCentro);
map.addLayer(NodosCaribe);
//markerLayer.ProcessView();
// OBSERVATORIOS
function renderMarkersBase(data, distancia = 1500) {
    var cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: distancia
    });
    var layer = L.geoJson(data);
    layer.setZIndex(700);
    cluster.addLayer(layer);
    return cluster;
}
// OBSERVATORIOS
function renderMarkersData(data, distancia = 100) {
    var cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: distancia
    });
    var layer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            if (feature.properties) {

                var Telefono = feature.properties.TELEFONO;
                var TelefonoStr = '';
                if (Telefono.length > 0) {
                    Telefono.forEach(function (entry) {
                        TelefonoStr += entry + '<br />';
                    });
                }

                var Correo = feature.properties.CORREO;
                var CorreoStr = '';
                if (Correo.length > 0) {
                    Correo.forEach(function (entry) {
                        CorreoStr += entry + '<br />';
                    });
                }

                var logo = "<center><img class='imgLogo' src='images/" + feature.properties.IDENTIFICADOR + ".png' alt='" + feature.properties.OBSERVATORIO + "' style='height:100px;'></center>";
                var logo = "<center><img class='imgLogo' src='images/" + feature.properties.IDENTIFICADOR + ".png' alt='" + feature.properties.OBSERVATORIO + "' style='height:100px;'></center>";
                var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Tipo Observatorio</th><td>" + feature.properties.SECTOR + "</td></tr>" + "<tr><th>Dirección</th><td>" + feature.properties.DIRECCION + ', ' + feature.properties.MUNICIPIO + ', ' + feature.properties.DEPARTAMENTO + "</td></tr>" + (TelefonoStr == '' ? '' : "<tr><th>Teléfono</th><td>" + TelefonoStr + "</td></tr>") + (CorreoStr == '' ? '' : "<tr><th>Correo Electrónico</th><td>" + CorreoStr + "</td></tr>") + (feature.properties.SITIO_WEB == '' ? '' : "<tr><th>Web</th><td><a class='url-break' href='" + feature.properties.SITIO_WEB + "' target='_blank'>" + feature.properties.SITIO_WEB + "</a></td></tr>") + (feature.properties.FACEBOOK == '' ? '' : "<tr><th>Facebook</th><td>" + feature.properties.FACEBOOK + "</td></tr>") + (feature.properties.TWITER == '' ? '' : "<tr><th>Twitter</th><td>" + feature.properties.TWITER + "</td></tr>") + "<table>";

                var tematicas = feature.properties.TEMATICA;
                var tematicasStr = '';
                if (tematicas.length > 0) {
                    tematicas.forEach(function (entry) {
                        tematicasStr += entry + '<br />';
                    });
                }

                var territorial = feature.properties.NIVEL_TERRITORIAL;
                var territorialStr = '';
                if (territorial.length > 0) {
                    territorial.forEach(function (entry) {
                        territorialStr += entry + '<br />';
                    });
                }

                var tipoinformacion = feature.properties.TIPO_INFORMACION;
                var tipoinformacionStr = '';
                if (tipoinformacion.length > 0) {
                    tipoinformacion.forEach(function (entry) {
                        tipoinformacionStr += entry + '<br />';
                    });
                }

                var productos = feature.properties.PRODUCTOS;
                var productosStr = productos;

                layer.on({
                    click: function (e) {
                        $("#feature-title").html('<center>' + feature.properties.OBSERVATORIO + '</center>');
                        $("#logoObservatorio").html(logo);
                        $("#feature-info").html(infobasica);
                        $("#tematicas").html(tematicasStr);
                        tematicasStr == '' || tematicasStr == '<br>' ? $('#tematicasTab').attr('class', 'disabled') : $('#tematicasTab').attr('class', '');
                        $('#tematicasTab').click(function (event) {
                            if ($(this).hasClass('disabled')) {
                                return false;
                            }
                        });
                        $("#territorial").html(territorialStr);
                        territorialStr == '' || territorialStr == '<br>' ? $('#territorialTab').attr('class', 'disabled') : $('#territorialTab').attr('class', '');
                        $('#territorialTab').click(function (event) {
                            if ($(this).hasClass('disabled')) {
                                return false;
                            }
                        });
                        $("#tipoinformacion").html(tipoinformacionStr);
                        tipoinformacionStr == '' || tipoinformacionStr == '<br>' ? $('#tipoinformacionTab').attr('class', 'disabled') : $('#tipoinformacionTab').attr('class', '');
                        $('#tipoinformacionTab').click(function (event) {
                            if ($(this).hasClass('disabled')) {
                                return false;
                            }
                        });
                        $("#productos").html(productosStr);
                        productosStr == '' || productosStr == '<br>' ? $('#productosTab').attr('class', 'disabled') : $('#productosTab').attr('class', '');
                        $('#productosTab').click(function (event) {
                            if ($(this).hasClass('disabled')) {
                                return false;
                            }
                        });
                        //$('#feature-info').tab('show');
                        $('.nav-tabs a[href="#feature-info"]').tab('show');
                        $("#featureModal").modal("show");
                    }
                });
            }
        }
    });
    layer.setZIndex(700);
    cluster.addLayer(layer);
    return cluster;
}
/* ------------------- CONTROLES ------------------*/
var legend = L.control({
    position: 'topright'
});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = ['Caribe', 'Centro', 'Sur'],
        labels = [],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        labels.push('<i style="background:' + getColorNodos(from) + '"></i> Nodo ' + from + '<br />');
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);

map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');
// control that shows state info on hover
var info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info popup');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = (props ? props.TOTAL ? '<h4><center>ObservaDHores</center></h4><p align="right"><b>' + (props.NOMBRE ? 'Municipio ' + props.NOMBRE : props.DEPTO ? 'Departamento ' + props.DEPTO : props.NODO ? 'Nodo ' + props.NODO : '') + '</b><br /><br />' + (props.ACADEMIA ? 'Académicos: ' + props.ACADEMIA + '<br />' : '') + (props.GOBIERNO ? 'Gubernamentales: ' + props.GOBIERNO + '<br />' : '') + (props.PRIVADO ? 'Privados: ' + props.PRIVADO + '<br />' : '') + (props.SOCIEDAD ? 'Sociedad Civil: ' + props.SOCIEDAD + '<br />' : '') + (props.OTRO ? 'Otros: ' + props.OTRO + '<br />' : '') + (props.TOTAL ? '<br /><b>Total ' + props.TOTAL + '</p></b>' : '') : '' : 'Pase el cursor sobre un elemento');
};

info.addTo(map);
$('[data-toggle="tooltip"]').tooltip();


// add minimap control to the map
var baseLayers = {};
var overlays = {};

baseLayers["ESRI WorldStreet"] = Esri_WorldStreetMap;
//baseLayers["OpenStreetMap"] = OpenStreetMap_Mapnik;
baseLayers["CartoLight Sin Labels"] = positron;

overlays["Labels"] = positronLabels;

var layersControl = L.control.layers.minimap(baseLayers, overlays, {
    collapsed: false,
    position: 'bottomright'
});//.addTo(map);


$('#mapFull').click(function () {
    limpiarSeleccion();
});

var $table = $('#table'),
    $button = $('#btnMapearSeleccionador');
$(function () {
    $('#modalTable').on('shown.bs.modal', function () {
        $table.bootstrapTable('refresh');
        $table.bootstrapTable('resetView');
    });
});

function romperFilas(value, row, index) {
    return value = value.replace(/;/g, '<br>');
}
$(function () {
    loadTematica();
    loadSector();
    loadTerritorial();
    loadDepartamentos();

    $button.click(function () {
        var seleccionados = $table.bootstrapTable('getSelections');
        if (seleccionados.length < 1) {
            alert('No se seleccionaron elementos');
            return;
        } else {
            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });
            var arraySeleccionados = [];
            for (var i = 0; i < seleccionados.length; i++) {
                arraySeleccionados.push(seleccionados[i].IDENTIFICADOR);
            }
            var ObservatoriosSeleccionados = [];
            for (var i = 0; i < arraySeleccionados.length; i++) {
                var tempo = JSON.parse(JSON.stringify(Observatorios));
                tempo.features = tempo.features.filter(function (a) {
                    return a.properties.IDENTIFICADOR == arraySeleccionados[i];
                });
                ObservatoriosSeleccionados.push(tempo);
            }
            map.addLayer(positron);
            map.addLayer(positronLabels);
            map.addLayer(NodosLayer);
            ObservatorioSeleccionadosLayer = renderMarkersData(ObservatoriosSeleccionados, 0.01);
            map.addLayer(ObservatorioSeleccionadosLayer);
            map.fitBounds(ObservatorioSeleccionadosLayer.getBounds());
            $('#modalTable').modal('hide');
        }
    });
});

function loadDepartamentos() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";
    for (var i = 0; i < Departamentos.length; i++) {
        lista += "<option value='" + Departamentos[i] + "'>" + Departamentos[i] + "</option>";
    }
    $("#selDepartamento").html(lista);
}

function loadSector() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";
    for (var i = 0; i < Sector.length; i++) {
        lista += "<option value='" + Sector[i] + "'>" + Sector[i] + "</option>";
    }
    $("#selSector").html(lista);
}

function loadTematica() {
    "use strict";
    var lista = "<option value='all'>Todas</option>";
    for (var i = 0; i < Tematicas.length; i++) {
        lista += "<option value='" + Tematicas[i] + "'>" + Tematicas[i] + "</option>";
    }
    $("#selTematica").html(lista);
}

function loadTerritorial() {
    "use strict";
    var lista = "<option value='all'>Todos</option>";
    for (var i = 0; i < NivelTerritorial.length; i++) {
        lista += "<option value='" + NivelTerritorial[i] + "'>" + NivelTerritorial[i] + "</option>";
    }
    $("#selTerritorial").html(lista);
}

function filtrarTodo() {

    var DPTO = document.getElementById('selDepartamento').value;
    var Mpio = document.getElementById('selMunicipio').value;
    var Sector = document.getElementById('selSector').value;
    var Tematica = document.getElementById('selTematica').value;
    var Territorial = document.getElementById('selTerritorial').value;

    if ((DPTO != 'all') || (Mpio != 'all') || (Sector != 'all') || (Tematica != 'all') || (Territorial != 'all')) {

        //map.hasLayer(NodosLayer) === true && map.removeLayer(NodosLayer);
        map.hasLayer(NodosSur) === true && map.removeLayer(NodosSur);
        map.hasLayer(NodosCentro) === true && map.removeLayer(NodosCentro);
        map.hasLayer(NodosCaribe) === true && map.removeLayer(NodosCaribe);
        map.hasLayer(filtroLayer) === true && map.removeLayer(filtroLayer);

        filtroData = JSON.parse(JSON.stringify(Observatorios));

        if (DPTO != 'all') {
            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.DEPARTAMENTO == DPTO;
            });
        }

        if (Mpio != 'all') {

            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.MUNICIPIO == Mpio;
            });
        }

        if (Sector != 'all') {
            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.SECTOR == Sector;
            });
        }

        if (Tematica != 'all') {

            filtroData.features = filtroData.features.filter(function (a) {
                if (a.properties.TEMATICA.length > 0) {
                    for (i = 0; i < a.properties.TEMATICA.length; i++) {
                        if (a.properties.TEMATICA[i] == Tematica) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        if (Territorial != 'all') {

            filtroData.features = filtroData.features.filter(function (a) {
                if (a.properties.NIVEL_TERRITORIAL.length > 0) {
                    for (i = 0; i < a.properties.NIVEL_TERRITORIAL.length; i++) {
                        if (a.properties.NIVEL_TERRITORIAL[i] == Territorial) {
                            return true;
                        }
                    }
                }
                return false;
            });

        }

        if (filtroData.features.length > 0) {
            filtroLayer = renderMarkersData(filtroData, 15);
            map.addLayer(filtroLayer);
            map.fitBounds(filtroLayer.getBounds());
        }

        $("#total_places").text(filtroData.features.length);
    } else {
        limpiarSeleccion();
    }

}

function filtrarDepartamento() {

    var myselect = document.getElementById("selDepartamento");
    var DPTO = myselect.options[myselect.selectedIndex].value;

    if (DPTO != 'all') {

        var Mpios = Municipios[DPTO] || [];

        var lista = "<option value='all'>Todos</option>";
        var html = lista + $.map(Mpios, function (Mpio) {
            return '<option value="' + Mpio + '">' + Mpio + '</option>'
        }).join('');
        $("#selMunicipio").html(html);

        filtrarTodo();

    } else {
        if (document.getElementById('selMunicipio').options.length > 1) {
            for (var i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }
    }

}

function filtrarMunicipio() {

    filtrarTodo();
}

function filtrarSector() {

    filtrarTodo();

}

function filtrarTematica() {

    filtrarTodo();

}

function filtrarTerritorial() {

    filtrarTodo();

}

function limpiarSeleccion() {

    map.setView(new L.LatLng(4.5, -73.0), 6);
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(positron);
    map.addLayer(positronLabels);
    map.addLayer(NodosLayer);
    map.addLayer(NodosSur);
    map.addLayer(NodosCentro);
    map.addLayer(NodosCaribe);

    document.getElementById('selDepartamento').value = 'all';
    document.getElementById('selMunicipio').value = 'all';
    document.getElementById('selSector').value = 'all';
    document.getElementById('selTematica').value = 'all';
    document.getElementById('selTerritorial').value = 'all';

    if (document.getElementById('selMunicipio').options.length > 1) {
        for (var i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
            document.getElementById('selMunicipio').remove(i);
        }
    }
    filtroData = JSON.parse(JSON.stringify(Observatorios));
    $("#total_places").text(0);

}
