# How Median Household Income Affect Healthcare Access Across the United States Map
## Data 
The goal of this project is to create an interact web application to help visualize the correlation between the median household income in the United States versus healthcare access (number of hospitals, number of primary care physicians, and percent without health insurance) accross the United States counties [CDC Heart Disease and Stroke Atlas](https://www.cdc.gov/heart-disease-stroke-atlas/about/?CDC_AAref_Val=https://www.cdc.gov/dhdsp/maps/atlas/index.htm)

Data Attributes: 
FIPS: Unique county identifier.
Median Household Income: Estimated county-level median income.
Number of Hospitals: Count of hospitals within each county.
Number of Primary Care Physicians: Count of PCPs within each county.
Percent Without Health Insurance: Estimate of the county population lacking health insurance.
These attributes let us see how economic indicators (e.g., income), healthcare infrastructure (e.g., hospitals and physicians), and insurance coverage might intersect.

## Prototypes
Before coding, I created several sketches and using exploratory data anylysis method in Python on the dataset to decide on what kind of chart would best display the data. Several insights have been gained from the static plot from Python, including various statistical numbers.

## Visualization 
### Choropleth Maps
Two choropleth maps are displayed side-by-side:

Map 1 defaults to Median Household Income. Map 2 defaults to Median Household Income. Both of them are greyed out when the user first load the website to indicate that no data has been updated.
Each map has:
A color scale that encodes the selected attribute ().
A legend showing the numeric ranges and corresponding colors.
A tooltip that appears when the user hovers over a county, giving specific data values; also, when hovering over th
Users can change each map’s displayed attribute from a dropdown menu and click an “Update” button to refresh. The map title and legend update accordingly.

### Scatterplot 
Below the maps is a scatterplot comparing any two selected attributes.
The X-axis corresponds to the attribute on Map 1 (e.g., Median Income).
The Y-axis corresponds to the attribute on Map 2 (e.g., Number of Physicians).
Each county is plotted as a circle. Hovering over a circle shows a tooltip with the county name and the two values.
Circles are colored by the 

### Histogram
A histogram is also provided to display the distribution of the Map 1 attribute (e.g., median household income, number of hospitals, etc.). When you press “Update Map 1”, the histogram will automatically refresh to show the distribution for the newly selected measurement. This gives users a quick glimpse into how values of that attribute are spread across all counties, whether most counties cluster around a particular range or if the data is broadly distributed.
X-axis: Ranges of the chosen measurement (e.g., income brackets or number of hospitals in increments).
Y-axis: The count (number of counties) that fall into each bin for the chosen range.

## Findings
Income vs Number of Hospitals: There seem to be a positive correlation between the number 
## Program Structure
## Challenges and Future Works
### Challenges
### Future Works
## AI Usage and Collaborations
## Demo 
