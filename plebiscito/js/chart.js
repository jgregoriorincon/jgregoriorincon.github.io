
var barData = [.4978, .5021];

var digit = d3.format(".1%");
var digit0 = d3.format(".0%");

var gap = 5;

var left_padding = 30;
var w = 220,
    h = 75;

var x = d3.scale.linear()
    .domain([0, 1.1])
    .range([0, w]);
var y = d3.scale.ordinal()
    .domain(barData)
    .rangeBands([0, h]);

var chart = d3.select(".chart").append("svg")
    .attr("class", "chart")
    .attr("width", w + left_padding + 10)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(20,15)");

//the lines at 20,40,60
chart.selectAll("line")
    .data(x.ticks(15))
    .enter().append("line")
    .attr("x1", function (d) {
        return x(d) + left_padding;
    })
    .attr("x2", function (d) {
        return x(d) + left_padding;
    })
    .attr("y1", -3)
    .attr("y2", 120)
    .style("stroke", function (d, i) {
        return i == 0 ? "#000" : "#bbb";
    });

//the text at the top of the lines
chart.selectAll(".rule")
    .data(x.ticks(5))
    .enter().append("text")
    .attr("class", "rule")
    .attr("x", function (d) {
        return x(d) + left_padding;
    })
    .attr("y", 0)
    .attr("dy", -4)
    .attr("text-anchor", "middle")
    .attr("font-size", 10)
    .text(function (d) {
        return digit0(d)
    });

//the bars
chart.selectAll("rect")
    .data(barData)
    .enter().append("rect")
    .attr("x", function (d, i) {
        return left_padding;
    })
    .attr("y", function (d, i) {
        return i * 20;
    })
    .attr("width", x)
    .attr("height", 20)
    .attr("fill", function (d, i) {
        if (i == 1) return "#FF894C";
        //if (i == 2) return "#377EB8";
        else return "#00C285";
    });

//labels for the parties
chart.selectAll("text.name")
    .data(["Si", "No"])
    .enter().append("text")
    .attr("x", 0)
    .attr("y", function (d, i) {
        return i * 20 + 10;
    })
    .attr("dy", ".36em")
    .attr("text-anchor", "left")
    .attr('class', 'name')
    .attr("font-size", 12)
    .attr("font-family", "'Ubuntu',Tahoma,sans-serif")
    .text(String);

function redraw() {

    // Update…
    chart.selectAll("rect")
        .data(barData)
        .transition()
        .duration(100)
        .attr("y", function (d, i) {
            return i * 20;
        })
        .attr("width", x);

    chart.selectAll("text")
        .data(barData)
        .enter().append("text")
        .attr("stroke", "black")
        .attr("x", x)
        .attr("y", function (d) {
            return y(d) + y.rangeBand() / 2;
        })
        .attr("dx", -3) // padding-right
        .attr("dy", ".35em") // vertical-align: middle
        .attr("text-anchor", "end") // text-align: right
        .text(String);
}
