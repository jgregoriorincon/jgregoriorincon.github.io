function loadMap() {
    "use strict";

    var i;

    var baseMaps = {
        "Base Acurela": Stamen_Watercolor,
        "Base Gris": positron,
        "Base OSM": OpenStreetMap_Mapnik,
        "Base Calles": Esri_WorldStreetMap
    };

    var overlays = {
        "Etiquetas": positronLabels
    };

    L.control.layers(baseMaps, overlays, {
        position: 'bottomright',
        collapsed: true
    }).addTo(mapSociedad);

    /* ------------------- CONTROLES ------------------*/
    volver = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function (map) {
            var container = L.DomUtil.create('div', 'volver-control');
            container.innerHTML = '<form><img src="css/back-icon.png" alt="VOLVER" style="width:64px;height:64px;"><br />Ir a Vista Anterior</form>';
            container.style.cursor = 'pointer';

            container.onclick = function () {
                if (nivelActual === 'Mpio') {
                    zoomToFeatureDptos(dptoAnterior);
                    nivelActual = 'Dpto';
                } else if (nivelActual === 'Dpto') {
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

    mapSociedad.addControl(new volver());

    mapSociedad.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>&copy;');

    // Add legend (don't forget to add the CSS from index.html)
    legendDpto = L.control({
        position: 'topright'
    })

    legendMpio = L.control({
        position: 'topright'
    })

    AddDatosDpto(sociedad_departamento);
    AddLegendDpto();

    sociedad_departamento_layer = renderMarkersData(sociedad_departamento_geo, 5);
    mapSociedad.addLayer(sociedad_departamento_layer);
    mapSociedad.fitBounds(DptosLayer.getBounds());

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
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.3,
        fillColor: "#fff"
    };
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
    mapSociedad.fitBounds(e.target.getBounds());
    DptoSeleccionado = layer.feature.properties.COD_DEPTO;

    mapSociedad.eachLayer(function (layer) {
        mapSociedad.removeLayer(layer);
    });

    mapSociedad.addLayer(Stamen_Watercolor);

    AddDatosMpio(sociedad_municipio);

    AddLegendMpio();

    sociedad_municipio_data = JSON.parse(JSON.stringify(sociedad_municipio_geo));
    sociedad_municipio_data.features = sociedad_municipio_data.features.filter(function (a) {
        return a.properties.COD_DPTO == DptoSeleccionado;
    });

    sociedad_municipio_layer = renderMarkersData(sociedad_municipio_data, 5);
    mapSociedad.addLayer(sociedad_municipio_layer);
    mapSociedad.fitBounds(MpiosLayerBack.getBounds());  // + MpiosLayer.getBounds());

    //document.getElementById('selDepartamento').value = DptoSeleccionado;
    //filtrarDepartamento();
}

// SOCIEDADS
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
                popupSociedad(feature, layer);
            }
        },

        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: SociedadIcon
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

// Zoom al elemento
function zoomToFeatureMpios(e) {
    "use strict";

    mpioAnterior = jQuery.extend(true, {}, e);
    nivelActual = "Mpio";

    var layer = e.target;

    mapSociedad.eachLayer(function (layer) {
        mapSociedad.removeLayer(layer);
    });

    MpioSeleccionado = layer.feature.properties.COD_MPIO;
    mapSociedad.eachLayer(function (layer) {
        mapSociedad.removeLayer(layer);
    });
    mapSociedad.addLayer(Stamen_Watercolor);

    // Capa de MUNICIPIOS
    MpiosLayer = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.COD_MPIO === MpioSeleccionado)
        },
        style: styleDptos,
        onEachFeature: function (feature, layer) {
            layer.bindTooltip(feature.properties.NOMBRE, {
                permanent: false,
                direction: "auto"
            });
        }
    })

    MpiosLayer.addData(capaMunicipios);
    mapSociedad.addLayer(MpiosLayer);
    mapSociedad.addLayer(positronLabels);

    sociedad_municipio_data = JSON.parse(JSON.stringify(sociedad_municipio_geo));
    sociedad_municipio_data.features = sociedad_municipio_data.features.filter(function (a) {
        return a.properties.COD_MPIO === parseInt(MpioSeleccionado);
    });

    sociedad_municipio_layer = renderMarkersData(sociedad_municipio_data, 5);
    mapSociedad.addLayer(sociedad_municipio_layer);
    mapSociedad.fitBounds(MpiosLayer.getBounds());
}

/**
 * Limpia la seleccion actual y muestra el mapa vacio
 */
function limpiarSeleccion() {
    "use strict";

    var i;

    mapSociedad.setView(new L.LatLng(4.5, -73.0), 6);
    mapSociedad.eachLayer(function (layer) {
        mapSociedad.removeLayer(layer);
    });
    mapSociedad.addLayer(Stamen_Watercolor);
    mapSociedad.addLayer(positronLabels);

    AddDatosDpto(sociedad_departamento);
    AddLegendDpto();

    document.getElementById('selDepartamento').value = 'all';
    document.getElementById('selMunicipio').value = 'all';
    document.getElementById('selSector').value = 'all';
    document.getElementById('selTipoSociedad').value = 'all';
    document.getElementById('selAlcance').value = 'all';
    document.getElementById('buscarPalabra').value = '';

    if (document.getElementById('selMunicipio').options.length > 1) {
        for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
            document.getElementById('selMunicipio').remove(i);
        }
    }

    // Recupera el listado inicial
    filtroDataDptoPunto = JSON.parse(JSON.stringify(sociedad_departamento));
    $("#total_places").text(0);

    //$(".divinfo")[0].hidden = false;

    sociedad_departamento_layer = renderMarkersData(sociedad_departamento_geo, 5);
    mapSociedad.addLayer(sociedad_departamento_layer);

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
            return '<option value="' + Mpio.CODIGO + '">' + Mpio.NOMBRE + '</option>';
        }).join('');

        $("#selMunicipio").html(html);

        filtroDataMpioPunto = JSON.parse(JSON.stringify(sociedad_municipio_geo));

        filtrarTodo();

    } else {
        if (document.getElementById('selMunicipio').options.length > 1) {
            for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }

        var Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Sector = document.getElementById('selSector').value,
            TipoSociedad = document.getElementById('selTipoSociedad').value,
            Alcance = document.getElementById('selAlcance').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

        if ((Dpto !== 'all') || (Mpio !== 'all') || (Sector !== 'all') || (TipoSociedad !== 'all') || (Alcance !== 'all') || (FiltroTexto !== '')) {
            filtrarTodo();
        } else {
            limpiarSeleccion();
        }
    }
}

/**
 * [[filtra las sociedades por las opciones del sidebar]]
 * @returns {boolean} filtra la capa de Sociedades 'filtroData'
 */
function filtrarTodo() {
    "use strict";

    var i,
        Dpto = document.getElementById('selDepartamento').value,
        Mpio = document.getElementById('selMunicipio').value,
        Sector = document.getElementById('selSector').value,
        TipoSociedad = document.getElementById('selTipoSociedad').value,
        Alcance = document.getElementById('selAlcance').value,
        FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase();

    if ((Dpto !== 'all') || (Mpio !== 'all') || (Sector !== 'all') || (TipoSociedad !== 'all') || (Alcance !== 'all') || (FiltroTexto !== '')) {


        filtroDataDptoPunto = JSON.parse(JSON.stringify(sociedad_departamento_geo));
        filtroDataMpioPunto = JSON.parse(JSON.stringify(sociedad_municipio_geo));

        filtroDataDptoPoly = JSON.parse(JSON.stringify(sociedad_departamento));
        filtroDataMpioPoly = JSON.parse(JSON.stringify(sociedad_municipio));

        if (Dpto !== 'all') {
            DptoSeleccionado = parseInt(Dpto);

            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.COD_DPTO === parseInt(Dpto);
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.COD_DPTO === parseInt(Dpto);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.COD_DPTO === parseInt(Dpto);
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.COD_DPTO === parseInt(Dpto);
                });
            }
        }

        if (Mpio !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.COD_MPIO === parseInt(Mpio);
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.COD_MPIO === parseInt(Mpio);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.COD_MPIO === parseInt(Mpio);
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.COD_MPIO === parseInt(Mpio);
                });
            }
        }

        if (Sector !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties["Sector"].toString().includes(Sector);
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties["Sector"].toString().includes(Sector);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a["Sector"].toString().includes(Sector);
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a["Sector"].toString().includes(Sector);
                });
            }
        }

        if (TipoSociedad !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties["Tipo de Organización"].toString().includes(TipoSociedad);
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties["Tipo de Organización"].toString().includes(TipoSociedad);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a["Tipo de Organización"].toString().includes(TipoSociedad);
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a["Tipo de Organización"].toString().includes(TipoSociedad);
                });
            }
        }

        if (Alcance !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties["Alcance de Acción"].toString().includes(Alcance);
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties["Alcance de Acción"].toString().includes(Alcance);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a["Alcance de Acción"].toString().includes(Alcance);
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a["Alcance de Acción"].toString().includes(Alcance);
                });
            }

        }

        if (FiltroTexto.toUpperCase() !== '') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                var k1 = a.properties["Nombre de la organización - Funcionario"].toUpperCase(),
                    k2 = a.properties["Sector"].toString().toUpperCase(),
                    k3 = a.properties["Tipo de Organización"].toString().toUpperCase(),
                    k4 = a.properties["Alcance de acción"].toString().toUpperCase(),
                    k5 = a.properties["MUNICIPIO"].toString().toUpperCase(),
                    k6 = a.properties["Relevancia (DD.HH.)(Acciones de promoción, prevención, respuesta y - o incidencia en materia de DD.HH.)"].toString().toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto)) || (k6.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

            filtroDataMpioPunto = filtroDataMpioPunto.features.filter(function (a) {
                var k1 = a["Nombre de la organización - Funcionario"].toUpperCase(),
                    k2 = a["Sector"].toString().toUpperCase(),
                    k3 = a["Tipo de Organización"].toString().toUpperCase(),
                    k4 = a["Alcance de Acción"].toString().toUpperCase(),
                    k5 = a["MUNICIPIO"].toString().toUpperCase(),
                    k6 = a["Relevancia (DD.HH.)(Acciones de promoción, prevención, respuesta y - o incidencia en materia de DD.HH.)"].toString().toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto)) || (k6.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                var k1 = a["Nombre de la organización - Funcionario"].toUpperCase(),
                    k2 = a["Sector"].toString().toUpperCase(),
                    k3 = a["Tipo de Organización"].toString().toUpperCase(),
                    k4 = a["Alcance de Acción"].toString().toUpperCase(),
                    k5 = a["MUNICIPIO"].toString().toUpperCase(),
                    k6 = a["Relevancia (DD.HH.)(Acciones de promoción, prevención, respuesta y - o incidencia en materia de DD.HH.)"].toString().toUpperCase();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto)) || (k6.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

        }

        if (filtroDataDptoPunto.features.length > 0) {

            mapSociedad.eachLayer(function (layer) {
                mapSociedad.removeLayer(layer);
            });

            mapSociedad.addLayer(Stamen_Watercolor);
            mapSociedad.addLayer(positronLabels);

            if ((Mpio !== 'all')) {
                
                filtroDataMpioPuntoLayer = renderMarkersData(filtroDataMpioPunto, 10);
                mapSociedad.addLayer(filtroDataMpioPuntoLayer);

                var MpiosLayerFiltro = L.geoJson(undefined, {
                    filter: function (feature) {
                        return (feature.properties.COD_MPIO == Mpio)
                    },
                    style: styleDptos,
                    onEachFeature: function (feature, layer) {
                        layer.bindTooltip(feature.properties.NOMBRE, {
                            permanent: false,
                            direction: "auto"
                        });
                    }
                });
                // Adiciona las capas
                MpiosLayerFiltro.addData(capaMunicipios);
                MpiosLayerFiltro.addTo(mapSociedad);
                mapSociedad.fitBounds(MpiosLayerFiltro.getBounds());

                filtroDataMpioPuntoLayer.bringToFront();

                mapSociedad.removeControl(legendDpto);
                mapSociedad.removeControl(legendMpio);
            } else if ((Dpto !== 'all')) {

                filtroDataMpioPuntoLayer = renderMarkersData(filtroDataMpioPunto, 10);
                mapSociedad.addLayer(filtroDataMpioPuntoLayer);
                filtroDataMpioPuntoLayer.bringToFront();

                AddDatosMpio(filtroDataDptoPoly);
                AddLegendMpio();

                mapSociedad.fitBounds(MpiosLayer.getBounds());
            } else {

                filtroDataDptoPuntoLayer = renderMarkersData(filtroDataDptoPunto, 10);
                mapSociedad.addLayer(filtroDataDptoPuntoLayer);

                AddDatosDpto(filtroDataDptoPoly);
                AddLegendDpto();

                filtroDataDptoPuntoLayer.bringToFront();
                mapSociedad.fitBounds(DptosLayer.getBounds());
            }

        }

        $("#total_places").text(filtroDataDptoPunto.features.length);
    } else {
        limpiarSeleccion();
    }

}

/**
 * [[Ventana de información]]
 * @param   {object}   feature [[Description]]
 * @param   {[[Type]]} layer   [[Description]]
 * @returns {boolean}  [[Description]]
 */
function popupSociedad(feature, layer) {
    "use strict";

    layer.on({
        click: function (e) {
            var tablaSociedad = '<table class="table table-striped table-bordered table-condensed">'

            $.each(feature.properties, function (key, value) {
                if (value !== "" && key !== ("COD_DPTO") && key !== ("LAT_DPTO") && key !== ("LONG_DPTO") && key !== ("COD_MPIO") && key !== ("LAT_MPIO") && key !== ("LONG_MPIO") && key !== ("Web (Si la tiene)") && key !== ("Nombre de representante - contacto") && key !== ("Teléfono contacto")) {
                    tablaSociedad += '<tr><th>' + key + '</th><td>' + value + '</td></tr>';
                } else if (value !== "" && key === ("Web (Si la tiene)")) {
                    tablaSociedad += '<tr><th>' + key + "</th><td><a class='url-break' href='" + value + "' target='_blank'>" + value + "</a></td></tr>";
                }
            });

            tablaSociedad += '</tbody></table>';

            $("#feature-title").html('<center>' + feature.properties["Nombre de la organización - Funcionario"] + '</center>');
            $("#tablaDatos").html(tablaSociedad);
            $('#featureModal').modal('show');
        }
    });
}

function AddLegendDpto() {

    mapSociedad.removeControl(legendMpio);
    mapSociedad.removeControl(legendDpto);

    var TituloMapa = "Organizaciones de la Sociedad Civil" + '</br>' + 'por Departamentos';
    var unidadMapeo = " Org. Civil";

    legendDpto.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend')
        var limits = DptosLayer.options.limits
        var colors = DptosLayer.options.colors
        var labels = []

        for (var i = 0; i < limits.length; i++) {
            var from = Math.round(limits[i]);
            var to = Math.round(limits[i + 1]);

            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                (to === undefined || isNaN(to) ? ' > ' + from : from) + (to === undefined || isNaN(to) ? unidadMapeo : ' &ndash; ' + to + unidadMapeo));
        }

        div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">' + TituloMapa + '</h5></br><div class="coloresLeyenda">' + labels.join('<br>') + '</div>';

        return div
    }
    legendDpto.addTo(mapSociedad);
}

function AddLegendMpio() {
    var TituloMapa = "Organizaciones de la Sociedad Civil" + '</br>' + 'por Municipios';
    var unidadMapeo = " Org. Civil";

    mapSociedad.removeControl(legendDpto);
    mapSociedad.removeControl(legendMpio);

    legendMpio.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        var limits = MpiosLayer.options.limits;
        var colors = MpiosLayer.options.colors;
        var labels = [];

        for (var i = 0; i < limits.length; i++) {
            var from = Math.round(limits[i]);
            var to = Math.round(limits[i + 1]);

            labels.push(
                '<i style="background:' + colors[i] + '"></i> ' +
                (to === undefined || isNaN(to) ? ' > ' + from : from) + (to === undefined || isNaN(to) ? unidadMapeo : ' &ndash; ' + to + unidadMapeo));
        }

        div.innerHTML = '<h5 class="text-center" style="font-weight: bold;">' + TituloMapa + '</h5></br><div class="coloresLeyenda">' + labels.join('<br>') + '</div>';

        return div
    }
    legendMpio.addTo(mapSociedad);
}

function AddDatosDpto(datosUsar) {
    // Calcular los valores
    var dataDptos = dl.groupby('COD_DPTO').count().execute(datosUsar);

    var dataDptosHash = dataDptos.reduce(function (hash, item) {
        if (item.COD_DPTO) {
            hash[item.COD_DPTO] = isNaN(item.count) ? null : +item.count
        }
        return hash
    }, {});

    capaDepartamentos.features.forEach(function (item) {
        item.properties.VALOR = dataDptosHash[item.properties.COD_DEPTO] || null;
    })

    // Capa de Departamentos Base
    DptosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return (feature.properties.VALOR == null)
        },
        style: styleDptos
    });

    DptosLayerBack.addData(capaDepartamentos);
    DptosLayerBack.addTo(mapSociedad);

    //console.log(capaDepartamentos);
    // Capa de Departamentos por Densidades
    DptosLayer = L.choropleth(capaDepartamentos, {
        filter: function (feature) {
            return (feature.properties.VALOR !== null)
        },
        valueProperty: 'VALOR',
        scale: ['yellow', 'green'],
        steps: clases,
        mode: metodo,
        style: {
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', zoomToFeatureDptos);
        }
    });
    DptosLayer.addTo(mapSociedad);
    mapSociedad.fitBounds(DptosLayer.getBounds());
}

function AddDatosMpio(datosUsar) {
    // Calcular los valores
    var dataMpios = dl.groupby('COD_MPIO').count().execute(datosUsar);

    var dataMpiosHash = dataMpios.reduce(function (hash, item) {
        if (item.COD_MPIO) {
            hash[item.COD_MPIO] = isNaN(item.count) ? null : +item.count
        }
        return hash
    }, {});

    var capaMunicipiosFiltrada = jQuery.extend(true, {}, capaMunicipios);


    capaMunicipiosFiltrada.features = capaMunicipiosFiltrada.features.filter(function (a) {
        return a.properties.COD_DPTO === DptoSeleccionado.toString();
    });

    capaMunicipiosFiltrada.features.forEach(function (item) {
        item.properties.VALOR = dataMpiosHash[item.properties.COD_MPIO] || null;
    })

    // Capa de Municipios Base
    MpiosLayerBack = L.geoJson(undefined, {
        filter: function (feature) {
            return feature.properties.VALOR === null
        },
        style: styleDptos
    });

    MpiosLayerBack.addData(capaMunicipiosFiltrada);
    MpiosLayerBack.addTo(mapSociedad);

    // Capa de Municipios por Densidades
    MpiosLayer = L.choropleth(capaMunicipiosFiltrada, {
        filter: function (feature) {
            return (feature.properties.VALOR !== null);
        },
        valueProperty: 'VALOR',
        scale: ['yellow', 'green'],
        steps: clases,
        mode: metodo,
        style: {
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', zoomToFeatureMpios);
        }
    });

    MpiosLayer.addTo(mapSociedad);
}