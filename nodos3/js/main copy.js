var NodoSeleccionado, DptoSeleccionado, MpioSeleccionado;
var DptosLayer, MpiosLayer;
var NodosSurPutumayo, NodosSurNarino, NodosSurValleCauca, NodosSurCauca;
var NodosCentroBogota, NodosCentroMeta, NodosCentroBoyaca, NodosCentroSantander, NodosCentroNteSantander;
var NodosCaribeBolivar, NodosCaribeSucre, NodosCaribeMagdalena, NodosCaribeAtlantico;
var NodosSur, NodosCentro, NodosCaribe;
var ObservatoriosLayer;
var ObservatorioSeleccionadosLayer;



/* Overlay Layers */
var highlight = L.geoJson(null);
/*var highlightStyle = {
    stroke: false,
    fillColor: "#00FFFF",
    fillOpacity: 0.7,
    radius: 10
};*/




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




/// OJO
NodoSur = JSON.parse(JSON.stringify(Observatorios));
NodoSur.features = NodoSur.features.filter(function (a) {
    return a.properties.NODO == 'Sur';
});
NodosSur = renderMarkersBase(NodoSur);
//NodosSur = renderMarkersData(NodoSur, 0.0001);

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


// add minimap control to the map
/*
var baseLayers = {};
var overlays = {};

baseLayers["ESRI WorldStreet"] = Esri_WorldStreetMap;
//baseLayers["OpenStreetMap"] = OpenStreetMap_Mapnik;
baseLayers["CartoLight Sin Labels"] = positron;

overlays["Labels"] = positronLabels;

var layersControl = L.control.layers.minimap(baseLayers, overlays, {
    collapsed: false,
    position: 'bottomright'
}).addTo(map);
*/

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

    
    $("#buscarPalabra").bind("keypress keyup keydown", function (event) {
        filtrarTodo();
    });
    
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


