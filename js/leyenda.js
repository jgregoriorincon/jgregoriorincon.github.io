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
    return d > 5.1 ? '#FF0000' :
        d > 4.1 ? '#FF1C00' :
        d > 3.1 ? '#FF5500' :
        d > 2.1 ? '#E0841D' :
        d > 1.1 ? '#9AA13A' :
        d > 0.0 ? '#50B547' :
        '#50B547';
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
    return d > 2.1 ? '#FF3A00' :
        d > 1.6 ? '#F37500' :
        d > 1.1 ? '#DF841E' :
        d > 0.6 ? '#94A23B' :
        d > 0.1 ? '#50B547' :
        '#50B547';
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
    return d > 3.1 ? '#FF0000' :
        d > 2.1 ? '#FF3A00' :
        d > 1.1 ? '#FE7500' :
        d > 0.1 ? '#50B547' :
        '#50B547';
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
    return d > 1.1 ? '#50B547' :
        d > 0.6 ? '#FE7500' :
        d > 0.1 ? '#FF0000' :
        '#FF0000';
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
