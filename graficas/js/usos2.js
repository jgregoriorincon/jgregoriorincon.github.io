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

    var currentUso2 = [],
    currentYear2 = [],
    currentPorcentaje2 = [];

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
    currentUso2 = [];
    currentYear2 = [];
    currentPorcentaje2 = [];
    for (var i = 0; i < allLocalidades.length; i++) {
      if (allLocalidades[i] == chosenLocalidad) {
        currentUso2.push(allUsos[i]);
        currentYear2.push(allYears[i]);
        currentPorcentaje2.push(parseFloat(allPorcentajes[i]) * 100);
      }
    }
  }

  setYearPlot('2018');
  setLocalidadPlot('Bogotá D.C.');

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
        t: 0,
        b: 150,
        pad: 0
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      width: window.innerWidth,
      height: window.innerHeight /2,
    };

    // stackedArea(traces);
    Plotly.newPlot('plotdiv2', traces, layout2);

  }

  function setLocalidadPlot(chosenLocalidad) {
    getLocalidadData(chosenLocalidad);

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

      for (var i = 0; i < currentUso2.length; i++) {
        switch (currentUso2[i]) {
          case "RESIDENCIAL":
            dataResidencial.push(currentPorcentaje2[i]);
            break;
          case "OFICINAS":
            dataOficinas.push(currentPorcentaje2[i]);
            break;
          case "COMERCIO":
            dataComercio.push(currentPorcentaje2[i]);
            break;
          case "BODEGAS":
            dataBodegas.push(currentPorcentaje2[i]);
            break;
          case "UNIVERSIDADES Y COLEGIOS":
            dataUniversidades.push(currentPorcentaje2[i]);
            break;
          case "LOTES":
            dataLotes.push(currentPorcentaje2[i]);
            break;
          case "OTROS":
            dataOtros.push(currentPorcentaje2[i]);
            break;
          case "CLINICAS, HOSPITALES, CENTROS MEDICOS":
            dataClinicas.push(currentPorcentaje2[i]);
            break;
          case "HOTELES":
            dataHoteles.push(currentPorcentaje2[i]);
            break;
          case "INDUSTRIA":
            dataIndustria.push(currentPorcentaje2[i]);
            break;
          default:
            break;
        }
      }

      var traces2 = [{
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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
        x: listofYears,
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

    var layout = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'stack',
      margin: {
        l: 100,
        t: 0,
        b: 30,
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
    Plotly.newPlot('plotdiv1', traces2, layout);

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