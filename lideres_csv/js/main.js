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
    }).addTo(map);

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

    map.addControl(new volver());

    map.attributionControl.addAttribution('<a href="http://pares.com.co/">Fundación Paz y Reconciliación</a>&copy;');

    // Add legend (don't forget to add the CSS from index.html)
    legendDpto = L.control({
        position: 'topright'
    })

    legendMpio = L.control({
        position: 'topright'
    })

    // control that shows state info on hover
    info = L.control();
    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'panel panel-primary divinfo text-right'); // 'info popup');
        this.update();
        return this._div;
    };

    info.update = function (props) {

        var strInstrucciones = '<div><div class="alert alert-info margin-5" id="left" > De clic en los iconos de los hechos para obtener más información sobre estos. </div> <div id="right" ><span class="fa fa-map-marker fa-2x text-info aria-hidden="true"></span> </div></div>';

        var strEncabezado = '<div class="panel-body text-right">';

        var finalHTML = strEncabezado + strInstrucciones + '</div>';

        this._div.innerHTML = finalHTML === '' ? '' : finalHTML;

    };

    //info.addTo(map);
    $('[data-toggle="tooltip"]').tooltip();

    AddDatosDpto(hechos_departamento);

    AddLegendDpto();

    hechos_departamento_layer = renderMarkersData(hechos_departamento_geo, 5);
    map.addLayer(hechos_departamento_layer);
    map.fitBounds(DptosLayer.getBounds());

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
    map.fitBounds(e.target.getBounds());
    DptoSeleccionado = layer.feature.properties.COD_DEPTO;

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    map.addLayer(Stamen_Watercolor);

    AddDatosMpio(hechos_municipio);

    AddLegendMpio();

    hechos_municipio_data = JSON.parse(JSON.stringify(hechos_municipio_geo));
    hechos_municipio_data.features = hechos_municipio_data.features.filter(function (a) {
        return a.properties.COD_DPTO == DptoSeleccionado;
    });

    hechos_municipio_layer = renderMarkersData(hechos_municipio_data, 5);
    map.addLayer(hechos_municipio_layer);
    map.fitBounds(MpiosLayerBack.getBounds());  // + MpiosLayer.getBounds());

    //document.getElementById('selDepartamento').value = DptoSeleccionado;
    //filtrarDepartamento();
}

// HECHOS
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
                popupHecho(feature, layer);
            }
        },

        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: hechoIcon
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

    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });

    MpioSeleccionado = layer.feature.properties.COD_MPIO;
    map.eachLayer(function (layer) {
        map.removeLayer(layer);
    });
    map.addLayer(Stamen_Watercolor);

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
    map.addLayer(MpiosLayer);
    map.addLayer(positronLabels);

    hechos_municipio_data = JSON.parse(JSON.stringify(hechos_municipio_geo));
    hechos_municipio_data.features = hechos_municipio_data.features.filter(function (a) {
        return a.properties.COD_MPIO === parseInt(MpioSeleccionado);
    });

    hechos_municipio_layer = renderMarkersData(hechos_municipio_data, 5);
    map.addLayer(hechos_municipio_layer);
    map.fitBounds(MpiosLayer.getBounds());
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
    map.addLayer(Stamen_Watercolor);
    map.addLayer(positronLabels);

    AddDatosDpto(hechos_departamento);
    AddLegendDpto();

    document.getElementById('selDepartamento').value = 'all';
    document.getElementById('selMunicipio').value = 'all';
    document.getElementById('selAnnos').value = 'all';
    document.getElementById('selTipoHecho').value = 'all';
    document.getElementById('selGrupo').value = 'all';
    document.getElementById('selEsAgente').value = 'all';
    document.getElementById('selAgente').value = 'all';
    document.getElementById('buscarPalabra').value = '';

    if (document.getElementById('selMunicipio').options.length > 1) {
        for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
            document.getElementById('selMunicipio').remove(i);
        }
    }

    if (document.getElementById('selAgente').options.length > 1) {
        for (i = document.getElementById('selAgente').options.length - 1; i >= 1; i--) {
            document.getElementById('selAgente').remove(i);
        }
    }

    // Recupera el listado inicial
    filtroDataDptoPunto = JSON.parse(JSON.stringify(hechos_departamento));
    $("#total_places").text(0);

    //$(".divinfo")[0].hidden = false;

    hechos_departamento_layer = renderMarkersData(hechos_departamento_geo, 5);
    map.addLayer(hechos_departamento_layer);

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

        filtroDataMpioPunto = JSON.parse(JSON.stringify(hechos_municipio_geo));

        filtrarTodo();

    } else {
        if (document.getElementById('selMunicipio').options.length > 1) {
            for (i = document.getElementById('selMunicipio').options.length - 1; i >= 1; i--) {
                document.getElementById('selMunicipio').remove(i);
            }
        }

        var Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Annos = document.getElementById('selAnnos').value,
            TipoHecho = document.getElementById('selTipoHecho').value,
            Grupo = document.getElementById('selGrupo').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase(),
            EsAgente = document.getElementById('selEsAgente').value,
            Agente = document.getElementById('selAgente').value;

        if ((Dpto !== 'all') || (Mpio !== 'all') || (Annos !== 'all') || (TipoHecho !== 'all') || (Grupo !== 'all') || (EsAgente !== 'all') || (Agente !== 'all') || (FiltroTexto !== '')) {
            filtrarTodo();
        } else {
            limpiarSeleccion();
        }
    }
}

/**
 * [[filtra los hechos por las opciones del sidebar]]
 * @returns {boolean} filtra la capa de hechos 'filtroData'
 */
function filtrarTodo() {
    "use strict";

    var i,
        Dpto = document.getElementById('selDepartamento').value,
        Mpio = document.getElementById('selMunicipio').value,
        Annos = document.getElementById('selAnnos').value,
        TipoHecho = document.getElementById('selTipoHecho').value,
        Grupo = document.getElementById('selGrupo').value,
        FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase(),
        EsAgente = document.getElementById('selEsAgente').value,
        Agente = document.getElementById('selAgente').value;

    if ((Dpto !== 'all') || (Mpio !== 'all') || (Annos !== 'all') || (TipoHecho !== 'all') || (Grupo !== 'all') || (EsAgente !== 'all') || (Agente !== 'all') || (FiltroTexto !== '')) {

        filtroDataDptoPunto = JSON.parse(JSON.stringify(hechos_departamento_geo));
        filtroDataMpioPunto = JSON.parse(JSON.stringify(hechos_municipio_geo));

        filtroDataDptoPoly = JSON.parse(JSON.stringify(hechos_departamento));
        filtroDataMpioPoly = JSON.parse(JSON.stringify(hechos_municipio));
console.log(filtroDataMpioPunto.features.length);
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

        if (Annos !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.ANNO === parseInt(Annos);
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.ANNO === parseInt(Annos);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.ANNO === parseInt(Annos);
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.ANNO === parseInt(Annos);
                });
            }
        }

        if (TipoHecho !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.TIPOHECHO === TipoHecho;
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.TIPOHECHO === TipoHecho;
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.TIPOHECHO === TipoHecho;
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.TIPOHECHO === TipoHecho;
                });
            }
        }

        if (Grupo !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.GRUPOS.toString().includes(Grupo);
            });

            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.GRUPOS.toString().includes(Grupo);
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.GRUPOS.toString().includes(Grupo);
            });

            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.GRUPOS.toString().includes(Grupo);
                });
            }
        }

        if (EsAgente !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.ESAGENTE === EsAgente;
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.ESAGENTE === EsAgente;
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.ESAGENTE === EsAgente;
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.ESAGENTE === EsAgente;
                });
            }
        }

        if (Agente !== 'all') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                return a.properties.AGENTE === Agente;
            });
            if (filtroDataMpioPunto !== undefined) {
                filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                    return a.properties.AGENTE === Agente;
                });
            }

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                return a.AGENTE === Agente;
            });
            if (filtroDataMpioPoly !== undefined) {
                filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                    return a.AGENTE === Agente;
                });
            }
        }

        if (FiltroTexto.toUpperCase() !== '') {
            filtroDataDptoPunto.features = filtroDataDptoPunto.features.filter(function (a) {
                var k1 = a.properties.DEPARTAMENTO.toUpperCase(),
                    k2 = a.properties.MUNICIPIO.toUpperCase(),
                    k3 = a.properties.TIPOHECHO.toUpperCase(),
                    k4 = a.properties.GRUPOS.toString().toUpperCase(),
                    k5 = a.properties.ANNO.toString();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

            filtroDataMpioPunto.features = filtroDataMpioPunto.features.filter(function (a) {
                var k1 = a.properties.DEPARTAMENTO.toUpperCase(),
                    k2 = a.properties.MUNICIPIO.toUpperCase(),
                    k3 = a.properties.TIPOHECHO.toUpperCase(),
                    k4 = a.properties.GRUPOS.toString().toUpperCase(),
                    k5 = a.properties.ANNO.toString();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

            filtroDataDptoPoly = filtroDataDptoPoly.filter(function (a) {
                var k1 = a.DEPARTAMENTO.toUpperCase(),
                    k2 = a.MUNICIPIO.toUpperCase(),
                    k3 = a.TIPOHECHO.toUpperCase(),
                    k4 = a.GRUPOS.toString().toUpperCase(),
                    k5 = a.ANNO.toString();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });

            filtroDataMpioPoly = filtroDataMpioPoly.filter(function (a) {
                var k1 = a.DEPARTAMENTO.toUpperCase(),
                    k2 = a.MUNICIPIO.toUpperCase(),
                    k3 = a.TIPOHECHO.toUpperCase(),
                    k4 = a.GRUPOS.toString().toUpperCase(),
                    k5 = a.ANNO.toString();

                if ((k1.includes(FiltroTexto)) || (k2.includes(FiltroTexto)) || (k3.includes(FiltroTexto)) || (k4.includes(FiltroTexto)) || (k5.includes(FiltroTexto))) {
                    return true;
                } else {
                    return false;
                }
            });
        }

        if (filtroDataDptoPunto.features.length > 0) {

            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });

            map.addLayer(Stamen_Watercolor);
            map.addLayer(positronLabels);

            if ((Mpio !== 'all')) {

                filtroDataMpioPuntoLayer = renderMarkersData(filtroDataMpioPunto, 10);
                map.addLayer(filtroDataMpioPuntoLayer);

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
                MpiosLayerFiltro.addTo(map);
                map.fitBounds(MpiosLayerFiltro.getBounds());

                filtroDataMpioPuntoLayer.bringToFront();

                map.removeControl(legendDpto);
                map.removeControl(legendMpio);
            } else if ((Dpto !== 'all')) {

                filtroDataMpioPuntoLayer = renderMarkersData(filtroDataMpioPunto, 10);
                map.addLayer(filtroDataMpioPuntoLayer);
                filtroDataMpioPuntoLayer.bringToFront();

                AddDatosMpio(filtroDataDptoPoly);
                AddLegendMpio();

                map.fitBounds(MpiosLayer.getBounds());
            } else {

                filtroDataDptoPuntoLayer = renderMarkersData(filtroDataDptoPunto, 10);
                map.addLayer(filtroDataDptoPuntoLayer);

                AddDatosDpto(filtroDataDptoPoly);
                AddLegendDpto();

                filtroDataDptoPuntoLayer.bringToFront();
                map.fitBounds(DptosLayer.getBounds());
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
function popupHecho(feature, layer) {
    "use strict";

    var TipoHecho = feature.properties.TIPOHECHO;
    var Municipio = feature.properties.MUNICIPIO;
    var Departamento = feature.properties.DEPARTAMENTO;
    var Annos = feature.properties.ANNO;
    var EsAgente = feature.properties.ESAGENTE;
    var Agente = feature.properties.AGENTE;
    var Grupo = feature.properties.GRUPOS.toString();

    var infobasica = "<table class='table table-striped table-bordered table-condensed'>" + "<tr><th>Tipo de Hecho</th><td>" + TipoHecho + "</td></tr>" + "<tr><th>Fecha</th><td>" + Annos + "</td></tr>" + "<tr><th>Ubicación</th><td>" + Municipio + ', ' + Departamento + "</td></tr>" + "<tr><th>Tipo Grupo</th><td>" + Grupo + "</td></tr>" + "<tr><th>¿ Es Agente Estatal ?</th><td>" + EsAgente + "</td></tr>" + "<tr><th>Tipo de Agente</th><td>" + Agente + "</td></tr>" + "<table>";

    layer.on({
        click: function (e) {
            $("#feature-title").html('<center>' + TipoHecho + '</center>');
            $("#feature-info").html(infobasica);

            $('.nav-tabs a[href="#feature-info"]').tab('show');
            $("#featureModal").modal("show");
        }
    });
}

function AddLegendDpto() {

    map.removeControl(legendMpio);
    map.removeControl(legendDpto);

    var TituloMapa = "Vulneración de Derechos Humanos en las 9 regiones" + '</br>' + 'por Departamentos';
    var unidadMapeo = " Hechos";

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
    legendDpto.addTo(map);
}

function AddLegendMpio() {
    var TituloMapa = "Vulneración de Derechos Humanos en las 9 regiones" + '</br>' + 'por Municipios';
    var unidadMapeo = " Hechos";

    map.removeControl(legendDpto);
    map.removeControl(legendMpio);

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
    legendMpio.addTo(map);
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
    DptosLayerBack.addTo(map);

    // Capa de Departamentos por Densidades
    DptosLayer = L.choropleth(capaDepartamentos, {
        filter: function (feature) {
            return (feature.properties.VALOR !== null)
        },
        valueProperty: 'VALOR',
        scale: ['yellow', 'red'],
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
    DptosLayer.addTo(map);
    map.fitBounds(DptosLayer.getBounds());
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
    MpiosLayerBack.addTo(map);

    // Capa de Municipios por Densidades
    MpiosLayer = L.choropleth(capaMunicipiosFiltrada, {
        filter: function (feature) {
            return (feature.properties.VALOR !== null);
        },
        valueProperty: 'VALOR',
        scale: ['yellow', 'red'],
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

    MpiosLayer.addTo(map);
}

/**
 * Recupera la seleccion del departamento y carga la lista de municipios asociados
 * @returns {string} la lista de municipios
 */
function filtrarAgente() {
    "use strict";

    var i, selAgente, lista, html, selEsAgente = $('#selEsAgente').val();

    if (selEsAgente !== 'all') {
        selAgente = listaAgente[selEsAgente] || [];
        lista = "<option value='all'>Todos</option>";
        html = lista + $.map(selAgente, function (selAgente) {
            return '<option value="' + selAgente.AGENTE + '">' + selAgente.AGENTE + '</option>';
        }).join('');

        $("#selAgente").html(html);

        //filtroDataMpioPunto = JSON.parse(JSON.stringify(hechos_municipio_geo));

        filtrarTodo();

    } else {
        if (document.getElementById('selAgente').options.length > 1) {
            for (i = document.getElementById('selAgente').options.length - 1; i >= 1; i--) {
                document.getElementById('selAgente').remove(i);
            }
        }

        var Dpto = document.getElementById('selDepartamento').value,
            Mpio = document.getElementById('selMunicipio').value,
            Annos = document.getElementById('selAnnos').value,
            TipoHecho = document.getElementById('selTipoHecho').value,
            Grupo = document.getElementById('selGrupo').value,
            FiltroTexto = document.getElementById('buscarPalabra').value.toUpperCase(),
            EsAgente = document.getElementById('selEsAgente').value,
            Agente = document.getElementById('selAgente').value;

        if ((Dpto !== 'all') || (Mpio !== 'all') || (Annos !== 'all') || (TipoHecho !== 'all') || (Grupo !== 'all') || (EsAgente !== 'all') || (Agente !== 'all') || (FiltroTexto !== '')) {
            filtrarTodo();
        } else {
            limpiarSeleccion();
        }
    }
}