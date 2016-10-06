// get color depending on population density value
function getColorFinal(d) {
    return d ==  'SI' ? '#00C285' :
        d == 'NO' ? '#FF894C' :
        '#FF0000';
}

function styleFinal(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorFinal(feature.properties.Ganador)
    };
}

// -----------------------------------------------------
function getColorParticipacion(d) {
    return d > 0.8 ? '##990000' :
        d > 0.7 ? '#d7301f' :
        d > 0.6 ? '#ef6548' :
        d > 0.5 ? '#fc8d59' :
        d > 0.4 ? '#fdbb84' :
        d > 0.3 ? '#fdd49e' :
        d > 0.2 ? '#fee8c8' :
        '#fff7ec';
}

function styleParticipacion(feature) {
    return {
        weight: 1,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColorParticipacion(feature.properties.PorcPartic)
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
