function loadMap() {
    "use strict";

    var i;
	console.log(Observatorios);
    //Convierte el dato JSON en GeoJSON
    Observatorios = GeoJSON.parse(Observatorios, {
        Point: ['LAT', 'LONG']
    });
	console.log(Observatorios);
    var baseMaps = {
        "Base Gris": positron,
        "Base OSM": OpenStreetMap_Mapnik,
        "Base Calles": Esri_WorldStreetMap
    };

    var overlays = {
        "Etiquetas": positronLabels
    };

    L.control.layers(baseMaps, overlays, {
        position: 'bottomright',
        collapsed: false
    }).addTo(map);

    /* ------------------- CONTROLES ------------------*/
    legend = L.control({
        position: 'topright'
    });
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = ['Caribe', 'Centro', 'Sur'],
            labels = [],
            from;

        for (i = 0; i < grades.length; i++) {
            from = grades[i];
            labels.push('<i style="background:' + getColorNodos(from) + '"></i> Nodo ' + from + '<br />');
        }
        div.innerHTML = labels.join('<br>');
        return div;
    };
    legend.addTo(map);

    volver = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'volver-control');
            container.innerHTML = '<form><img src="css/back-icon.png" alt="VOLVER" style="width:64px;height:64px;"><br />Ir a Vista Anterior</form>';
            container.style.cursor = 'pointer';

            container.onclick = function () {
                //console.log(zoomAnterior);
                console.log(nivelActual);

                if (nivelActual === 'Mpio') {
                    zoomToFeatureDptos(dptoAnterior);
                    nivelActual = 'Dpto';
                } else if (nivelActual === 'Dpto') {
                    //zoomToFeatureDptos(zoomAnterior);
                    zoomToFeatureNodos(nodoAnterior);
                    nivelActual = 'Nodo';
                } else if (nivelActual === 'Nodo') {
                    limpiarSeleccion();
                    //nivelActual = "Pais";
                } else {
                    zoomToFeatureDptos(mpioAnterior);
                    nivelActual = 'Mpio';
                }
            };

            return container;
        }
    });

    map.addControl(new volver());

    map.attributionControl.addAttribution('observaDHores &copy; <a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>');

    // control that shows state info on hover
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'panel panel-primary divinfo text-right'); // 'info popup');
        this.update();
        return this._div;
    };

    info.update = function (props) {

        var strInstrucciones = '<div><div class="alert alert-info margin-5" id="left" > Pase el cursor sobre un elemento para obtener información </div> <div id="right" ><span class="fa fa-info fa-2x text-info aria-hidden="true"></span> </div></div><div><div class="alert alert-info margin-5" id="left" > De clic en un Nodo, Departamento o Municipio para acceder a los observatorios </div> <div id="right" ><span class="fa fa-globe fa-2x text-info aria-hidden="true"></span> </div></div><div><div class="alert alert-info margin-5" id="left" > De clic en los iconos de los observatorios para obtener más información sobre estos. </div> <div id="right" ><span class="fa fa-map-marker fa-2x text-info aria-hidden="true"></span> </div></div>';

        var strEncabezado = '<div class="panel-body text-right">';

        var strTitulo = props ? '<thead><tr><th colspan="2" style="text-align:center">' + (props.NOMBRE ? '' + props.NOMBRE : props.DEPTO ? props.DEPTO : props.NODO ? 'Nodo ' + props.NODO : '') + '</th></tr></thead>' : '';
        var strAcademia = props ? props.ACADEMIA ? '<tr><th>Académicos</th><td>' + props.ACADEMIA + '</td></tr>' : '' : '';
        var strOtro = props ? props.OTRO ? '<tr><th>Otros</th><td>' + props.OTRO + '</td></tr>' : '' : '';
        var strPrivado = props ? props.PRIVADO ? '<tr><th>Privados</th><td>' + props.PRIVADO + '</td></tr>' : '' : '';
        var strGobierno = props ? props.GOBIERNO ? '<tr><th>Gubernamentales</th><td>' + props.GOBIERNO + '</td></tr>' : '' : '';
        var strSociedad = props ? props.SOCIEDAD ? '<tr><th>Sociedad Civil</th><td>' + props.SOCIEDAD + '</td></tr>' : '' : '';
        var strTotal = props ? props.TOTAL ? '<tr>' + '<th>Total</th><th>' + props.TOTAL + '</th   ></tr>' : '' : '';

        var finalHTML = props ? props.TOTAL ? strEncabezado + '<table class="table table-striped">' + strTitulo + '</b>' + strAcademia + strGobierno + strPrivado + strSociedad + strOtro + strTotal + '</table>' : '' : strInstrucciones + '</div>';

        this._div.innerHTML = finalHTML === '' ? '' : finalHTML;

    };

    info.addTo(map);
    $('[data-toggle="tooltip"]').tooltip();

    // Capa de NODOS
    NodosLayer = L.geoJson(undefined, {
        style: styleNodos,
        onEachFeature: function (feature, layer) {
            if (feature.properties.NODO !== "Resto") {
                layer.on('mouseover', highlightFeature);
                layer.on('mouseout', resetHighlightNodos);
                layer.on('click', zoomToFeatureNodos);
            }
        }
    });

    /// Carga de los nodos
    // Sur
    NodoSur = JSON.parse(JSON.stringify(Observatorios));
    NodoSur.features = NodoSur.features.filter(function (a) {
        return a.properties.NODO === 'Sur';
    });
    NodosSur = renderMarkersBase(NodoSur);

    // Centro
    NodoCentro = JSON.parse(JSON.stringify(Observatorios));
    NodoCentro.features = NodoCentro.features.filter(function (a) {
        return a.properties.NODO === 'Centro';
    });
    NodosCentro = renderMarkersBase(NodoCentro);

    // Caribe
    NodoCaribe = JSON.parse(JSON.stringify(Observatorios));
    NodoCaribe.features = NodoCaribe.features.filter(function (a) {
        return a.properties.NODO === 'Caribe';
    });
    NodosCaribe = renderMarkersBase(NodoCaribe);

    // Adiciona las capas
    NodosLayer.addData(Nodos);
    NodosLayer.addTo(map);

    map.addLayer(NodosSur);
    map.addLayer(NodosCentro);
    map.addLayer(NodosCaribe);

}

/**
 * Asigna colores por el nodo
 * @param   {[[Type]]} d valor del nodo
 * @returns {[[Type]]} color asignado al nodo
 */
function getColorNodos(d) {
    "use strict";

    return d === 'Caribe' ? '#b2df8a' :
        d === 'Centro' ? '#fdcb7b' :
        d === 'Sur' ? '#a5bfdd' : '#f1f4c7';
}

/**
 * Ajusta la simbologia de los nodos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleNodos(feature) {
    "use strict";

    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

/**
 * Filtrar los nodos
 */
function filtrarNodo() {
    "use strict";

    //var myselect = document.getElementById("selDepartamento"),
    //var DPTO = myselect.options[myselect.selectedIndex].value;

    var i, lista, html, Dpto, Nodo = $('#selNodo').val();

    if (Nodo !== 'all') {
        Dpto = listaDepartamentos[Nodo] || [];
        lista = "<option value='all'>Todos</option>";
        html = lista + $.map(Dpto, function (Dpto) {
            return '<option value="' + Dpto + '">' + Dpto + '</option>';
        }).join('');

        $("#selDepartamento").html(html);

        filtrarTodo();

    } else {
        if (document.getElementById('selDepartamento').options.length > 1) {
            for (i = document.getElementById('selDepartamento').options.length - 1; i >= 1; i--) {
                document.getElementById('selDepartamento').remove(i);
            }
        }

        if (document.getElementById('selMunicipio').options.length > 1) {
            for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }

        var Nodo = document.getElementById('selNodo').value,
            Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Sector = document.getElementById('selSector').value,
            Tematica = document.getElementById('selTematica').value,
            Territorial = document.getElementById('selTerritorial').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

        if ((Nodo !== 'all') || (Dpto !== 'all') || (Mpio !== 'all') || (Sector !== 'all') || (Tematica !== 'all') || (Territorial !== 'all') || (FiltroTexto !== '')) {
            // No hace nada
        } else {
            limpiarSeleccion();
        }
    }
}

/**
 * Filtrar Departamento
 * @param   {[[Type]]} DPTO Nombre del Departamento
 * @returns {[[Type]]} [[Description]]
 */
function filtrarDepto(DPTO) {
    "use strict";

    var Departamento = JSON.parse(JSON.stringify(Observatorios));
    Departamento.features = Departamento.features.filter(function (a) {
        return a.properties.DEPARTAMENTO == DPTO;
    });
    return Departamento;
}

/**
 * Recupera la seleccion del departamento y carga la lista de municipios asociados
 * @returns {string} la lista de municipios
 */
function filtrarDepartamento() {
    "use strict";

    var i, Mpios, lista, html, Dpto = $('#selDepartamento').val();

    if (Dpto !== 'all') {
        Mpios = listaMunicipios[Dpto] || [];
        lista = "<option value='all'>Todos</option>";
        html = lista + $.map(Mpios, function (Mpio) {
            return '<option value="' + Mpio + '">' + Mpio + '</option>';
        }).join('');

        $("#selMunicipio").html(html);

        filtrarTodo();

    } else {
        if (document.getElementById('selMunicipio').options.length > 1) {
            for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }

        var Nodo = document.getElementById('selNodo').value,
            Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Sector = document.getElementById('selSector').value,
            Tematica = document.getElementById('selTematica').value,
            Territorial = document.getElementById('selTerritorial').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

        if ((Nodo !== 'all') || (Dpto !== 'all') || (Mpio !== 'all') || (Sector !== 'all') || (Tematica !== 'all') || (Territorial !== 'all') || (FiltroTexto !== '')) {
            // No hace nada
        } else {
            limpiarSeleccion();
        }
    }
}

/**
 * [[filtra los observatorios por las opciones del sidebar]]
 * @returns {boolean} filtra la capa de observatorios 'filtroData'
 */
function filtrarTodo() {
    "use strict";

    var i,
        Nodo = document.getElementById('selNodo').value,
        Dpto = document.getElementById('selDepartamento').value,
        Mpio = document.getElementById('selMunicipio').value,
        Sector = document.getElementById('selSector').value,
        Tematica = document.getElementById('selTematica').value,
        Territorial = document.getElementById('selTerritorial').value,
        FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

    if ((Nodo !== 'all') || (Dpto !== 'all') || (Mpio !== 'all') || (Sector !== 'all') || (Tematica !== 'all') || (Territorial !== 'all') || (FiltroTexto !== '')) {

        //map.hasLayer(NodosLayer) === true && map.removeLayer(NodosLayer);
        map.hasLayer(NodosSur) === true && map.removeLayer(NodosSur);
        map.hasLayer(NodosCentro) === true && map.removeLayer(NodosCentro);
        map.hasLayer(NodosCaribe) === true && map.removeLayer(NodosCaribe);
        map.hasLayer(filtroLayer) === true && map.removeLayer(filtroLayer);

        filtroData = JSON.parse(JSON.stringify(Observatorios));

        if (Nodo !== 'all') {
            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.NODO === Nodo;
            });
        }

        if (Dpto !== 'all') {
            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.DEPARTAMENTO === Dpto;
            });
        }

        if (Mpio !== 'all') {

            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.MUNICIPIO === Mpio;
            });
        }

        if (Sector !== 'all') {
            filtroData.features = filtroData.features.filter(function (a) {
                return a.properties.SECTOR === Sector;
            });
        }

        if (Tematica !== 'all') {

            filtroData.features = filtroData.features.filter(function (a) {
                if (a.properties.TEMATICA.length > 0) {
                    for (i = 0; i < a.properties.TEMATICA.length; i++) {
                        if (a.properties.TEMATICA[i] === Tematica) {
                            return true;
                        }
                    }
                }
                return false;
            });
        }

        if (Territorial !== 'all') {

            filtroData.features = filtroData.features.filter(function (a) {
                if (a.properties.NIVEL_TERRITORIAL.length > 0) {
                    for (i = 0; i < a.properties.NIVEL_TERRITORIAL.length; i++) {
                        if (a.properties.NIVEL_TERRITORIAL[i] === Territorial) {
                            return true;
                        }
                    }
                }
                return false;
            });

        }

        if (FiltroTexto.toUpperCase() !== '') {
            filtroData.features = filtroData.features.filter(function (a) {

                var k1 = a.properties.DEPARTAMENTO.toUpperCase(),
                    k2 = a.properties.MUNICIPIO.toUpperCase(),
                    k3 = a.properties.OBSERVATORIO.toUpperCase(),
                    k4 = a.properties.NODO.toUpperCase(),
                    k5 = a.properties.ALIADOS.toUpperCase(),
                    k6 = a.properties.PRODUCTOS.toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto)) || (k6.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

        }

        if (filtroData.features.length > 0) {

            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });

            map.addLayer(positron);
            map.addLayer(positronLabels);

            // Capa de NODOS
            var NodosLayerFiltro = L.geoJson(undefined, {
                style: styleNodosFiltro
            });

            // Adiciona las capas
            NodosLayerFiltro.addData(Nodos);
            NodosLayerFiltro.addTo(map);

            filtroLayer = renderMarkersData(filtroData, 33);
            map.fitBounds(filtroLayer.getBounds());

            console.log(map.getZoom());

            map.addLayer(filtroLayer);
            filtroLayer.bringToFront();

            $(".divinfo")[0].hidden = true;
            //map.setZoom(map.getZoom() - 1);
        }

        $("#total_places").text(filtroData.features.length);
    } else {
        limpiarSeleccion();
    }

}

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

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

    document.getElementById('selNodo').value = 'all';
    document.getElementById('selDepartamento').value = 'all';
    document.getElementById('selMunicipio').value = 'all';
    document.getElementById('selSector').value = 'all';
    document.getElementById('selTematica').value = 'all';
    document.getElementById('selTerritorial').value = 'all';
    document.getElementById('buscarPalabra').value = '';

    if (document.getElementById('selDepartamento').options.length > 1) {
        for (i = document.getElementById('selDepartamento').options.length - 1; i >= 1; i--) {
            document.getElementById('selDepartamento').remove(i);
        }
    }

    if (document.getElementById('selMunicipio').options.length > 1) {
        for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
            document.getElementById('selMunicipio').remove(i);
        }
    }

    // Recupera el listado inicial
    filtroData = JSON.parse(JSON.stringify(Observatorios));
    $("#total_places").text(0);

    $(".divinfo")[0].hidden = false;

}



/**
 * Ajusta la simbologia de los nodos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleNodosFiltro(feature) {
    "use strict";

    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleDptos(feature) {
    'use strict';
    var transparencia = feature.properties.TIENE == 'SI' ? 0.5 : 0.2;
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: transparencia,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

/**
 * [[Estilo ]]
 * @param   {object} feature [[Description]]
 * @returns {object} [[Description]]
 */
function styleMpios(feature) {
    "use strict";
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.2,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

/**
 * Resalta el elemento
 * @param {object} e Vector sobre el que pasa el mouse
 */
function highlightFeature(e) {
    "use strict";

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

/**
 * Quita el resaltado a los nodos deseleccionados
 * @param {object} e Vector deseleccionado
 */
function resetHighlightNodos(e) {
    "use strict";

    NodosLayer.resetStyle(e.target);
    NodosLayer.setStyle(styleNodos);
    info.update();
}

/**
 * Zoom al Nodo
 * @param   {object}   e Vector seleccionado
 * @returns {[[Type]]} [[Description]]
 */
function zoomToFeatureNodos(e) {
    "use strict";

    nodoAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Nodo";

    var layer = e.target;
    map.fitBounds(e.target.getBounds());

    NodoSeleccionado = layer.feature.properties.NODO;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(positron);

    // Capa de DEPARTAMENTOS
    DptosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.NODO === NodoSeleccionado);
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
    });

    // Adiciona los Departamentos
    DptosLayer.addData(Dptos);
    map.addLayer(DptosLayer);

    if (NodoSeleccionado === 'Sur') {
        NodosSurPutumayo = renderMarkersData(filtrarDepto('PUTUMAYO'));
        NodosSurNarino = renderMarkersData(filtrarDepto('NARIÑO'), 500);
        NodosSurValleCauca = renderMarkersData(filtrarDepto('CAUCA'), 500);
        NodosSurCauca = renderMarkersData(filtrarDepto('VALLE DEL CAUCA'), 300);
        map.addLayer(NodosSurPutumayo);
        map.addLayer(NodosSurNarino);
        map.addLayer(NodosSurValleCauca);
        map.addLayer(NodosSurCauca);
    } else if (NodoSeleccionado === 'Centro') {
        NodosCentroBogota = renderMarkersData(filtrarDepto('BOGOTÁ D.C.'));
        NodosCentroMeta = renderMarkersData(filtrarDepto('BOYACÁ'));
        NodosCentroBoyaca = renderMarkersData(filtrarDepto('META'));
        NodosCentroSantander = renderMarkersData(filtrarDepto('SANTANDER'));
        NodosCentroNteSantander = renderMarkersData(filtrarDepto('NORTE DE SANTANDER'));
        map.addLayer(NodosCentroBogota);
        map.addLayer(NodosCentroMeta);
        map.addLayer(NodosCentroBoyaca);
        map.addLayer(NodosCentroSantander);
        map.addLayer(NodosCentroNteSantander);
    } else if (NodoSeleccionado === 'Caribe') {
        NodosCaribeAtlantico = renderMarkersData(filtrarDepto('ATLÁNTICO'), 100);
        NodosCaribeMagdalena = renderMarkersData(filtrarDepto('MAGDALENA'), 100);
        NodosCaribeSucre = renderMarkersData(filtrarDepto('SUCRE'), 100);
        NodosCaribeBolivar = renderMarkersData(filtrarDepto('BOLÍVAR'), 1500);
        map.addLayer(NodosCaribeAtlantico);
        map.addLayer(NodosCaribeMagdalena);
        map.addLayer(NodosCaribeSucre);
        map.addLayer(NodosCaribeBolivar);
    }
}

/**
 * Quita resaltado en Departamentos
 * @param {object} e [[Description]]
 */
function resetHighlightDptos(e) {
    "use strict";
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleNodos);
}

// Zoom al elemento
/**
 * [[Zoom al departamento seleccionado]]
 * @param   {object}   e [[vector seleccionado]]
 * @returns {[[Type]]} [[Description]]
 */
function zoomToFeatureDptos(e) {
    "use strict";
    dptoAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Dpto";

    var layer = e.target;
    map.fitBounds(e.target.getBounds());
    DptoSeleccionado = layer.feature.properties.DEPTO;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(positron);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.DEPTO == DptoSeleccionado)
        },
        style: styleDptos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeatureMpios);
            //layer.on('mouseout', resetHighlightMpios);
            layer.on('click', zoomToFeatureMpios);
        }
    });

    MpiosLayer.addData(Mpios);
    map.addLayer(MpiosLayer);

    switch (DptoSeleccionado) {
        case 'PUTUMAYO':
            NodosSurPutumayo = renderMarkersData(filtrarDepto(DptoSeleccionado), 5);
            map.addLayer(NodosSurPutumayo);
            break;
        case 'NARIÑO':
            NodosSurNarino = renderMarkersData(filtrarDepto(DptoSeleccionado), 20);
            map.addLayer(NodosSurNarino);
            break;
        case 'CAUCA':
            NodosSurCauca = renderMarkersData(filtrarDepto(DptoSeleccionado), 15);
            map.addLayer(NodosSurCauca);
            break;
        case 'VALLE DEL CAUCA':
            NodosSurValleCauca = renderMarkersData(filtrarDepto(DptoSeleccionado), 50);
            map.addLayer(NodosSurValleCauca);
            break;
        case 'META':
            NodosCentroMeta = renderMarkersData(filtrarDepto(DptoSeleccionado), 15);
            map.addLayer(NodosCentroMeta);
            break;
        case 'SANTANDER':
            NodosCentroSantander = renderMarkersData(filtrarDepto(DptoSeleccionado), 15);
            map.addLayer(NodosCentroSantander);
            break;
        case 'NORTE DE SANTANDER':
            NodosCentroNteSantander = renderMarkersData(filtrarDepto(DptoSeleccionado), 10);
            map.addLayer(NodosCentroNteSantander);
            break;
        case 'BOYACÁ':
            NodosCentroBoyaca = renderMarkersData(filtrarDepto(DptoSeleccionado), 5);
            map.addLayer(NodosCentroBoyaca);
            break;
        case 'BOGOTÁ D.C.':
            NodosCentroBogota = renderMarkersData(filtrarDepto(DptoSeleccionado), 25);
            map.addLayer(NodosCentroBogota);
            break;
        case 'ATLÁNTICO':
            NodosCaribeAtlantico = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeAtlantico);
            break;
        case 'MAGDALENA':
            NodosCaribeMagdalena = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeMagdalena);
            break;
        case 'SUCRE':
            NodosCaribeSucre = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeSucre);
            break;
        case 'BOLÍVAR':
            NodosCaribeBolivar = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeBolivar);
            break;
        case 'PUTUMAYO':
            NodosSurPutumayo = renderMarkersData(filtrarDepto(DptoSeleccionado), 5);
            map.addLayer(NodosSurPutumayo);
            break;
        case 'NARIÑO':
            NodosSurNarino = renderMarkersData(filtrarDepto(DptoSeleccionado), 20);
            map.addLayer(NodosSurNarino);
            break;
        case 'CAUCA':
            NodosSurCauca = renderMarkersData(filtrarDepto(DptoSeleccionado), 15);
            map.addLayer(NodosSurCauca);
            break;
        case 'VALLE DEL CAUCA':
            NodosSurValleCauca = renderMarkersData(filtrarDepto(DptoSeleccionado), 50);
            map.addLayer(NodosSurValleCauca);
            break;
        case 'META':
            NodosCentroMeta = renderMarkersData(filtrarDepto(DptoSeleccionado), 15);
            map.addLayer(NodosCentroMeta);
            break;
        case 'SANTANDER':
            NodosCentroSantander = renderMarkersData(filtrarDepto(DptoSeleccionado), 15);
            map.addLayer(NodosCentroSantander);
            break;
        case 'NORTE DE SANTANDER':
            NodosCentroNteSantander = renderMarkersData(filtrarDepto(DptoSeleccionado), 10);
            map.addLayer(NodosCentroNteSantander);
            break;
        case 'BOYACÁ':
            NodosCentroBoyaca = renderMarkersData(filtrarDepto(DptoSeleccionado), 5);
            map.addLayer(NodosCentroBoyaca);
            break;
        case 'BOGOTÁ D.C.':
            NodosCentroBogota = renderMarkersData(filtrarDepto(DptoSeleccionado), 25);
            map.addLayer(NodosCentroBogota);
            break;
        case 'ATLANTICO':
            NodosCaribeAtlantico = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeAtlantico);
            break;
        case 'MAGDALENA':
            NodosCaribeMagdalena = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeMagdalena);
            break;
        case 'SUCRE':
            NodosCaribeSucre = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeSucre);
            break;
        case 'BOLÍVAR':
            NodosCaribeBolivar = renderMarkersData(filtrarDepto(DptoSeleccionado));
            map.addLayer(NodosCaribeBolivar);
            break;
    }
}

// Resaltado
function highlightFeatureMpios(e) {
    var layer = e.target;
    info.update(layer.feature.properties);
}

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    var layer = e.target;
    if (layer.feature.properties.TIENE == 'SI') {

        map.eachLayer(function (layer) {
            map.removeLayer(layer);
        });

        map.addLayer(positron);

        //map.fitBounds(e.target.getBounds());
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
            style: styleMpios,
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
        map.addLayer(positronLabels);

        var ObservatoriosData = JSON.parse(JSON.stringify(Observatorios));
        ObservatoriosData.features = ObservatoriosData.features.filter(function (a) {
            return a.properties.CODDANE == MpioSeleccionado;
        });

        ObservatoriosLayer = renderMarkersData(ObservatoriosData, 0.01);
        map.addLayer(ObservatoriosLayer);
        map.fitBounds(ObservatoriosLayer.getBounds());
    }
}

/**
 * Genera Cluster Inicial
 * @param   {[[Type]]} data             Informacion a usar
 * @param   {[[Type]]} distancia = 1500 Distancia para unificar
 * @returns {[[Type]]} [[Description]]
 */
function renderMarkersBase(data, distancia = 1500) {

    var cluster = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: distancia,
        spiderfyOnMaxZoom: true,
        disableClusteringAtZoom: 19
    });

    var layer = L.geoJson(data);
    layer.setZIndex(1002);
    cluster.addLayer(layer);
    return cluster;
}

// OBSERVATORIOS
/**
 * Cluster con Ventana Modal
 * @param   {[[Type]]} data            Datos a clusterizar
 * @param   {[[Type]]} distancia = 100 Distancia para unificar
 * @returns {boolean}  [[Description]]
 */
function renderMarkersData(data, distancia = 100) {

    var layer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                popupObservatorio(feature, layer);
            }
        },

        pointToLayer: function (feature, latlng) {
            /*            return L.circleMarker(latlng, {
                            radius: 8,
                            fillColor: "#FF7FAC",
                            color: "#FF7FAC",
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.5
                        });*/
            return L.marker(latlng, {
                icon: observatorioIcon
            });
        }
    });

    layer.setZIndex(1002);

    if (distancia > 0) {
        var cluster = L.markerClusterGroup({
            showCoverageOnHover: false,
            maxClusterRadius: distancia,
            spiderfyOnMaxZoom: true,
            disableClusteringAtZoom: 19
        });

        cluster.addLayer(layer);

        return cluster;
    } else {
        return layer;
    }

}

/**
 * [[Ventana de información]]
 * @param   {object}   feature [[Description]]
 * @param   {[[Type]]} layer   [[Description]]
 * @returns {boolean}  [[Description]]
 */
function popupObservatorio(feature, layer) {
    "use strict";

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
    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Tipo Observatorio</th><td>" + feature.properties.SECTOR + "</td></tr>" + "<tr><th>Dirección</th><td>" + feature.properties.DIRECCION + '<br/>' + feature.properties.MUNICIPIO + ', ' + feature.properties.DEPARTAMENTO + "</td></tr>" + (TelefonoStr == '' ? '' : "<tr><th>Teléfono</th><td>" + TelefonoStr + "</td></tr>") + (CorreoStr == '' ? '' : "<tr><th>Correo Electrónico</th><td>" + CorreoStr + "</td></tr>") + (feature.properties.SITIO_WEB == '' ? '' : "<tr><th>Web</th><td><a class='url-break' href='" + feature.properties.SITIO_WEB + "' target='_blank'>" + feature.properties.SITIO_WEB + "</a></td></tr>") + (feature.properties.FACEBOOK == '' ? '' : "<tr><th>Facebook</th><td>" + feature.properties.FACEBOOK + "</td></tr>") + (feature.properties.TWITER == '' ? '' : "<tr><th>Twitter</th><td>" + feature.properties.TWITER + "</td></tr>") + "<table>";

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
            tematicasStr == '' || tematicasStr == '<br />' ? $('#tematicasTab').attr('class', 'disabled') : $('#tematicasTab').attr('class', '');
            $('#tematicasTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $("#territorial").html(territorialStr);
            territorialStr == '' || territorialStr == '<br />' ? $('#territorialTab').attr('class', 'disabled') : $('#territorialTab').attr('class', '');
            $('#territorialTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $("#tipoinformacion").html(tipoinformacionStr);
            tipoinformacionStr == '' || tipoinformacionStr == '<br />' ? $('#tipoinformacionTab').attr('class', 'disabled') : $('#tipoinformacionTab').attr('class', '');
            $('#tipoinformacionTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $("#productos").html(productosStr);
            productosStr == '' || productosStr == '<br />' ? $('#productosTab').attr('class', 'disabled') : $('#productosTab').attr('class', '');
            $('#productosTab').click(function (event) {
                if ($(this).hasClass('disabled')) {
                    return false;
                }
            });

            $('.nav-tabs a[href="#feature-info"]').tab('show');
            $("#featureModal").modal("show");
        }
    });
}