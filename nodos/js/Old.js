

// Se parsean los datos de InfoMapaV2 en un GeoJSON
var eventos = GeoJSON.parse(InfoMapaV2.infoMapa, {
    Point: ['Lat', 'Lon']
});


// elementos geográficos
var hechos = L.geoJson(eventos, {
    pointToLayer: function (feature, latlng) {

        var smallIcon = L.icon({
            iconSize: [27, 27],
            iconAnchor: [13, 27],
            popupAnchor: [1, -24],
            iconUrl: feature.properties.Icono
        });

        var marker = L.marker(latlng, {
            icon: smallIcon
        });

        if (feature.properties) {
            var popupText = '';

            if (feature.properties.Fecha) {
                popupText += 'Fecha: ' + feature.properties.Fecha + '<br/>';
            }

            if (feature.properties.Comuna) {
                popupText += 'Comuna: ' + feature.properties.Comuna + '<br/>';
            }

            if (feature.properties.Barrio) {
                popupText += 'Barrio: ' + feature.properties.Barrio + '<br/>';
            }

            if (feature.properties.Sexo) {
                popupText += 'Sexo: ' + feature.properties.Sexo + '<br/>';
            }

            if (feature.properties.Icono) {
                tipoHecho = feature.properties.Icono;
                tipoHecho = tipoHecho.replace('../../Content/Images/', '');
                tipoHecho = toTitleCase(tipoHecho.replace('.png', ''));

                popupText += 'Tipo Hecho: ' + tipoHecho + '<br/>';
            }

            marker.bindPopup(popupText);
        }

        return marker;
    }
});

// Adicionar los hechos al cluster
clusterHechos.addLayer(hechos);

// Adicionar las capas al mapa
L.control.layers(baseMaps).addTo(mapNodos);

// Funcion para convertir primera letra en mayuscula
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}