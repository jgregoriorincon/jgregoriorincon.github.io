/*
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

// OBSERVATORIOS CENTRO //
var NodoCentroBogota = JSON.parse(JSON.stringify(Observatorios));
NodoCentroBogota.features = NodoCentroBogota.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'BOGOTÁ D.C.';
});

var NodoCentroBoyaca = JSON.parse(JSON.stringify(Observatorios));
NodoCentroBoyaca.features = NodoCentroBoyaca.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'BOYACÁ';
});

var NodoCentroMeta = JSON.parse(JSON.stringify(Observatorios));
NodoCentroMeta.features = NodoCentroMeta.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'META';
});

var NodoCentroSantander = JSON.parse(JSON.stringify(Observatorios));
NodoCentroSantander.features = NodoCentroSantander.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'SANTANDER';
});

var NodoCentroNteSantander = JSON.parse(JSON.stringify(Observatorios));
NodoCentroNteSantander.features = NodoCentroNteSantander.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'NORTE DE SANTANDER';
});

// OBSERVATORIOS CARIBE //
var NodoCaribeSucre = JSON.parse(JSON.stringify(Observatorios));
NodoCaribeSucre.features = NodoCaribeSucre.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'SUCRE';
});

var NodoCaribeBolivar = JSON.parse(JSON.stringify(Observatorios));
NodoCaribeBolivar.features = NodoCaribeBolivar.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'BOLÍVAR';
});

var NodoCaribeMagdalena = JSON.parse(JSON.stringify(Observatorios));
NodoCaribeMagdalena.features = NodoCaribeMagdalena.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'MAGDALENA';
});

var NodoCaribeAtlantico = JSON.parse(JSON.stringify(Observatorios));
NodoCaribeAtlantico.features = NodoCaribeAtlantico.features.filter(function (a) {
    return a.properties.DEPARTAMENTO == 'ATLANTICO';
});
*/