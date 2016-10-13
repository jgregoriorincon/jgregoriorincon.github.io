// OBSERVATORIOS SUR //
var NodoSurPutumayo = JSON.parse(JSON.stringify(Observatorios));

NodoSurPutumayo.features = NodoSurPutumayo.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'PUTUMAYO';
});

var NodoSurNarino = JSON.parse(JSON.stringify(Observatorios));

NodoSurNarino.features = NodoSurNarino.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'NARIÑO';
});

var NodoSurCauca = JSON.parse(JSON.stringify(Observatorios));

NodoSurCauca.features = NodoSurCauca.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'CAUCA';
});

var NodoSurValleCauca = JSON.parse(JSON.stringify(Observatorios));

NodoSurValleCauca.features = NodoSurValleCauca.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'VALLE DEL CAUCA';
});
