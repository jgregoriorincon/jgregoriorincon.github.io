$(document).ready(function () {
    var graphDiv1 = document.getElementById('graph1');
    var graphDiv2 = document.getElementById('graph2');
    var graphDiv3 = document.getElementById('graph3');
    Papa.parse("data/Data1.csv", {
        download: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        header: true,
        complete: function (parsed) {
            console.table(parsed.data);
            var Localidad = unpack(parsed.data, 'Localidad');
            var NumeroPredios = unpack(parsed.data, 'NumeroPredios');
            var AreaConstruida = unpack(parsed.data, 'AreaConstruida');
            var ValorAvaluoCatastral = unpack(parsed.data, 'ValorAvaluoCatastral');

            var colores = rangeColors(Localidad.length, '#F1CF6D', '#246D3B');

            var LocalidadNumeroPredios = Localidad.join(";").split(";");
            var LocalidadAreaConstruida = Localidad.join(";").split(";");
            var LocalidadValorAvaluoCatastral = Localidad.join(";").split(";");

            bubbleSortAscending(NumeroPredios, LocalidadNumeroPredios);
            bubbleSortAscending(AreaConstruida, LocalidadAreaConstruida);
            bubbleSortDescending(ValorAvaluoCatastral, LocalidadValorAvaluoCatastral);

            trace1 = {
                y: NumeroPredios,
                x: LocalidadNumeroPredios,
                marker: {
                    color: colores
                },
                name: 'Número de Predios',
                opacity: 1,
                orientation: 'v',
                showlegend: false,
                type: 'bar',
            };
            layout1 = {
                autosize: true,
                paper_bgcolor: 'rgba(0, 0, 0, 0.3)',
                plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
                barmode: 'group',
                barnorm: '',
                height: window.innerHeight/2.0,
                margin: {
                    l: 70,
                    t: 50,
                    b: 100,
                    pad: 4
                },
                font: {
                    color: '#fff'
                },
                hoverlabel: {
                    bgcolor: 'black',
                    font: {
                        color: 'white'
                    }
                },
                showlegend: false,
                title: 'Número de Predios',
                width: sizeWindowWidth,
                xaxis: {
                    autorange: true,
                    // title: 'Localidad',
                    type: 'category'
                },
                yaxis: {
                    autorange: true,
                    title: 'Vigencia 2018',
                    type: 'linear'
                }
            };
            Plotly.plot(graphDiv1, [trace1],
                layout1, {
                    modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                    displaylogo: false
                }
            );

            trace2 = {
                y: AreaConstruida,
                x: LocalidadAreaConstruida,
                marker: {
                    color: colores
                },
                name: 'Miles de Millones de Pesos',
                opacity: 1,
                orientation: 'v',
                showlegend: false,
                type: 'bar',
            };
            layout2 = {
                autosize: true,
                paper_bgcolor: 'rgba(0, 0, 0, 0.3)',
                plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
                barmode: 'group',
                barnorm: '',
                height: window.innerHeight/2.0,
                margin: {
                    l: 70,
                    t: 50,
                    b: 100,
                    pad: 4
                },
                showlegend: false,
                font: {
                    color: '#fff'
                },
                hoverlabel: {
                    bgcolor: 'black',
                    font: {
                        color: 'white'
                    }
                },
                title: 'Área de Contrucción',
                width: sizeWindowWidth,
                xaxis: {
                    autorange: true,
                    // title: 'Vigencia 2018',
                    type: 'category'
                },
                yaxis: {
                    autorange: true,
                    title: 'Vigencia 2018',
                    type: 'linear'
                }
            };
            Plotly.plot(graphDiv2, [trace2],
                layout2, {
                    modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                    displaylogo: false
                }
            );

            trace3 = {
                x: ValorAvaluoCatastral,
                y: LocalidadValorAvaluoCatastral,
                marker: {
                    color: colores
                },
                name: 'Miles de Millones de Pesos',
                opacity: 1,
                orientation: 'h',
                showlegend: false,
                type: 'bar',
            };
            layout3 = {
                autosize: true,
                paper_bgcolor: 'rgba(0, 0, 0, 0.3)',
                plot_bgcolor: 'rgba(0, 0, 0, 0.3)',
                barmode: 'group',
                barnorm: '',
                height: window.innerHeight,
                margin: {
                    l: 150,
                    t: 70,
                    pad: 4
                },
                showlegend: false,
                font: {
                    color: '#fff'
                },
                hoverlabel: {
                    bgcolor: 'black',
                    font: {
                        color: 'white'
                    }
                },
                title: 'Valor Avaluo Catastral (En Miles de Millones)',
                width: sizeWindowWidth,
                xaxis: {
                    autorange: true,
                    title: 'Vigencia 2018',
                    type: 'linear'
                },
                yaxis: {
                    autorange: true,
                    // title: 'Localidad',
                    type: 'category'
                }
            };
            Plotly.plot(graphDiv3, [trace3],
                layout3, {
                    modeBarButtonsToRemove: ['sendDataToCloud', 'hoverClosestCartesian', 'hoverCompareCartesian'],
                    displaylogo: false
                }
            );
        }
    });

});