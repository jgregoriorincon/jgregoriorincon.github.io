// Basemaps disponibles, pueden quitarse y dejar uno solo, esta por defecto el gris que contrasta mejor con el mapa de calor
var baseMaps = {
    "Gris": cartoLight
};

// Variable del Cluster
var clusterHechos = L.markerClusterGroup();

// Mapa asociado a los atributos de la variable InfoMapaV2
var map = L.map("mapNodos", {
    defaultExtentControl: true,
    zoom: 6,
    maxZoom: 19,
    center: [4, -74],
    layers: [cartoLight, clusterHechos],
    zoomControl: true,
    attributionControl: false
});


var Departamentos = L.geoJson(Dptos, {
    onEachFeature: onEachFeature,
    style: function (feature) {
        switch (feature.properties.NODO) {
        case 'Caribe':
            return {
                //dashArray: '3',
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8,
                fillColor: '#b2df8a'
            };
        case 'Centro':
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8,
                fillColor: '#fdcb7b'
            };
        case 'Sur':
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8,
                fillColor: '#a5bfdd'
            };
        default:
            return {
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.8,
                fillColor: '#f1f4c7'
            };
        }
    }
});

map.addLayer(Departamentos);

function onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.NODO) {
        layer.bindPopup("Nodo: " + feature.properties.NODO + '<br/>' + "Departamento: " + feature.properties.DEPTO);
    }
};

var searchControl = new L.Control.Search({
    layer: Departamentos,
    propertyName: 'NODO',
    circleLocation: false,
    moveToLocation: function (latlng, title, map) {
        //map.fitBounds( latlng.layer.getBounds() );
        var zoom = map.getBoundsZoom(latlng.layer.getBounds());
        map.setView(latlng, zoom); // access the zoom
    }
});

searchControl.on('search:locationfound', function (e) {

    e.layer.setStyle({
        fillColor: '#3f0',
        color: '#0f0'
    });
    if (e.layer._popup)
        e.layer.openPopup();

}).on('search:collapsed', function (e) {

    featuresLayer.eachLayer(function (layer) { //restore feature color
        featuresLayer.resetStyle(layer);
    });
});

map.addControl(searchControl); //inizialize search control


////////////////////


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