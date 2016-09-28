// get color depending on population density value
function getColorISCB(d) {
    return d > 8.1 ? '#FF0000' :
        d > 6.1 ? '#EA0700' :
        d > 4.1 ? '#CC5A00' :
        d > 3.1 ? '#B86E00' :
        d > 2.1 ? '#A2821C' :
        d > 1.1 ? '#8B932E' :
        d > 0.1 ? '#6BA83E' :
        '#50B547';
}

function styleISCB(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorISCB(feature.properties.ISCB)
    };
}

// -----------------------------------------------------
function getColorDelitos(d) {
    return d > 8.1 ? '#FF0000' :
        d > 6.1 ? '#00FF00' :
        d > 4.1 ? '#0000FF' :
        d > 3.1 ? '#0F0F0F' :
        d > 2.1 ? '#F0F0F0' :
        d > 1.1 ? '#FFF000' :
        d > 0.1 ? '#000FFF' :
        '#000000';
}

function styleDelitos(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorDelitos(feature.properties.Delitos)
    };
}

// -----------------------------------------------------
function getColorConvivencia(d) {
    return d > 8.1 ? '#FF0000' :
        d > 6.1 ? '#00FF00' :
        d > 4.1 ? '#0000FF' :
        d > 3.1 ? '#0F0F0F' :
        d > 2.1 ? '#F0F0F0' :
        d > 1.1 ? '#FFF000' :
        d > 0.1 ? '#000FFF' :
        '#000000';
}

function styleConvivencia(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorConvivencia(feature.properties.Convivencia)
    };
}

// -----------------------------------------------------
function getColorFenomenos(d) {
    return d > 8.1 ? '#FF0000' :
        d > 6.1 ? '#00FF00' :
        d > 4.1 ? '#0000FF' :
        d > 3.1 ? '#0F0F0F' :
        d > 2.1 ? '#F0F0F0' :
        d > 1.1 ? '#FFF000' :
        d > 0.1 ? '#000FFF' :
        '#000000';
}

function styleFenomenos(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorFenomenos(feature.properties.Fenomenos)
    };
}

// -----------------------------------------------------
function getColorInstitucional(d) {
    return d > 8.1 ? '#FF0000' :
        d > 6.1 ? '#00FF00' :
        d > 4.1 ? '#0000FF' :
        d > 3.1 ? '#0F0F0F' :
        d > 2.1 ? '#F0F0F0' :
        d > 1.1 ? '#FFF000' :
        d > 0.1 ? '#000FFF' :
        '#000000';
}

function styleInstitucional(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorInstitucional(feature.properties.Institucional)
    };
}
