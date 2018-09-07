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

  // Default Country Data
  setBubblePlot('2018');

  function setBubblePlot(chosenYear) {
    getYearsData(chosenYear);

    var data2 = [],
      dataBodegas = [],
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

      var colorMarker;
      switch (currentUso[i]) {
        case "RESIDENCIAL":
          colorMarker = colorResidencial;
          dataResidencial.push(currentPorcentaje[i]);
          break;
        case "OFICINAS":
          colorMarker = colorOficina;
          dataOficinas.push(currentPorcentaje[i]);
          break;
        case "COMERCIO":
          colorMarker = colorComercio;
          dataComercio.push(currentPorcentaje[i]);
          break;
        case "BODEGAS":
          colorMarker = colorBodega;
          dataBodegas.push(currentPorcentaje[i]);
          break;
        case "UNIVERSIDADES Y COLEGIOS":
          colorMarker = colorUniversidad;
          dataUniversidades.push(currentPorcentaje[i]);
          break;
        case "LOTES":
          colorMarker = colorOtro;
          dataLotes.push(currentPorcentaje[i]);
          break;
        case "OTROS":
          colorMarker = colorOtro;
          dataOtros.push(currentPorcentaje[i]);
          break;
        case "CLINICAS, HOSPITALES, CENTROS MEDICOS":
          colorMarker = colorClinica;
          dataClinicas.push(currentPorcentaje[i]);
          break;
        case "HOTELES":
          colorMarker = colorHotel;
          dataHoteles.push(currentPorcentaje[i]);
          break;
        case "INDUSTRIA":
          colorMarker = colorIndustria;
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
      },
      {
        x: listofLocalidades,
        y: dataClinicas,
        fill: 'tonexty',
        name: 'Clinicas',
      },
      {
        x: listofLocalidades,
        y: dataComercio,
        fill: 'tonexty',
        name: 'Comercio',
      },
      {
        x: listofLocalidades,
        y: dataHoteles,
        fill: 'tonexty',
        name: 'Hoteles',
      },
      {
        x: listofLocalidades,
        y: dataIndustria,
        fill: 'tonexty',
        name: 'Industria',
      },
      {
        x: listofLocalidades,
        y: dataLotes,
        fill: 'tonexty',
        name: 'Lotes',
      },
      {
        x: listofLocalidades,
        y: dataOficinas,
        fill: 'tonexty',
        name: 'Oficinas',
      },
      {
        x: listofLocalidades,
        y: dataOtros,
        fill: 'tonexty',
        name: 'Otros',
      },
      {
        x: listofLocalidades,
        y: dataResidencial,
        fill: 'tonexty',
        name: 'Residencial',
      },
      {
        x: listofLocalidades,
        y: dataUniversidades,
        fill: 'tonexty',
        name: 'Universidades',
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
      height: window.innerHeight * 0.8,
    };

    // stackedArea(traces);
    Plotly.newPlot('plotdiv2', traces, layout2);

  }

  var yearSelector = document.querySelector('#yearSelector');

  function assignOptions(textArray, selector) {
    for (var i = 0; i < textArray.length; i++) {
      var currentOption = document.createElement('option');
      currentOption.text = textArray[i];
      selector.appendChild(currentOption);
    }
  }

  assignOptions(listofYears, yearSelector);

  function updateYear() {
    setBubblePlot(yearSelector.value);
  }

  yearSelector.addEventListener('change', updateYear, false);
});