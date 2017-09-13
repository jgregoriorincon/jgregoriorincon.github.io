var DptosLayer, MpiosLayer;

getIdfromUrl();

var webmap = L.esri.webMap(webmapId, {
  map: L.map("map")
});

webmap.on('load', function () {
  var overlayMaps = {};

  createPoligonos();

  webmap._map.addLayer(DptosLayer);
  webmap._map.addLayer(MpiosLayer);

  webmap.layers.map(function (l) {
    overlayMaps[l.title] = l.layer;
  });
  overlayMaps["Departamentos"] = DptosLayer;
  overlayMaps["Municipios"] = MpiosLayer;

  L.control.layers({}, overlayMaps, {
    position: 'bottomleft'
  }).addTo(webmap._map);

  DptosLayer.bringToFront();
  MpiosLayer.bringToFront();

  webmap._map.setView(new L.LatLng(slideMap[0].latitud, slideMap[0].longitud), slideMap[0].zoom);
});

function getIdfromUrl() {
  var urlParams = location.search.substring(1).split('&');
  for (var i = 0; urlParams[i]; i++) {
    var param = urlParams[i].split('=');
    if (param[0] === 'id') {
      webmapId = param[1]
    }
  }
}

function createPoligonos() {
  "use strict";

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
    }
  });

  // Capa de MUNICIPIOS
  MpiosLayer = L.geoJson(undefined, {
    style: styleMpios,
    onEachFeature: function (feature, layer) {
      layer.bindTooltip(feature.properties.NOMBRE, {
        permanent: false,
        direction: "auto"
      });
      layer.on('mouseover', highlightFeatureMpios);
      layer.on('mouseout', resetHighlightMpios);
    }
  });

  DptosLayer.addData(capaDepartamentos);
  MpiosLayer.addData(capaMunicipios);
}

function styleDptos(feature) {
  "use strict";

  return {
    weight: 2,
    opacity: 1.0,
    color: 'black',
    dashArray: '0',
    fillOpacity: 0.1,
    fillColor: "#fff"
  };
}

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

function highlightFeature(e) {
  "use strict";

  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.3
  });
}

function highlightFeatureMpios(e) {
  "use strict";

  var layer = e.target;
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.3
  });
}

function resetHighlightDptos(e) {
  "use strict";
  DptosLayer.resetStyle(e.target);
  DptosLayer.setStyle(styleDptos);
}

function resetHighlightMpios(e) {
  "use strict";
  MpiosLayer.resetStyle(e.target);
  MpiosLayer.setStyle(styleMpios);
}

$(document).ready(function () {

  webmap._map.setView(new L.LatLng(slideMap[0].latitud, slideMap[0].longitud), slideMap[0].zoom);

});