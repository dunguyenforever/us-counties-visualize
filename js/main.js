/**
 * Load TopoJSON data of the world and the data of the world wonders
 */

let currentMeasure1 = "median_household_income";
let currentMeasure2 = "number_of_primary_care_physicians";
const numerator =
  window.screen.width > 1680 ? (window.screen.width > 1919 ? 2 : 2.3) : 2;
const containerWidth = Math.min(window.screen.width / numerator, 10000);
const containerHeight = Math.min(window.screen.height / numerator , 800);
const remainingHeight = window.screen.height - containerHeight - 300;
console.log(containerWidth, containerHeight);
Promise.all([
  d3.json("data/counties-10m.json"),
  d3.csv("data/national_health_data_2024_incomebin.csv"),
])
  .then((data) => {
    
    const geoData = data[0];
    const countyData = data[1];

    // Combine both datasets by adding properties to the TopoJSON counties.
    geoData.objects.counties.geometries.forEach((d) => {
      for (let i = 0; i < countyData.length; i++) {
        if (d.id === countyData[i].cnty_fips) {
          d.properties.median_household_income =
            +countyData[i].median_household_income;
          d.properties.number_of_hospitals = +countyData[i].number_of_hospitals;
          d.properties.number_of_primary_care_physicians =
            +countyData[i].number_of_primary_care_physicians;
          d.properties.percent_no_heath_insurance =
            +countyData[i].percent_no_heath_insurance;
        }
      }
    });

    // Create a global first map in .viz1
    window.map1 = new ChoroplethMap(
      {
        parentElement: ".viz1",
        containerWidth: containerWidth,
        containerHeight: containerHeight,
      },
      geoData
    );

    // Create a global second map in .viz2
    window.map2 = new ChoroplethMap(
      {
        parentElement: ".viz2",
        containerWidth: containerWidth,
        containerHeight: containerHeight,
      },
      geoData
    );
        //  Create a global scatterplot instance
     window.scatterplot = new Scatterplot(
      {
        parentElement: "#scatterplot",
        containerWidth: containerWidth,
        containerHeight: remainingHeight,
      },
      geoData 
    );
    scatterplot.updateVis(currentMeasure1, currentMeasure2);

    //Create a global bar chart instance
    window.barChart = new BarChart({
      parentElement: "#bar-chart",
      containerWidth: containerWidth,
      containerHeight: remainingHeight,
    });
    
    // get the value through the user's choice for map 1
    const button1 = document.getElementById("updateButton1");
    button1.addEventListener("click", () => {
      const measure1 = document.getElementById("measurement1").value;
      currentMeasure1 = measure1;
      map1.updateVis(measure1);
      scatterplot.updateVis(currentMeasure1, currentMeasure2);
      updateBarchart(geoData, currentMeasure1, window.barChart);
      window.barChart.updateTitle(currentMeasure1);
    });

    // get the value through the user's choice for map 2
    const button2 = document.getElementById("updateButton2");
    button2.addEventListener("click", () => {
      
      const measure2 = document.getElementById("measurement2").value;
      currentMeasure2 = measure2;
      map2.updateVis(measure2);
      scatterplot.updateVis(currentMeasure1, currentMeasure2);
    });
  })
  .catch((error) => console.error(error));

  

 

