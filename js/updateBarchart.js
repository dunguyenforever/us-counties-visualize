// updateBarchart.js
function updateBarchart(geoData, measure, barChartInstance) {
    if (measure === "median_household_income") {
      // Extract incomes from geoData, ignoring null values
      const incomes = geoData.objects.counties.geometries
        .map(d => d.properties.median_household_income)
        .filter(d => d != null);
  
      // Define bins 
      const binWidth = 10000;
      const maxThreshold = 150000; 
      let binThresholds = [];
      for (let i = 0; i <= maxThreshold; i += binWidth) {
        binThresholds.push(i);
      }
      binThresholds.push(Infinity);
  
      // Create labels for each bin.
      const labels = binThresholds.slice(0, -1).map((d, i) => {
        if (i === binThresholds.length - 2) {
          return `>=${maxThreshold / 1000}`;
        } else {
          return `${d / 1000}-${binThresholds[i + 1] / 1000}`;
        }
      });
  
      // Calculate counts for each bin
      const histogramData = labels.map((label, i) => {
        const count = incomes.filter(v => v >= binThresholds[i] && v < binThresholds[i + 1]).length;
        return { label: label, count: count };
      });
  
      // Update the bar chart with the histogram data
      barChartInstance.updateBarchart(histogramData, "#98df8a");
      barChartInstance.updateAxisLabels("US Dollar (10,000)","Number of Counties");
      barChartInstance.updateTitle(measure);
  
    } else if (measure === "percent_no_heath_insurance") {
      const values = geoData.objects.counties.geometries
        .map(d => d.properties.percent_no_heath_insurance)
        .filter(d => d != null);
  
      const binThresholds = [0, 5, 10, 15, 20, 25, 30, 35, Infinity];
      const labels = binThresholds.slice(0, -1).map((d, i) => {
        if (i === binThresholds.length - 2) {
          return `>=${binThresholds[i]}`;
        } else {
          return `${d}-${binThresholds[i + 1]}`;
        }
      });
  
      const histogramData = labels.map((label, i) => {
        const count = values.filter(v => v >= binThresholds[i] && v < binThresholds[i + 1]).length;
        return { label: label, count: count };
      });
  
      barChartInstance.updateBarchart(histogramData, "#ffbb78");
      barChartInstance.updateAxisLabels("Percent without Health Insurance (%)", "Number of Counties",);
      barChartInstance.updateTitle(measure);
  
    } else if (measure === "number_of_hospitals") {
      const values = geoData.objects.counties.geometries
        .map(d => d.properties[measure]);
  
      const missingCount = values.filter(v => v == null).length;
      const nonMissingValues = values.filter(v => v != null);
      const binThresholds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Infinity];
      const labels = binThresholds.slice(0, -1).map((d, i) => {
        if (i === binThresholds.length - 2) {
          return `>=${binThresholds[i]}`;
        } else {
          return `${d}-${binThresholds[i + 1]}`;
        }
      });
  
      const histogramData = labels.map((label, i) => {
        const count = nonMissingValues.filter(v => v >= binThresholds[i] && v < binThresholds[i + 1]).length;
        return { label: label, count: count };
      });
      histogramData.push({ label: "No Data", count: missingCount });
      barChartInstance.updateBarchart(histogramData, "#c5b0d5");
      barChartInstance.updateAxisLabels("Number of Hospitals","Number of Counties",);
      barChartInstance.updateTitle(measure);

    } else if (measure === "number_of_primary_care_physicians") {
        const values = geoData.objects.counties.geometries
          .map(d => d.properties[measure]);
        const missingCount = values.filter(v => v == null).length;
        const nonMissingValues = values.filter(v => v != null);
        const binThresholds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, Infinity];
        const labels = binThresholds.slice(0, -1).map((d, i) => {
          if (i === binThresholds.length - 2) {
            return `>=${binThresholds[i]}`;
          } else {
            return `${d}-${binThresholds[i + 1]}`;
          }
        });
  
        const histogramData = labels.map((label, i) => {
          const count = nonMissingValues.filter(v => v >= binThresholds[i] && v < binThresholds[i + 1]).length;
          return { label: label, count: count };
        });
        histogramData.push({ label: "No Data", count: missingCount });
    
        barChartInstance.updateBarchart(histogramData,"#aec7e8");
        barChartInstance.updateAxisLabels("Number of Primary Care Physicians","Number of Counties");
        barChartInstance.updateTitle(measure);
    
      }
    else {
      barChartInstance.clear();
    }
  }
  