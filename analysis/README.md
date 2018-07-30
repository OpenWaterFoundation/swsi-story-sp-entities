# analysis #

The `analysis` folder contains original data files and R scripts that process the files to create datasets that are used and 
visualized in the Water Entities story.

The folder contains the following data-processing files:

* [agricultural-analyses.R](#agricultural-analyses.R)
* [county-municipal-population-dola.R](#county-municipal-population-dola.R)

## agricultural-analyses.R ##
This R script processes agricultural datasets available from [Colorado's Decision Support Systems (CDSS)](http://cdss.state.co.us/GIS/Pages/GISDataHome.aspx). 
Note that data processing is currently minimal because the agricultural aspect of the Water Entities story may be enhanced in the future.  Data-processing 
steps are summarized below:

* Datasets from CDSS are read in to the script.  These include: [CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv), 
[CO-DWR-IrrigatedLands-Division01-2005-20180228.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/CO-DWR-IrrigatedLands-Division01-2005-20180228.csv), 
[CO-DWR-IrrigatedLands-Division01-2015-20180228.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/CO-DWR-IrrigatedLands-Division01-2015-20180228.csv), 
[Div1_Canals.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/Div1_Canals.csv) and 
[structures-southplatte.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/structures-southplatte.csv).  
Note that some of the datasets were [pre-processed](http://data.openwaterfoundation.org/co/cdss-data-spatial-bybasin/) 
by OWF.  Also note that not all of these datasets are currently in use in the Water Entities story.
* Statistics for irrigated lands are calculated for both 2005 and 2015.  The total number of acres that are flood irrigated versus sprinkler 
irrigated for each crop type are calculated.  This is used for the table in page 15 (Agricultural Water Use & Efficiency).
* The change from flood to sprinkler irrigation from 2005 to 2015 for individual parcels is calculated -- these calculations are still in progress.
* The total number of structures associated with each water source is calculated -- these calculations are currently not in use.
* The total number of acreage served from each water source is calculated -- these calculations are currently not in use.


## county-municipal-population-dola.R ##
This R script processes county and municipal historical and forecast population data, available from the Department of Local Affairs 
[State Demography Office](https://demography.dola.colorado.gov/data/).  Data-processing steps are summarized below:

* Population forecast (2000-2050) data are processed for each county (municipalities do not have forecast data).  Data are contained 
in [DOLA-county-population-forecast.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/DOLA-county-population-forecast.csv), 
which were downloaded from DOLA's website.
* Data are cleaned to remove any leading or trailing spaces and blank rows are removed.
* Dataset is output to CSV format and each year is its own column of data ([county-population-forecast-yearsinmultiplecolumns.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-population-forecast-yearsinmultiplecolumns.csv)).
* Dataset is reshaped so that all years of data are combined into a single "Year" column and then output to CSV format([county-population-forecast-yearsinsinglecolumn.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-population-forecast-yearsinsinglecolumn.csv)).
* Historical population (1980-2016) data are processed for both counties and municipalities.  Data were directly accessible from 
DOLA's website at https://demography.dola.colorado.gov/data/.  The direct download accesses the "County and Municipal Population 
Time Series 1980-2016" category and the county-muni-timeseries.csv file.
* County data are processed first.  Note that county data are currently not used for any visualizations, so data have not been output 
to CSV format.
* Municipal data are processed next.  Various steps clean up the data and correct misspellings of municipalities.  Some 
municipalities have data split into more than one record because the municipality is in more than one county and these needed to be 
summed together.
* Dataset is output to CSV format; years are in a single column of data ([municipal-population-historical-yearsinsinglecolumn.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/municipal-population-historical-yearsinsinglecolumn.csv)).
* Cleaned up historical and forecast datasets are then reconfigured for specific purposes.
* County population forecast dataset is enhanced to include the percent change in population since 2017.  This step is used for the 
creation of a dataset that can potentially be used to create a heatmap of the change in population for counties in the Basin.
* The percent change in municipal populations from 2006 to 2016 is calculated.  The dataset is then joined to 
[Colorado-Municipalities-SouthPlatte-Metro.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/Colorado-Municipalities-SouthPlatte-Metro.csv) 
so that the dataset has spatial data associated with it.  Colorado-Municipalities-SouthPlatte-Metro.csv was obtained from OWF's [owf-data-co-municipalities](https://github.com/OpenWaterFoundation/owf-data-co-municipalities) 
repository, which is a repository that contains identifiers and other data about Colorado municipalities.  The joined dataset is output to CSV format 
([municipal-population-2006-2016.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/site/data/municipal-population-2006-2016.csv))
* The percent change in municipal historical populations from 1980 to 2016 is calculated.  The dataset is output to CSV format 
([municipal-population-historical-change.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/site/data/municipal-population-historical-change.csv)).
* 2016 municipal populations are compared to the state 2016 population.  This is used for the table in page 6 (Municipal Population Data).

