# How Median Household Income Affects Healthcare Access Across the United States Map
## 1. Motivations and Data 
The goal of this project is to create an interactive web application to help visualize the correlation between the median household income in the United States versus healthcare access (number of hospitals, number of primary care physicians, and percent without health insurance) accross the United States counties [CDC Heart Disease and Stroke Atlas](https://www.cdc.gov/heart-disease-stroke-atlas/about/?CDC_AAref_Val=https://www.cdc.gov/dhdsp/maps/atlas/index.htm) We selected these particular measures (e.g., number of hospitals, number of primary care physicians) because research has shown that access to primary care improves health outcomes [1](https://pmc.ncbi.nlm.nih.gov/articles/PMC2690145/#:~:text=The%20supply%20of%20general%20practitioners,Starfield%2C%20and%20Shi%202005), shifting care from EDs to primary care can reduce strain and costs [2](https://www.sciencedirect.com/science/article/pii/S0167629618311342#:~:text=Shifting%20care%20from%20EDs%20to,et%20al.%2C%202016), and expanding primary care remains key to improving the overall health of communities [3](https://www.forbes.com/sites/forbesbooksauthors/2024/02/23/primary-care-why-its-important-and-how-to-increase-access-to-it/).

Data Attributes: 
FIPS: Unique county identifier.
Median Household Income: Estimated county-level median income.
Number of Hospitals: Count the hospitals within each county.
Number of Primary Care Physicians: Count of PCPs within each county.
Percent Without Health Insurance: Estimate of the county population lacking health insurance.
These attributes let us see how economic indicators (e.g., income), healthcare infrastructure (e.g., hospitals and physicians), and insurance coverage might intersect.

To categorize Median Household Income values, we used binning guidelines inspired by the [U.S.Census Bureau](https://www.census.gov/library/visualizations/interactive/median-household-income.html). These attributes let us see how economic indicators (e.g., income), healthcare infrastructure (e.g., hospitals and physicians), and insurance coverage might intersect.
## 2. Prototypes
Before coding, I created several sketches and used an exploratory data analysis method in Python on the dataset to decide on what kind of chart would best display the data. Several insights have been gained from the static plot from Python, including various statistical numbers.
![image](https://github.com/user-attachments/assets/c37be852-c05c-48c7-bc73-f7cce204e234)
![image](https://github.com/user-attachments/assets/c1ae3fb3-dd4a-41ed-96bc-2632eaa08d1a)
![image](https://github.com/user-attachments/assets/4a8af5e5-d038-45fe-a4ac-6046fb95b3c6)

## 3. Visualization 
### 3.1 Choropleth Maps
The design of the color scales and map layout was also guided by best practices from [Map Blog Post: Critiquing a Map of Income](https://storymaps.arcgis.com/stories/4398a1309b6a421f9374b84aee2b1dc9)
Two choropleth maps are displayed side-by-side:
Map 1 defaults to Median Household Income. Map 2 defaults to Median Household Income. Both of them are greyed out when the user first loads the website to indicate that no data has been updated.
Each map has:
A color scale that encodes the selected attribute ().
A legend showing the numeric ranges and corresponding colors.
A tooltip that appears when the user hovers over a county, giving specific data values; also, when hovering over th
Users can change each map’s displayed attribute from a dropdown menu and click an “Update” button to refresh. The map title and legend updated accordingly.

### 3.2 Scatterplot 
Below the maps is a scatterplot comparing any two selected attributes.
The X-axis corresponds to the attribute on Map 1 (e.g., Median Income).
The Y-axis corresponds to the attribute on Map 2 (e.g., Number of Physicians).
Each county is plotted as a circle. Hovering over a circle shows a tooltip with the county name and the two values.
Circles are colored by the 

### 3.3 Histogram
A histogram is also provided to display the distribution of the Map 1 attribute (e.g., median household income, number of hospitals, etc.). When you press “Update Map 1”, the histogram will automatically refresh to show the distribution for the newly selected measurement. This gives users a quick glimpse into how values of that attribute are spread across all counties, whether most counties cluster around a particular range or if the data is broadly distributed.
X-axis: Ranges of the chosen measurement (e.g., income brackets or number of hospitals in increments).
Y-axis: The count (number of counties) that fall into each bin for the chosen range.

## 4. Findings
Income vs Number of Hospitals: There seems to be a positive correlation between the number of median household income and the number of hospitals. However, it can be seen that roughly every county in the United States only has around 1 - 2 hospitals, except for the coast of California, which has the highest concentration of number of hospitals. Also, the number of hospitals is missing for a lot of counties so a conclusive statement cannot be reached.
Median Household Income vs Number of Primary Care Physicians: There seems to be a higher concentration of primary care physicians in the several counties of the Midwest state and the Southern States compared to the 2 coasts which have a lower number of primary care physicians by county.
Median Household Income vs Percent Without Health Insurance: Countries with lower median household income have a higher percentage without health insurance in the United States. With states such as Montana, Idaho, Wyoming, South Dakota, Missouri, Oklahoma, Texas, and, Florida. Texas is the state with the highest percentage without health insurance followed by Florida. Texas and Florida seem to be the outliers since although overall their counties have a high median household income compared to others in the, they are also the states with the highest and second highest percent without health insurance respectively.

## 6. Program Structure
![image](https://github.com/user-attachments/assets/71846e20-2466-4aaa-bb55-566bceda7342)
### 6.1 Libraries and Tools
D3 (v7) for data binding, scales, color interpolation, and map/scatterplot rendering.
TopoJSON to load and handle county boundary shapes.
HTML/CSS/JS for overall structure and styling.
Hosting: The site is deployed publicly using Vercel [Median Household Income versus Healthcare Access the United States by Counties](https://us-counties-visualize.vercel.app/)
### 6.2 Code Organization
index.html: Basic structure, including placeholders for two maps, the scatterplot, and dropdown menus.
main.js: Loads the data (TopoJSON for boundaries, CSV for county-level attributes), merges them, and creates the ChoroplethMap and Scatterplot instances.
choroplethMap.js: ChoroplethMap class that:
Scales and projects county polygons,
Binds data attributes to colors,
Creates a legend and tooltip interactivity.
scatterplot.js: Scatterplot class that:
Creates scales and axes for two numeric attributes,
Plots counties as circles,
Shows tooltips on hover and updates based on user selections.
barchart.js: Barchart class creates the scales based on the measurement chosen by Map 1. 
Plot the count and the distribution of various quantitative data.
## 7. Challenges and Future Works
### 7.1 Challenges
- I had a lot trouble how to link several maps together and also being able to display the data through implementing two maps and by choosing a quantitative data.
- I had trouble with adding onclick event to interact with the counties and also trying to highlight correlation between two maps.
- Color Scales: Picking appropriate sequential color scales that avoid confusion and remain accessible.
### 7.2 Future Works
Brushing & Linking: Implement brushing on the scatterplot or the maps so that selecting a set of counties highlights them in all views.
Showing the name of the states on the map. 
Filter the counties based on the bucket of the bar chart.
## AI Usage and Collaborations
## Demo 
## References
<a id="ref1">1</a>. Freed, G. L., Nahra, T. A., & Wheeler, J. R. (2009). The supply of general practitioners and primary care physicians: A key determinant of population health. [Available at PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC2690145/#:~:text=The%20supply%20of%20general%20practitioners,Starfield%2C%20and%20Shi%202005).
<a id="ref2">2</a>. Uranowitz, G. (2018). Shifting care from EDs to primary care to reduce cost and improve outcomes. [ScienceDirect Link](https://www.sciencedirect.com/science/article/pii/S0167629618311342#:~:text=Shifting%20care%20from%20EDs%20to,et%20al.%2C%202016).
<a id="ref3">3</a>. Forbes (2024). Primary Care: Why It’s Important and How To Increase Access to It. [Forbes Article](https://www.forbes.com/sites/forbesbooksauthors/2024/02/23/primary-care-why-its-important-and-how-to-increase-access-to-it/).
<a id="ref4">4</a>. Median Household Income Binning Guide. [US Census Bureau](https://www.census.gov/library/visualizations/interactive/median-household-income.html).
<a id="ref5">5</a>. Melissa, T (2024) Map Blog Post: Critiquing a Map of Income. [StoryMap Arcgis](https://storymaps.arcgis.com/stories/4398a1309b6a421f9374b84aee2b1dc9)
