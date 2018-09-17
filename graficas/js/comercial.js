Plotly.d3.csv('data/Comercial.csv', function (err, rows) {

  function unpack(rows, key) {
    return rows.map(function (row) {
      return row[key];
    });
  }

  var allUsos = unpack(rows, 'ActividadEconomica'),
    allYears = unpack(rows, 'Year'),
    allLocalidades = unpack(rows, 'Localidad'),
    allPredios = unpack(rows, 'Predios'),
    allPorcentajes = unpack(rows, 'PorcPredios'),
    listofYears = [],
    listofLocalidades = [],
    listofUsos = [],
    currentUso = [],
    currentLocalidad = [],
    currentPredio = [],
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
    currentUso = [];
    currentLocalidad = [];
    currentPredio = [];
    currentPorcentaje = [];
    for (var i = 0; i < allYears.length; i++) {
      if (allLocalidades[i] === chosenLocalidad) {
        currentUso.push(allUsos[i]);
        currentLocalidad.push(allLocalidades[i]);
        currentPredio.push(allPredios[i]);
        currentPorcentaje.push(parseFloat(allPorcentajes[i]) * 100);
      }
    }
  }

  // Default Country Data
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
      dataUniversidades = [];

    for (var i = 0; i < currentUso.length; i++) {

      switch (currentUso[i]) {
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
        fill: 'tozeroy',
        name: 'Bodegas',
        type: 'bar',
        marker: {
          color: colorBodega,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataClinicas,
        fill: 'tonexty',
        name: 'Clinicas',
        type: 'bar',
        marker: {
          color: colorClinica,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataComercio,
        fill: 'tonexty',
        name: 'Comercio',
        type: 'bar',
        marker: {
          color: colorComercio,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataHoteles,
        fill: 'tonexty',
        name: 'Hoteles',
        type: 'bar',
        marker: {
          color: colorHotel,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataIndustria,
        fill: 'tonexty',
        name: 'Industria',
        type: 'bar',
        marker: {
          color: colorIndustria,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataLotes,
        fill: 'tonexty',
        name: 'Lotes',
        type: 'bar',
        marker: {
          color: colorLote,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataOficinas,
        fill: 'tonexty',
        name: 'Oficinas',
        type: 'bar',
        marker: {
          color: colorOficina,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataOtros,
        fill: 'tonexty',
        name: 'Otros',
        type: 'bar',
        marker: {
          color: colorOtro,
          width: 1
        },
      },
      {
        x: listofLocalidades,
        y: dataUniversidades,
        fill: 'tonexty',
        name: 'Universidades',
        type: 'bar',
        marker: {
          color: colorUniversidad,
          width: 1
        },
      }
    ];

    var layout2 = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      barmode: 'stack',
      margin: {
        l: 100,
        t: 30,
        b: 100,
        pad: 0
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      width: window.innerWidth,
      height: window.innerHeight / 2,
    };

    // stackedArea(traces);
    Plotly.newPlot('plotdiv1', traces, layout2);

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
      dataUniversidades = [];
    var dataBodegasPredios = [],
      dataClinicasPredios = [],
      dataComercioPredios = [],
      dataHotelesPredios = [],
      dataIndustriaPredios = [],
      dataLotesPredios = [],
      dataOficinasPredios = [],
      dataOtrosPredios = [],
      dataUniversidadesPredios = [];

    for (var i = 0; i < currentUso.length; i++) {

      switch (currentUso[i]) {
        case "OFICINAS":
          dataOficinas.push(currentPorcentaje[i]);
          dataOficinasPredios.push(currentPredio[i]);
          break;
        case "COMERCIO":
          dataComercio.push(currentPorcentaje[i]);
          dataComercioPredios.push(currentPredio[i]);
          break;
        case "BODEGAS":
          dataBodegas.push(currentPorcentaje[i]);
          dataBodegasPredios.push(currentPredio[i]);
          break;
        case "UNIVERSIDADES Y COLEGIOS":
          dataUniversidades.push(currentPorcentaje[i]);
          dataUniversidadesPredios.push(currentPredio[i]);
          break;
        case "LOTES":
          dataLotes.push(currentPorcentaje[i]);
          dataLotesPredios.push(currentPredio[i]);
          break;
        case "OTROS":
          dataOtros.push(currentPorcentaje[i]);
          dataOtrosPredios.push(currentPredio[i]);
          break;
        case "CLINICAS, HOSPITALES, CENTROS MEDICOS":
          dataClinicas.push(currentPorcentaje[i]);
          dataClinicasPredios.push(currentPredio[i]);
          break;
        case "HOTELES":
          dataHoteles.push(currentPorcentaje[i]);
          dataHotelesPredios.push(currentPredio[i]);
          break;
        case "INDUSTRIA":
          dataIndustria.push(currentPorcentaje[i]);
          dataIndustriaPredios.push(currentPredio[i]);
          break;
        default:
          break;
      }
    }

    var traces = [{
        x: listofYears,
        y: dataBodegasPredios,
        // fill: 'tozeroy',
        name: 'Bodegas',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorBodega,
          // width: 1,
          size: dataBodegas
        },
      },
      {
        x: listofYears,
        y: dataClinicasPredios,
        // fill: 'tonexty',
        name: 'Clinicas',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorClinica,
          // width: 1,
          size: dataClinicas
        },
      },
      {
        x: listofYears,
        y: dataComercioPredios,
        // fill: 'tonexty',
        name: 'Comercio',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorComercio,
          // width: 1,
          size: dataComercio
        },
      },
      {
        x: listofYears,
        y: dataHotelesPredios,
        // fill: 'tonexty',
        name: 'Hoteles',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorHotel,
          // width: 1,
          size: dataHoteles
        },
      },
      {
        x: listofYears,
        y: dataIndustriaPredios,
        // fill: 'tonexty',
        name: 'Industria',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorIndustria,
          // width: 1,
          size: dataIndustria
        },
      },
      {
        x: listofYears,
        y: dataLotesPredios,
        // fill: 'tonexty',
        name: 'Lotes',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorLote,
          siz: dataLotes,
          // width: 1
        },
      },
      {
        x: listofYears,
        y: dataOficinasPredios,
        // fill: 'tonexty',
        name: 'Oficinas',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorOficina,
          // width: 1,
          size: dataOficinas
        },
      },
      {
        x: listofYears,
        y: dataOtrosPredios,
        // fill: 'tonexty',
        name: 'Otros',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorOtro,
          // width: 1,
          size: dataOtros
        },
      },
      {
        x: listofYears,
        y: dataUniversidadesPredios,
        // fill: 'tonexty',
        name: 'Universidades',
        type: "scatter",
        mode: "markers",
        marker: {
          color: colorUniversidad,
          // width: 1,
          size: dataUniversidades
        },
      }
    ];

    var layout2 = {
      autosize: true,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      // barmode: 'stack',
      margin: {
        l: 100,
        t: 0,
        // b: 50,
        pad: 0
      },
      font: {
        color: '#fff',
        family: "'open_sans', 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
      },
      showlegend: false,
      width: window.innerWidth,
      height: window.innerHeight /2.5,
    };

    Plotly.newPlot('plotdiv2', traces, layout2);

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