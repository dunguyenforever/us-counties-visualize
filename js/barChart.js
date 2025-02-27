class BarChart {
    constructor(_config) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 600,
        containerHeight: _config.containerHeight || 300,
        margin: _config.margin || { top: 40, right: 20, bottom: 40, left: 60 },
      };
      this.initVis();
    }
  
    initVis() {
      let vis = this;
      vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
      vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
  
      vis.svg = d3.select(vis.config.parentElement)
        .append("svg")
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight)
        .style("opacity", 0);

    vis.title = vis.svg.append("text")
        .attr("class", "chart-title")
        .attr("x", vis.config.containerWidth / 2)
        .attr("y", vis.config.margin.top / 2)
        .attr("text-anchor", "middle")
        .text(""); // Title will be updated based on id measurement1
  
      vis.chart = vis.svg.append("g")
        .attr("transform", `translate(${vis.config.margin.left},${vis.config.margin.top})`);
  
      vis.xScale = d3.scaleBand().range([0, vis.width]).padding(0.2);
      vis.yScale = d3.scaleLinear().range([vis.height, 0]);
  
      vis.xAxisGroup = vis.chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${vis.height})`);
  
      vis.yAxisGroup = vis.chart.append("g")
        .attr("class", "y-axis");
  
      // Add x-axis and y-axis labels
      vis.xAxisLabel = vis.svg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", vis.config.containerWidth / 2)
        .attr("y", vis.config.containerHeight - 5)
        .attr("text-anchor", "middle")
        .text(""); // will be update in updateVis
  
      vis.yAxisLabel = vis.svg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -vis.config.containerHeight / 2)
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text(""); // will be update in updateVis
    }
  
    updateBarchart(histogramData, fillColor="steelblue") {
      let vis = this;
      // Update scales with histogram data
      vis.xScale.domain(histogramData.map(d => d.label));
      vis.yScale.domain([0, d3.max(histogramData, d => d.count)]);
  
      // Bind data to bars
      const bars = vis.chart.selectAll(".bar").data(histogramData);
  
      // Enter + update bars
      bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .transition().duration(500)
        .attr("x", d => vis.xScale(d.label))
        .attr("y", d => vis.yScale(d.count))
        .attr("width", vis.xScale.bandwidth())
        .attr("height", d => vis.height - vis.yScale(d.count))
        .attr("fill", fillColor);
  
      bars.exit().remove();
  
      // Update axes
      vis.xAxisGroup.call(d3.axisBottom(vis.xScale));
      vis.yAxisGroup.call(d3.axisLeft(vis.yScale));

      vis.svg.transition()
        .duration(1000)
        .style("opacity", 1);
    }
  
    updateAxisLabels(xLabel, yLabel) {
      this.xAxisLabel.text(xLabel);
      this.yAxisLabel.text(yLabel);
    }


    updateTitle(measure1) {
        let titleText;
        if (measure1 === "median_household_income") {
          titleText = "Distribution of Median Household Income (US Dollars)";
        } else if (measure1 === "percent_no_heath_insurance") {
          titleText = "Distribution of Percent Without Health Insurance";
        } else if (measure1 === "number_of_hospitals") {
          titleText = "Distribution of Number of Hospitals";
        } else if (measure1 === "number_of_primary_care_physicians") {
          titleText = "Distribution of Number of Primary Care Physicians";
        } else {
          titleText = "";
        }
        this.title.text(titleText);
    }
  
    clear() {
      this.title.text("");
      this.chart.selectAll(".bar").remove();
      this.xAxisGroup.selectAll("*").remove();
      this.yAxisGroup.selectAll("*").remove();
    };
    
    
  }
  