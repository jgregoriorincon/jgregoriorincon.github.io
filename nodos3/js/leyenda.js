function getColorNodos(d) {
    return d === 'Caribe' ? '#b2df8a' :
        d === 'Centro' ? '#fdcb7b' :
        d === 'Sur' ? '#a5bfdd' :
        '#f1f4c7';
}

function styleNodos(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorNodos(feature.properties.NODO)
    };
}

// -----------------------------------------------------

function styleMpiosCaribe(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: '#b2df8a'
    };
}

// -----------------------------------------------------

function styleMpiosCentro(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: '#fdcb7b'
    };
}

// -----------------------------------------------------

function styleMpiosSur(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: '#a5bfdd'
    };
}


// -----------------------------------------------------
function getColorSi(d) {
    return d > 0.9 ? '#005824' :
        d > 0.8 ? '#005824' :
        d > 0.7 ? '#238b45' :
        d > 0.6 ? '#41ae76' :
        d > 0.5 ? '#66c2a4' :
        d > 0.4 ? '#99d8c9' :
        d > 0.3 ? '#ccece6' :
        '#e5f5f9';
}

function styleSi(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorSi(feature.properties.PorcSi)
    };
}

// -----------------------------------------------------
function getColorNo(d) {
    return d > 0.8 ? '#8c2d04' :
        d > 0.7 ? '#cc4c02' :
        d > 0.6 ? '#ec7014' :
        d > 0.5 ? '#fe9929' :
        d > 0.4 ? '#fec44f' :
        d > 0.3 ? '#fee391' :
        d > 0.2 ? '#fff7bc' :
        '#ffffe5';
}

function styleNo(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorNo(feature.properties.PorcNo)
    };
}

// -----------------------------------------------------
function getColorNulos(d) {
    return d > 0.03 ? '#cb181d' :
        d > 0.02 ? '#fb6a4a' :
        d > 0.01 ? '#fcae91' :
        '#fee5d9';
}

function styleNulos(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorNulos(feature.properties.PorcNulos)
    };
}

// -----------------------------------------------------
function getColorNoMarcados(d) {
    return d > 0.01 ? '#fb6a4a' :
        d > 0.0 ? '#fcae91' :
        '#fee5d9';
}

function styleNoMarcados(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.8,
        fillColor: getColorNoMarcados(feature.properties.PorcNoMarc)
    };
}
