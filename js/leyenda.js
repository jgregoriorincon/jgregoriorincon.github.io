// get color depending on population density value
function getColorISCB(d) {
    return d > 7.9 ? '#FF0000' :
        d > 5.9 ? '#EA0700' :
        d > 3.9 ? '#CC5A00' :
        d > 2.9 ? '#B86E00' :
        d > 1.9 ? '#A2821C' :
        d > 0.9 ? '#8B932E' :
        d > -0.1 ? '#6BA83E' :
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
    return d > 4.9 ? '#FF0000' :
        d > 3.9 ? '#FF1C00' :
        d > 2.9 ? '#FF5500' :
        d > 1.9 ? '#E0841D' :
        d > 0.9 ? '#9AA13A' :
        d > -0.1 ? '#50B547' :
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
    return d > 1.9 ? '#FF3A00' :
        d > 1.4 ? '#F37500' :
        d > 0.9 ? '#DF841E' :
        d > 0.4 ? '#94A23B' :
        d > -0.1 ? '#50B547' :
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
    return d > 2.9 ? '#FF0000' :
        d > 1.9 ? '#FF3A00' :
        d > 0.9 ? '#FE7500' :
        d > -0.1 ? '#50B547' :
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
    return d > 0.9 ? '#50B547' :
        d > 0.4 ? '#FE7500' :
        d > -0.1 ? '#FF0000' :
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
