d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  function(data) {
    // margin and boundaries of svg
    var margin = { top: 20, left: 95, bottom: 100, right: 20 };
    var w = 1200;
    var h = 550;
    var actualWidth = w - margin.right - margin.left;
    var actualHeight = h - margin.bottom - margin.top;

    // dataset to plot
    var dataset = data.monthlyVariance;
    var colors = [
      "#d73027",
      "#fc8d59",
      "#fee090",
      "#ffffbf",
      "#e0f3f8",
      "#91bfdb",
      "#4575b4"
    ];

    var monthCount = {};

    var months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    months.forEach(val => (monthCount[val] = 0));
    dataset.forEach(
      val =>
        (monthCount[months[val.month - 1]] =
          monthCount[months[val.month - 1]] + 1)
    );

    // tooltip code
    var tip = d3
      .tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return (
          "<strong>" +
          d.year +
          " - " +
          months[d.month - 1] +
          "</strong><br>" +
          "<span>" +
          Math.round(
            (parseFloat(data.baseTemperature) + parseFloat(d.variance)) * 1000
          ) /
            1000 +
          " ℃</span><br><span class='variance'> " +
          d.variance +
          " ℃</span>"
        );
      });

    // inserting svg into the html
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // calling tooltip
    svg.call(tip);

    // Scale for X-Axis
    var xScale = d3.scale
      .linear()
      .domain([1753, 2015])
      .range([margin.left, w - w / dataset.length - margin.right]);

    // Scale for Y-Axis
    var yScale = d3.scale
      .ordinal()
      .domain(months)
      .rangePoints([margin.top, h - h / 12 - margin.bottom]);

    // Drawing the heat map
    svg
      .selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d) {
        return xScale(d.year);
      })
      .attr("y", function(d) {
        return yScale(months[parseInt(d.month) - 1]);
      })
      .attr("width", function(d) {
        return w / monthCount[months[d.month - 1]];
      })
      .attr("height", (h - margin.bottom - margin.top) / 12)
      .attr("fill", function(d) {
        var temp = parseFloat(data.baseTemperature) + parseFloat(d.variance);

        if (temp <= 2.7) return colors[6];
        else if (temp <= 4.2) return colors[5];
        else if (temp <= 5.7) return colors[4];
        else if (temp <= 7.2) return colors[3];
        else if (temp <= 8.7) return colors[2];
        else if (temp <= 10.2) return colors[1];
        else return colors[0];
      })
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);

    // drawing the X-Axis
    var xAxis = d3.svg
      .axis()
      .scale(xScale)
      .ticks(25)
      .tickFormat(d3.format("d"))
      .orient("bottom");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + 0 + "," + (h - margin.bottom - 8) + ")")
      .call(xAxis);

    // drawing Labels as Y-Axis
    svg
      .selectAll(".monthLabel")
      .data(months)
      .enter()
      .append("text")
      .attr("class", "monthLabel")
      .text(function(d) {
        return d;
      })
      .attr("x", margin.left - 60)
      .attr("y", function(d, i) {
        return (i + 1) * (h - margin.bottom - margin.top) / 12;
      })
      .attr("width", margin.left);

    // drawing scale for the heat map
    svg
      .selectAll(".scale")
      .data(colors)
      .enter()
      .append("rect")
      .attr("x", function(c, i) {
        return w - 100 - i * 50;
      })
      .attr("y", h - 50)
      .attr("class", "scale")
      .attr("width", 50)
      .attr("height", 20)
      .attr("fill", function(c) {
        return c;
      });

    // color ranges for heat map
    var colorRange = [10.2, 8.7, 7.2, 5.7, 4.2, 2.7, 0];
    svg
      .selectAll(".scaleLabel")
      .data(colorRange)
      .enter()
      .append("text")
      .attr("x", function(r, i) {
        return w - 100 - i * 50 + 15;
      })
      .attr("y", h - 10)
      .text(function(r) {
        return r;
      });

    // Axis Labels
    svg
      .append("text")
      .attr("x", w - w / 2 - 50)
      .attr("y", h - 50)
      .attr("class", "xLabel")
      .text("Years");

    svg
      .append("text")
      .attr("class", "yLabel")
      .attr("transform", "translate(15, " + (h / 2 - 50) + ")rotate(-90)")
      .text("Months");
  }
);