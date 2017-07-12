function listados(lista, valor, indice) {
    var lookup = {};
    var listado = [];
    var k = 0;
    for (var item, i = 0; item = lista[i++];) {

        var name = item[valor];

        if (!(name in lookup)) {
            lookup[name] = 1;
            if (typeof indice !== 'undefined') {
                listado.push({
                    key: item[indice],
                    value: name
                });
            } else {
                listado.push({
                    key: k,
                    value: name
                });
                k++;
            }
        }
    }

    var listadoOrdenado = listado.slice(0);
    listadoOrdenado.sort(function (a, b) {
        var x = a.value.toLowerCase();
        var y = b.value.toLowerCase();
        return x < y ? -1 : x > y ? 1 : 0;
    });

    return listadoOrdenado;
};

function listaSelect(arrDatos) {
    var i, lista;

    lista = "<option value='all'>Todos</option>";
    for (i = 0; i < arrDatos.length; i++) {
        lista += "<option value='" + arrDatos[i].key + "'>" + (arrDatos[i].value === "" ? "Ninguno" : arrDatos[i].value) + "</option>";
    }

    return lista;
}

var Cooperante_Financiador = listados(listaProyectos, "Cooperante_Financiador");
var Cooperante_Operador = listados(listaProyectos, "Cooperante_Operador");
var Linea_de_Politica = listados(listaProyectos, "Linea_de_Politica");
var Derecho = listados(listaProyectos, "Derecho");
var Estado = listados(listaProyectos, "Estado");
var Tipo_de_cooperacion = listados(listaProyectos, "Tipo_de_cooperacion");
var Grupo_Beneficiaria = listados(listaProyectos, "Grupo_Beneficiaria");

var Municipio = listados(listaProyectos, "Municipio", "CODDANE_MPIO");
var Departamento = listados(listaProyectos, "Departamento", "CODDANE_DPTO");
var Paises = listados(listaProyectos, "Pais", "CODDANE_PAIS");

var geoLayerProyectosPaises, geoLayerProyectosDptos, geoLayerProyectosMpios;
var DptosLayer, MpiosLayer;

var proyectoIcon = L.icon({
    iconUrl: 'css/Map-Marker.png',
    iconSize: [32, 32],
    iconAnchor: [22, 31],
    popupAnchor: [-3, -76]
});

var map = L.map('map', {
        zoomControl: false
    }).setView([4.52, -74.68], 3),
    layer = L.esri.basemapLayer('DarkGray').addTo(map),
    // layerLabels = L.esri.basemapLayer('xxxLabels').addTo(map);
    layerLabels = layerLabels = L.esri.basemapLayer('DarkGrayLabels').addTo(map),
    worldTransportation = L.esri.basemapLayer('ImageryTransportation');

// Filtro Departamentos
$("#selectFiltroFinanciadores").html(listaSelect(Cooperante_Financiador));
$("#selectFiltroOperadores").html(listaSelect(Cooperante_Operador));
$("#selectFiltroLineaPolitica").html(listaSelect(Linea_de_Politica));
$("#selectFiltroDerecho").html(listaSelect(Derecho));
$("#selectFiltroEstado").html(listaSelect(Estado));
$("#selectFiltroTipoCooperacion").html(listaSelect(Tipo_de_cooperacion));
$("#selectFiltroGrupoBeneficiario").html(listaSelect(Grupo_Beneficiaria));

$("#selectFiltroPaises").html(listaSelect(Paises));
//$("#selectFiltroDpto").html(listaSelect(Departamento));
//$("#selectFiltroMpio").html(listaSelect(Municipio));

// EVENTOS
/**
 * Cluster con Ventana Modal
 * @param   {[[Type]]} data            Datos a clusterizar
 * @param   {[[Type]]} distancia = 100 Distancia para unificar
 * @returns {boolean}  [[Description]]
 */
function renderMarkersData(data, distancia = 10) {

    var layer = L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            if (feature.properties) {
                popupEvento(feature, layer);
            }
        },

        pointToLayer: function (feature, latlng) {

            var IconoUsar;

            switch (feature.properties.accion) {
                case "Amenaza":
                    IconoUsar = AmenazaIcon;
                    break;
                case "Atentado":
                    IconoUsar = AtentadoIcon;
                    break;
                case "Desalojo":
                    IconoUsar = DesalojoIcon;
                    break;
                case "Desaparición forzada":
                    IconoUsar = DesaparicionIcon;
                    break;
                case "Desplazamiento forzado":
                    IconoUsar = DesplazamientoIcon;
                    break;
                case "Detención arbitraria":
                    IconoUsar = DetencionIcon;
                    break;
                case "Ejecución extrajudicial":
                    IconoUsar = EjecucionIcon;
                    break;
                case "Extorsión":
                    IconoUsar = ExtorsionIcon;
                    break;
                case "Homicidio":
                    IconoUsar = HomicidioIcon;
                    break;
                case "Hostigamiento":
                    IconoUsar = HostigamientoIcon;
                    break;
                case "Secuestro":
                    IconoUsar = SecuestroIcon;
                    break;
                case "Tortura":
                    IconoUsar = TorturaIcon;
                    break;
                default:
                    IconoUsar = proyectoIcon;
            }

            return L.marker(latlng, {
                icon: IconoUsar
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
 * Ajusta la simbologia de los Departamentos
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleDptos(feature) {
    "use strict";

    return {
        weight: 2,
        opacity: 0.5,
        color: 'black',
        dashArray: '0',
        fillOpacity: 0.1,
        fillColor: "#fff"
    };
}

/**
 * Ajusta la simbologia de los Municipios
 * @param   {object} feature Elemento geográfico
 * @returns {object} simbologia
 */
function styleMpios(feature) {
    "use strict";

    return {
        weight: 1,
        opacity: 0.5,
        color: 'black',
        dashArray: '4',
        fillOpacity: 0.1,
        fillColor: "#fff"
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
        fillOpacity: 0.3
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

// Resaltado
function highlightFeatureMpios(e) {
    //var layer = e.target;
    //info.update(layer.feature.properties);
    "use strict";

    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.3
    });
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

/**
 * Quita resaltado en Departamentos
 * @param {object} e [[Description]]
 */
function resetHighlightDptos(e) {
    "use strict";
    DptosLayer.resetStyle(e.target);
    DptosLayer.setStyle(styleDptos);
}

/**
 * Quita resaltado en Municipios
 * @param {object} e [[Description]]
 */
function resetHighlightMpios(e) {
    "use strict";
    MpiosLayer.resetStyle(e.target);
    MpiosLayer.setStyle(styleMpios);
}

function createDataGeo() {
    var dataProyectosDptos = listaProyectos.slice();
    var dataProyectosMpios = listaProyectos.slice();
    var dataProyectosPaises = listaProyectos.slice();

    //  PAISES
    var dataPaisesHashLONG = listaPaises.reduce(function (hash, item) {
        if (item.CODDANE_PAIS) {
            hash[item.CODDANE_PAIS] = isNaN(item.LONG_PAIS) ? null : +item.LONG_PAIS
        }
        return hash
    }, {});

    var dataPaisesHashLAT = listaPaises.reduce(function (hash, item) {
        if (item.CODDANE_PAIS) {
            hash[item.CODDANE_PAIS] = isNaN(item.LAT_PAIS) ? null : +item.LAT_PAIS
        }
        return hash
    }, {});

    dataProyectosPaises.forEach(function (item) {
        item.LONG_PAIS = dataPaisesHashLONG[item.CODDANE_PAIS] || null;
        item.LAT_PAIS = dataPaisesHashLAT[item.CODDANE_PAIS] || null;
    })

    geoProyectosPaises = GeoJSON.parse(dataProyectosPaises, {
        Point: ["LAT_PAIS", "LONG_PAIS"]
    });

    geoLayerProyectosPaises = renderMarkersData(geoProyectosPaises, 10);

    // DEPARTAMENTOS
    var dataDptosHashLONG = listaDptos.reduce(function (hash, item) {
        if (item.CODDANE_DPTO) {
            hash[item.CODDANE_DPTO] = isNaN(item.LONG_DPTO) ? null : +item.LONG_DPTO
        }
        return hash
    }, {});

    var dataDptosHashLAT = listaDptos.reduce(function (hash, item) {
        if (item.CODDANE_DPTO) {
            hash[item.CODDANE_DPTO] = isNaN(item.LAT_DPTO) ? null : +item.LAT_DPTO
        }
        return hash
    }, {});

    dataProyectosDptos.forEach(function (item) {
        item.LONG_DPTO = dataDptosHashLONG[item.CODDANE_DPTO] || null;
        item.LAT_DPTO = dataDptosHashLAT[item.CODDANE_DPTO] || null;
    })

    geoProyectosDptos = GeoJSON.parse(dataProyectosDptos, {
        Point: ["LAT_DPTO", "LONG_DPTO"]
    });

    geoLayerProyectosDptos = renderMarkersData(geoProyectosDptos, 10);
    //map.addLayer(geoLayerProyectosDptos);
    //map.fitBounds(geoLayerProyectosDptos.getBounds());

    // MUNICIPIOS
    var dataMpiosHashLONG = listaMpios.reduce(function (hash, item) {
        if (item.CODDANE_MPIO) {
            hash[item.CODDANE_MPIO] = isNaN(item.LONG_MPIO) ? null : +item.LONG_MPIO
        }
        return hash
    }, {});

    var dataMpiosHashLAT = listaMpios.reduce(function (hash, item) {
        if (item.CODDANE_MPIO) {
            hash[item.CODDANE_MPIO] = isNaN(item.LAT_MPIO) ? null : +item.LAT_MPIO
        }
        return hash
    }, {});

    dataProyectosMpios.forEach(function (item) {
        item.LONG_MPIO = dataMpiosHashLONG[item.CODDANE_MPIO] || null;
        item.LAT_MPIO = dataMpiosHashLAT[item.CODDANE_MPIO] || null;
    })

    geoProyectosMpios = GeoJSON.parse(dataProyectosDptos, {
        Point: ["LAT_MPIO", "LONG_MPIO"]
    });

    geoLayerProyectosMpios = renderMarkersData(geoProyectosMpios, 10);

    // Capa de Departamentos
    DptosLayer = L.geoJson(undefined, {
        style: styleDptos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.DEPTO, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeature);
            layer.on('mouseout', resetHighlightDptos);
            //layer.on('click', zoomToFeatureDptos);
        }
    });

    DptosLayer.addData(capaDepartamentos);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        /*filter: function (feature) {
            if (typeof (DptoSeleccionado) !== 'undefined' && DptoSeleccionado !== null) {
                return (feature.properties.COD_DEPTO == DptoSeleccionado)
            }
        },*/
        style: styleMpios,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
            layer.on('mouseover', highlightFeatureMpios);
            layer.on('mouseout', resetHighlightMpios);
            //layer.on('click', zoomToFeatureMpios);
        }
    });

    MpiosLayer.addData(capaMunicipios);
}


/**
 * [[Ventana de información]]
 * @param   {object}   feature [[Description]]
 * @param   {[[Type]]} layer   [[Description]]
 * @returns {boolean}  [[Description]]
 */
function popupEvento(feature, layer) {
    "use strict";

    var Codigo_Proyecto = feature.properties.Codigo_Proyecto;
    var Cooperante_Financiador = feature.properties.Cooperante_Financiador;
    var Cooperante_Operador = feature.properties.Cooperante_Operador;
    var Nombre_del_Proyecto = feature.properties.Nombre_del_Proyecto;
    var Linea_de_Politica = feature.properties.Linea_de_Politica;
    var Derecho = feature.properties.Derecho;
    var Estado = feature.properties.Estado;
    var Municipio = feature.properties.Municipio;
    var Departamento = feature.properties.Departamento;
    var Pais = feature.properties.Pais;
    var Tipo_de_cooperacion = feature.properties.Tipo_de_cooperacion;
    var Aporte_cooperante = feature.properties.Aporte_cooperante;
    var Moneda = feature.properties.Moneda;
    var Monto_intervencion_USD = feature.properties.Monto_intervencion_USD;
    var Fecha_inicio = feature.properties.Fecha_inicio;
    var Fecha_finalizacion = feature.properties.Fecha_finalizacion;
    var Poblacion_Beneficiaria = feature.properties.Poblacion_Beneficiaria;
    var Grupo_Beneficiaria = feature.properties.Grupo_Beneficiaria;

    /*

    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Fecha</th><td>" + Fecha + "</td></tr>" + "<tr><th>Ubicación</th><td>" + Municipio + ', ' + Departamento + "</td></tr>" + "<tr><th>Acción</th><td>" + TipoAccion + "</td></tr>" + "<tr><th>Tipo Víctima</th><td>" + TipoLider + "</td></tr>" + "<tr><th>Organización Politica</th><td>" + Organizacion + "</td></tr>" + "<tr><th>Responsable</th><td>" + Responsable + "</td></tr>" + "<tr><th>Fuente</th><td><a class='url-break' href='" + Fuente + "' target='_blank'>" + Fuente + "</a></td></tr>" + "<table>";
    */
    layer.on({
        click: function (e) {
            console.log(Codigo_Proyecto);
            console.log(Cooperante_Financiador);
            console.log(Pais);
            var informacionProyecto = "<b>Cooperante Financiador: </b>" + Cooperante_Financiador + "</br>" + "<b>Cooperante Operador: </b>" + Cooperante_Operador + "</br>" + "<b>Linea de Política: </b>" + Linea_de_Politica + "</br>" ; 
            $("#feature-title").html(Nombre_del_Proyecto.toUpperCase());
            $("#datosProyectos").html(informacionProyecto);
            /*
            $("#feature-info").html(infobasica);

            $("#Observaciones").html(Observaciones);

            $('.nav-tabs a[href="#feature-info"]').tab('show');*/
            $("#modalSplash").modal("show");
        }
    });
}

map.on('zoomend', function () {
    console.log(map.getZoom());
    if (map.getZoom() < 5) {
        map.removeLayer(geoLayerProyectosDptos);
        map.removeLayer(geoLayerProyectosMpios);
        map.removeLayer(DptosLayer);
        map.removeLayer(MpiosLayer);
        map.addLayer(geoLayerProyectosPaises);
        console.log("paises");
    } else if (map.getZoom() >= 9) {
        map.removeLayer(geoLayerProyectosDptos);
        map.removeLayer(geoLayerProyectosPaises);
        //map.removeLayer(DptosLayer);
        map.addLayer(geoLayerProyectosMpios);
        map.addLayer(MpiosLayer);
        //map.addLayer(DptosLayer);
        console.log("municipios");
    } else if (map.getZoom() < 9) {
        map.removeLayer(geoLayerProyectosPaises);
        map.removeLayer(geoLayerProyectosMpios);
        map.removeLayer(MpiosLayer);
        map.addLayer(geoLayerProyectosDptos);
        map.addLayer(DptosLayer);
        console.log("departamentos");
    }
});