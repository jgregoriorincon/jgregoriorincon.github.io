var sizeWindowWidth;

var colorBodega = '#ffdbe3';
var colorClinica = '#00c5ff';
var colorComercio = '#ff0000';
var colorHotel = '#cd6699';
var colorIndustria = '#ffa77f';
var colorOficina = '#a83800';
var colorOtro = '#b2b2b2';
var colorResidencial = '#ffffbe';
var colorUniversidad = '#0070ff';

function bubbleSortDescending(a, b) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i] > a[i + 1]) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;

                var temp = b[i];
                b[i] = b[i + 1];
                b[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

function bubbleSortAscending(a, b) {
    var swapped;
    do {
        swapped = false;
        for (var i = 0; i < a.length - 1; i++) {
            if (a[i] < a[i + 1]) {
                var temp = a[i];
                a[i] = a[i + 1];
                a[i + 1] = temp;

                var temp = b[i];
                b[i] = b[i + 1];
                b[i + 1] = temp;
                swapped = true;
            }
        }
    } while (swapped);
}

function colorGradient(fade, color1, color2) {
    var diffRed = color2.red - color1.red;
    var diffGreen = color2.green - color1.green;
    var diffBlue = color2.blue - color1.blue;

    var gradient = {
        red: parseInt(Math.floor(color1.red + (diffRed * fade)), 10),
        green: parseInt(Math.floor(color1.green + (diffGreen * fade)), 10),
        blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)), 10),
    };

    return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
}

function unpack(rows, key) {
    return rows.map(function (row) {
        return row[key];
    });
}

function getMaxOfArray(numArray) {
    return Math.max.apply(null, numArray);
}

function rangeColors(numColors, primerColor, ultimoColor) {
    var colores = [];
    var rainbow = new Rainbow();
    rainbow.setNumberRange(1, numColors);
    rainbow.setSpectrum(primerColor, ultimoColor);
    for (var i = 1; i <= numColors; i++) {
        var hexColour = rainbow.colourAt(i);
        colores.push('#' + hexColour);
    }
    return colores;
}

function getSizeWindow() {
    sizeWindowWidth = window.innerWidth;
}

function json2table(json, classes) {
    var cols = Object.keys(json[0]);
    
    var headerRow = '';
    var bodyRows = '';
    
    classes = classes || '';
  
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  
    cols.map(function(col) {
      headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
    });
  
    json.map(function(row) {
      bodyRows += '<tr>';
  
      cols.map(function(colName) {
          if (colName == 'Uso Predominante') {
              bodyRows += '<td>' + row[colName] + '</td>';
          } else {
              bodyRows += '<td align="right">' + row[colName] + '</td>';
          }
      });
  
      bodyRows += '</tr>';
    });
  
    return '<table class="' +
           classes +
           '"><thead><tr>' +
           headerRow +
           '</tr></thead><tbody>' +
           bodyRows +
           '</tbody></table>';
  }
  
  