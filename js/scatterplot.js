class Scatterplot {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 600,
      containerHeight: _config.containerHeight || 300,
      margin: _config.margin || { top: 40, right: 40, bottom: 40, left: 60 },
    };
    this.data = _data; // The same data (topoJSON + properties) you pass in main.js
    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
    vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );


    vis.xScale = d3.scaleLinear().range([0, vis.width]);
    vis.yScale = d3.scaleLinear().range([vis.height, 0]);

    // X-axis title
    vis.xAxisLabel = vis.svg
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", vis.config.containerWidth / 2)
      .attr("y", vis.config.containerHeight - vis.config.margin.bottom / 4)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .text("X-Axis Title");

    // Y-axis title
    vis.yAxisLabel = vis.svg
      .append("text")
      .attr("class", "y-axis-label")
      .attr("transform", "rotate(-90)")
      .attr("x", -vis.config.containerHeight / 2)
      .attr("y", vis.config.margin.left / 4)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Y-Axis Title");

    vis.xAxis = vis.chart
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${vis.height})`);

    vis.yAxis = vis.chart.append("g").attr("class", "y-axis");

    // Title
    vis.title = vis.svg
      .append("text")
      .attr("x", vis.config.margin.left)
      .attr("y", vis.config.margin.top / 2)
      .style("font-size", "16px")
      .text("Scatterplot");
  }

  // Rerender the scatterplot with new data
  // scatterplot.updateVis(measure1, measure2)
  updateVis(measure1, measure2) {
    let vis = this;

    // Filter data and skip missing data
    const filteredData = vis.data.objects.counties.geometries.filter(
      (d) => d.properties[measure1] != null && d.properties[measure2] != null
    );

    // Update data domains
    vis.xScale.domain(d3.extent(filteredData, (d) => +d.properties[measure1]));
    vis.yScale.domain(d3.extent(filteredData, (d) => +d.properties[measure2]));

    vis.colorScale = d3.scaleQuantize()
  .domain(d3.extent(filteredData, d => +d.properties[measure1]))
  .range(scatterPlotColors);

    const circles = vis.chart
      .selectAll(".scatter-circle")
      .data(filteredData, (d) => d.id);

    // Enter selection
    const circlesEnter = circles
      .enter()
      .append("circle")
      .attr("class", "scatter-circle");

    circlesEnter
      .merge(circles)
      .attr("cx", (d) => vis.xScale(+d.properties[measure1]))
      .attr("cy", (d) => vis.yScale(+d.properties[measure2]))
      .attr("r", 3)
      .attr("fill", (d) => vis.colorScale(+d.properties[measure1]))
      .on("mouseover", function (event, d) {
        // Dim other circles and highlight hovered circle
        d3.selectAll(".scatter-circle").attr("opacity", 0.03);
        d3.select(this)
          .attr("opacity", 1)
          .attr("stroke", "black")
          .attr("stroke-width", 2);

        // Display tooltip 
        d3.select("#scatter-tooltip")
          .style("display", "block")
          .html(
            `
            <div><strong>${d.properties.name}</strong></div>
          <div>${formatMeasureName(measure1)}: ${d.properties[measure1]}</div>
          <div>${formatMeasureName(measure2)}: ${d.properties[measure2]}</div>
    `
          )
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      })
      .on("mousemove", function (event, d) {
        d3.select("#scatter-tooltip")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY + 10 + "px");
      })

      .on("mouseout", function (event, d) {
        // Reset opacity and stroke for all circles
        d3.selectAll(".scatter-circle")
          .attr("opacity", 1)
          .attr("stroke", "none");
        // Hide tooltip
        d3.select("#scatter-tooltip").style("display", "none");
      })
      .transition()
      .duration(500)
      .attr("cx", (d) => vis.xScale(+d.properties[measure1]))
      .attr("cy", (d) => vis.yScale(+d.properties[measure2]));

    circles.exit().remove();

    // Update axes
    vis.xAxis
      .transition()
      .duration(750)
      .call(d3.axisBottom(vis.xScale).ticks(5).tickFormat(d3.format("~s")));
    vis.yAxis
      .transition()
      .duration(750)
      .call(d3.axisLeft(vis.yScale).ticks(5).tickFormat(d3.format("~s")));

    // Update title using formatted names
    vis.title.text(
        `${formatMeasureName(measure2)} vs. ${formatMeasureName(measure1)}`
      );
  
      vis.xAxisLabel.text(`Map 1: ${formatMeasureName(measure1)}`);
      vis.yAxisLabel.text(`Map 2: ${formatMeasureName(measure2)}`);
  }
}
