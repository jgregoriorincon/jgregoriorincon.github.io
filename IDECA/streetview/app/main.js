var streetPlace = {
  lat: 4.598268384435886,
  lng: -74.07645761992171
};

var pulsingIcon = L.icon.pulse({
  iconSize: [20, 20],
  color: '#019BD9'
});

var marker, markerGroup, mapIDECA, locationPoint;
var panorama;

function initialize() {

  panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), {
      position: streetPlace,
      pov: {
        heading: 94,
        pitch: 10
      },
      motionTracking: false,
      motionTrackingControl: true
    });

  panorama.addListener('position_changed', function () {
    var panoPos = panorama.getPosition();
    var panoPosLat = panoPos.lat();
    var panoPosLng = panoPos.lng();
    addMarker(panoPosLat, panoPosLng);
  }); 
}

function addMarker(lat, lng) {
  markerGroup.clearLayers();
  marker = new L.Marker(new L.LatLng(lat, lng), {
    icon: pulsingIcon,
    draggable: true
  }).addTo(markerGroup);

  marker.on('dragend', function (event) {
    var marker = event.target;
    var position = marker.getLatLng();
    console.log(position);

    marker.setLatLng(position, {
      draggable: 'true'
    }).bindPopup(position).update();

    streetPlace = {
      lat: position.lat,
      lng: position.lng
    };
    panorama.setPosition(streetPlace);
  });
}

function onMapClick(e) {
  addMarker(e.latlng.lat, e.latlng.lng);

  streetPlace = {
    lat: e.latlng.lat,
    lng: e.latlng.lng
  };

  panorama.setPosition(streetPlace);
}

function onLocationFound(e) {
  onMapClick(e);
}

function onLocationError(e) {
  alert("La aplicación no tiene permisos para geolocalizar al usuario");
}

$(document).ready(function () {
  mapIDECA = new L.Map('mapIDECA', {
    center: new L.LatLng(streetPlace.lat, streetPlace.lng),
    zoom: 11,
    minZoom: 9,
    attributionControl: false
  });

  locationPoint = L.control.locate({drawCircle: false, drawMarker: false, onLocationError: onLocationError}).addTo(mapIDECA);

  mapIDECA.on('locationfound', onLocationFound);
  //mapIDECA.on('locationerror', onLocationError);

  var capa = L.esri.tiledMapLayer({
    url: "http://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/Mapa_Referencia/mapa_base_3857/MapServer",
    maxZoom: 20
  });
  capa.addTo(mapIDECA);

  var styleMutant = L.gridLayer.googleMutant({
    styles: [{
        elementType: 'labels',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'water',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'landscape',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'road',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'poi',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'transit',
        stylers: [{
          visibility: 'on'
        }]
      },
      {
        featureType: 'administrative',
        stylers: [{
          visibility: 'off'
        }]
      },
      {
        featureType: 'administrative.locality',
        stylers: [{
          visibility: 'off'
        }]
      }
    ],
    maxZoom: 24,
    type: 'roadmap'
  });
  styleMutant.addGoogleLayer('TrafficLayer');
  //styleMutant.addTo(mapIDECA);

  markerGroup = L.layerGroup().addTo(mapIDECA);
  addMarker(streetPlace.lat, streetPlace.lng);
  mapIDECA.on('click', onMapClick);

  var overlayMaps = {
    "Estado del Tráfico": styleMutant
  };

  L.control.layers(null, overlayMaps, {
    collapsed: false
  }).addTo(mapIDECA);


  $(".panel-left").resizable({
    handleSelector: ".splitter",
    resizeHeight: false,
    onDragEnd: function(){
      google.maps.event.trigger(panorama, 'resize');
      mapIDECA.invalidateSize();
    }
  });

  
});