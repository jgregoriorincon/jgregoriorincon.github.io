Plotly.d3.csv('data/Usos2.csv', function (err, rows) {

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  var allUsos = unpack(rows, 'ActividadEconomica'),
    allYears = unpack(rows, 'Year'),
    allLocalidades = unpack(rows, 'Localidad'),
    allPorcentajes = unpack(rows, 'PorcUso'),
    listofYears = [],
    listofLocalidades = [],
    listofUsos = [],
    currentUso = [],
    currentLocalidad = [],
    currentPorcentaje = [];

  for (var i = allYears.length - 1; i > 0; i--) {
    if (listofYears.indexOf(allYears[i]) === -1) {
      listofYears.push(allYears[i]);
    }
  }
  for (var i = 0; i < allLocalidades.length; i++) {
    if (listofLocalidades.indexOf(allLocalidades[i]) === -1) {
      listofLocalidades.push(allLocalidades[i]);
    }
  }
  for (var i = 0; i < allUsos.length; i++) {
    if (listofUsos.indexOf(allUsos[i]) === -1) {
      listofUsos.push(allUsos[i]);
    }
  }

  function getYearsData(chosenYear) {
    currentUso = [];
    currentLocalidad = [];
    currentPorcentaje = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allYears[i] === chosenYear) {
        currentUso.push(allUsos[i]);
        currentLocalidad.push(allLocalidades[i]);
        currentPorcentaje.push(parseFloat(allPorcentajes[i]) * 100);
      }
    }
  }

  function getLocalidadData(chosenLocalidad) {
    allLocalidad = [];
    allPorcNPH = [];
    allPorcPH = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allLocalidades[i] == chosenLocalidad) {
        allLocalidad.push(allYears[i]);
        allPorcNPH.push((allPorcNPHs[i] * 100).toFixed(2) + '%');
        allPorcPH.push((allPorcPHs[i] * 100).toFixed(2) + '%');
      }
    }
  }

  setYearPlot('2018');
  setLocalidadPlot('USAQUÉN');

  function setYearPlot(chosenYear) {
    getYearsData(chosenYear);

    var dataBodegas = [],
      dataClinicas = [],
      dataComercio = [],
      dataHoteles = [],
      dataIndustria = [],
      dataLotes = [],
      dataOficinas = [],
      dataOtros = [],
      dataResidencial = [],
      dataUniversidades = [];

    for (var i = 0; i < currentUso.length; i++) {

      switch (currentUso[i]) {
        case "RESIDENCIAL":
          dataResidencial.push(currentPorcentaje[i]);
          break;
        case "OFICINAS":
          dataOficinas.push(currentPorcentaje[i]);
          break;
        case "COMERCIO":
          dataComercio.push(currentPorcentaje[i]);
          break;
        case "BODEGAS":
          dataBodegas.push(currentPorcentaje[i]);
          break;
        case "UNIVERSIDADES Y COLEGIOS":
          dataUniversidades.push(currentPorcentaje[i]);
          break;
        case "LOTES":
          dataLotes.push(currentPorcentaje[i]);
          break;
        case "OTROS":
          dataOtros.push(currentPorcentaje[i]);
          break;
        case "CLINICAS, HOSPITALES, CENTROS MEDICOS":
          dataClinicas.push(currentPorcentaje[i]);
          break;
        case "HOTELES":
          dataHoteles.push(currentPorcentaje[i]);
          break;
        case "INDUSTRIA":
          dataIndustria.push(currentPorcentaje[i]);
          break;
        default:
          break;
      }
    }

    var traces = [{
        x: listofLocalidades,
        y: dataBodegas,
        type: 'bar',
        fill: 'tozeroy',
        name: 'Bodegas',
        marker: {
          color: colorBodega,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataClinicas,
        type: 'bar',
        fill: 'tonexty',
        name: 'Clinicas',
        marker: {
          color: colorClinica,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataComercio,
        type: 'bar',
        fill: 'tonexty',
        name: 'Comercio',
        marker: {
          color: colorComercio,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataHoteles,
        type: 'bar',
        fill: 'tonexty',
        name: 'Hoteles',
        marker: {
          color: colorHotel,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataIndustria,
        type: 'bar',
        fill: 'tonexty',
        name: 'Industria',
        marker: {
          color: colorIndustria,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataLotes,
        type: 'bar',
        fill: 'tonexty',
        name: 'Lotes',
        marker: {
          color: colorLote,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataOficinas,
        type: 'bar',
        fill: 'tonexty',
        name: 'Oficinas',
        marker: {
          color: colorOficina,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataOtros,
        fill: 'tonexty',
        type: 'bar',
        name: 'Otros',
        marker: {
          color: colorOtro,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataResidencial,
        type: 'bar',
        fill: 'tonexty',
        name: 'Residencial',
        marker: {
          color: colorResidencial,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataUniversidades,
        type: 'bar',
        fill: 'tonexty',
        name: 'Universidades',
        marker: {
          color: colorUniversidad,
          width: 1
        },
      }
    ];

    function stackedArea(traces) {
      for(var i=1; i<traces.length; i++) {
        for(var j=0; j<(Math.min(traces[i]['y'].length, traces[i-1]['y'].length)); j++) {
          traces[i]['y'][j] += traces[i-1]['y'][j];
        }
      }
      return traces;
    }

    var layout2 = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'stack',
      margin: {
        l: 100,
        t: 30,
        // b: 50,
        pad: 0
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      width: window.innerWidth,
      height: window.innerHeight /3,
    };

    // stackedArea(traces);
    Plotly.newPlot('plotdiv2', traces, layout2);

  }

  function setLocalidadPlot(chosenLocalidad) {
    getLocalidadData(chosenLocalidad);

    var minRange = minArrayValue(allNPH),
      maxRange = maxArrayValue(allNPH);

    maxRange = maxRange + maxArrayValue(allPH);

    minRange = minRange + minArrayValue(allPH);
    minRange = minRange - (minRange / 100);

    var trace1 = {
      y: allPorcPH,
      x: allLocalidad,
      type: 'bar',
      name: 'PH',
      marker: {
        color: 'rgba(251, 106, 74, 0.8)',
        width: 1
      },
    };
    var trace2 = {
      y: allPorcNPH,
      x: allLocalidad,
      type: 'bar',
      name: 'NPH',
      marker: {
        color: 'rgba(252, 174, 145, 0.8)',
        width: 1
      },
    };

    var data2 = [trace1, trace2];

    layout2 = {
      // autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'stack',
      // barnorm: '',
      margin: {
        l: 150,
        t: 50,
        b: 30,
        pad: 4
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      // title: 'Crecimiento de la población de Bogotá D.C.',
      width: window.innerWidth,
      height: window.innerHeight /3,
      yaxis: {
        zerolinecolor: '#fff'
      }
    };

    Plotly.newPlot('plotdiv2', data2, layout2);
  }

  var yearSelector = document.querySelector('#yearSelector');
  var localidadSelector = document.querySelector('#localidadSelector');

  function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length; i++) {
      var currentOption = document.createElement('option');
      currentOption.text = textArray[i];
      selector.appendChild(currentOption);
    }
  }

  assignOptions(listofYears, yearSelector);
  assignOptions(listofLocalidades, localidadSelector);

  function updateYear() {
    setYearPlot(yearSelector.value);
  }

  function updateLocalidad() {
    setLocalidadPlot(localidadSelector.value);
  }

  yearSelector.addEventListener('change', updateYear, false);
  localidadSelector.addEventListener('change', updateLocalidad, false);
});