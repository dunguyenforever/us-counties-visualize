class ChoroplethMap {
  /**
   * Class constructor with basic configuration
   * @param {Object}
   * @param {Array}
   * @param {string}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth,
      containerHeight: _config.containerHeight,
      margin: _config.margin || { top: 10, right: 10, bottom: 10, left: 10 },
      tooltipPadding: 10,
    };
    this.data = _data;

    this.us = _data;

    this.active = d3.select(null);

    this.initVis();
  }

  /**
   * We initialize scales/axes and append static elements, such as axis titles.
   */
  initVis() {
    let vis = this;
    console.log();

    // Calculate inner chart size. Margin specifies the space around the actual chart.
    vis.width =
      vis.config.containerWidth;
    vis.height = vis.config.containerHeight;

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("class", "center-container")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    const defs = vis.svg.append("defs");
    defs
      .append("pattern")
      .attr("id", "crossHatch")
      .attr("patternUnits", "userSpaceOnUse")
      .attr("width", 6)
      .attr("height", 6)
      .append("path")
      .attr("d", "M0,0 l6,6 M6,0 l-6,6")
      .attr("stroke", "#555")
      .attr("stroke-width", 1);

    vis.projection = d3
      .geoAlbersUsa()
      .translate([vis.width / 2, vis.height / 2])
      .scale(vis.width);

    // Define color scale
    const measureDomain = d3.extent(
      vis.data.objects.counties.geometries,
      (d) => d.properties.median_household_income
    );

    vis.colorScale = d3
      .scaleSequential()
      .domain(measureDomain)
      .interpolator(d3.interpolateGreys);

    // Drawing the legend of the map
    this.legendGroup = vis.svg
      .append("g")
      .attr("class", "legend-group")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.height - 30})`
      );

    const legendWidth = 200;
    const legendHeight = 12;

    const [minVal, maxVal] = vis.colorScale.domain();
    const stops = d3.ticks(minVal, maxVal, 5);

    const stepSize = legendWidth / stops.length;

    this.legendGroup
      .selectAll("rect")
      .data(stops)
      .join("rect")
      .attr("x", (d, i) => i * stepSize)
      .attr("y", 0)
      .attr("width", stepSize)
      .attr("height", legendHeight)
      .attr("fill", (d) => vis.colorScale(d));

    vis.path = d3.geoPath().projection(vis.projection);

    vis.g = vis.svg
      .append("g")
      .attr("class", "center-container center-items us-state")
      .attr(
        "transform",
        "translate(" +
          vis.config.margin.left / 2+
          "," +
          vis.config.margin.top /2+
          ")"
      )
      .attr(
        "width",
        vis.width 
      )
      .attr(
        "height",
        vis.height 
      );

    vis.counties = vis.g
      .append("g")
      .attr("id", "counties")
      .selectAll("path")
      .data(topojson.feature(vis.us, vis.us.objects.counties).features)
      .enter()
      .append("path")
      .attr("class", "county")
      .attr("d", vis.path)
      .attr("fill", (d) => {
        if (d.properties.median_household_income) {
          return vis.colorScale(d.properties.median_household_income);
        } else {
          return "url(#crossHatch)";
        }
      });
    vis.counties
      .on("mousemove", (event, d) => {
        const tooltipValue = d.properties.median_household_income
          ? `Median Household Income: <strong>$${d.properties.median_household_income}</strong>`
          : "No data available";
        d3.select("#tooltip")
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
                        <div class="tooltip-title">${d.properties.name}</div>
                        <div>${tooltipValue}</div>
                      `);
        d3.selectAll("path.county")
        .transition()
        .duration(200)
        .attr("opacity", (e) => (e.id === d.id ? 1 : 0.3));    
      })
      .on("mouseout", () => {
        d3.select("#tooltip").style("display", "none");
        d3.selectAll("path.county")
      .transition()
      .duration(200)
      .attr("opacity", 1);
      })

    ;
    vis.g
      .append("path")
      .datum(
        topojson.mesh(vis.us, vis.us.objects.states, function (a, b) {
          return a !== b;
        })
      )
      .attr("id", "state-borders")
      .attr("d", vis.path);

    // Add a title text element
    vis.title = vis.svg
    .append("text")
    .attr("class", "map-title")
    .attr("x", vis.config.containerWidth / 4)
    .attr("y", 30)
    .attr("font-size", 15)
    .attr("font-weight", "bold")
    .text("")
    .style("opacity", 0);
  }

  updateVis(newMeasure) {
    let vis = this;

    const measureDomain = d3.extent(
      vis.data.objects.counties.geometries,
      (d) => d.properties[newMeasure]
    );

    let colorScale;
    switch (newMeasure) {
      case "median_household_income":
        colorScale = d3
          .scaleSequential()
          .domain(measureDomain)
          .interpolator(d3.interpolateGreens);
        break;

      case "number_of_hospitals":
        colorScale = d3
          .scaleSequential()
          .domain(measureDomain)
          .interpolator(t => d3.interpolatePurples(0.3 + 0.7 * t));
        break;

      case "number_of_primary_care_physicians":
        colorScale = d3
          .scaleSequential()
          .domain(measureDomain)
          .interpolator(t => d3.interpolateBlues(0.3 + 0.7 * t));
        break;

      case "percent_no_heath_insurance":
        colorScale = d3
          .scaleSequential()
          .domain(measureDomain)
          .interpolator(d3.interpolateOranges);
        break;

      default:
        // Fallback
        colorScale = d3
          .scaleSequential()
          .domain(measureDomain)
          .interpolator(d3.interpolateGreys);
    }

    vis.colorScale = colorScale;

    // Update the legend
    const legendWidth = 200; // Width and height of the legend in pixels
    const legendHeight = 12;

    const [minVal, maxVal] = vis.colorScale.domain(); 
    const stops = d3.ticks(minVal, maxVal, 5);

    const stepSize = legendWidth / stops.length; 

    this.legendGroup
      .selectAll("rect")
      .data(stops)
      .join("rect")
      .attr("x", (d, i) => i * stepSize)
      .attr("y", 0)
      .attr("width", stepSize)
      .attr("height", legendHeight)
      .attr("fill", (d) => vis.colorScale(d));

    const xScaleLegend = d3
      .scaleLinear() 
      .domain([minVal, maxVal])
      .range([0, legendWidth]);

    const xAxisLegend = d3
      .axisBottom(xScaleLegend)
      .ticks(5)
      .tickFormat(d3.format("~s"));

    let axisGroup = this.legendGroup.selectAll(".legend-axis").data([null]);
    axisGroup = axisGroup
      .enter()
      .append("g")
      .attr("class", "legend-axis")
      .merge(axisGroup);

    axisGroup
      .attr("transform", `translate(0, ${legendHeight})`)
      .call(xAxisLegend);

    let mapTitle = "";
  switch (newMeasure) {
    case "median_household_income":
      mapTitle = "Median Household Income by County in the US";
      break;
    case "number_of_hospitals":
      mapTitle = "Number of Hospitals by County in the US";
      break;
    case "number_of_primary_care_physicians":
      mapTitle = "Number of Primary Care Physicians by County in the US";
      break;
    case "percent_no_heath_insurance":
      mapTitle = "Percent Without Health Insurance by County in the US";
      break;
    default:
      mapTitle = "Map of the US Counties";
  }

  // Update the title text
  vis.title
    .text(mapTitle)
    .style("opacity", 0)
    .transition()
    .duration(750)   
    .style("opacity", 1);

    // Transition the county paths to reflect the new measure
    vis.counties
      .transition()
      .duration(750)
      .attr("fill", (d) => {
        return d.properties[newMeasure]
          ? vis.colorScale(d.properties[newMeasure])
          : "url(#crossHatch)";
      });

    vis.counties
      .on("mousemove", (event, d) => {
        let tooltipValue = "No data available";
        if (d.properties[newMeasure]) {
          if (newMeasure === "number_of_hospitals") {
            tooltipValue = `Number of Hospitals: <strong>${d.properties[newMeasure]}</strong>`;
          } else if (newMeasure === "number_of_primary_care_physicians") {
            tooltipValue = `Number of Primary Care Physicians: <strong>${d.properties[newMeasure]}</strong>`;
          } else if (newMeasure === "percent_no_heath_insurance") {
            tooltipValue = `Percent No Health Insurance: <strong>${d.properties[newMeasure]}%</strong>`;
          } else if (newMeasure === "median_household_income") {
            tooltipValue = `Median Household Income: <strong>${d.properties[newMeasure]}</strong>`;
          } else {
            tooltipValue = `${newMeasure}: ${d.properties[newMeasure]}`;
          }
        }

        d3.select("#tooltip")
          .style("display", "block")
          .style("left", event.pageX + vis.config.tooltipPadding + "px")
          .style("top", event.pageY + vis.config.tooltipPadding + "px").html(`
              <div class="tooltip-title">${d.properties.name}</div>
              <div>${tooltipValue}</div>
            `);
        d3.selectAll("path.county")
        .transition()
        .duration(200)
        .attr("opacity", (e) => (e.id === d.id ? 1 : 0.3));
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      });
  }
}
