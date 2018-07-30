# data #

The `data` folder contains data files needed to create the visualizations shown in the Water Entities story.  Data sources are provided.  Any 
data processing that was required is described within the file descriptions below.

The folder contains the following files:

* [CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv](#CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv)
* [CO-DWR-DitchServiceAreas-Division01-2005-20180228.geojson](#CO-DWR-DitchServiceAreas-Division01-2005-20180228.geojson)
* [Colorado_Counties.geojson](#Colorado_Counties.geojson)
* [Colorado-IBCC-Basins-WGS84.geojson](#Colorado-IBCC-Basins-WGS84.geojson)
* [Colorado-Municipal-Water-Providers-SouthPlatte-Metro.csv](#Colorado-Municipal-Water-Providers-SouthPlatte-Metro.csv)
* [Colorado-Municipal-Water-Providers-SouthPlatte-Metro.geojson](#Colorado-Municipal-Water-Providers-SouthPlatte-Metro.geojson)
* [county-population-forecast.geojson](#county-population-forecast.geojson)
* [county-population-forecast-yearsinsinglecolumn.csv](#county-population-forecast-yearsinsinglecolumn.csv)
* [municipal-population-2006-2016.csv](#municipal-population-2006-2016.csv)
* [municipal-population-2006-2016.geojson](#municipal-population-2006-2016.geojson)
* [municipal-population-historical-change.csv](#municipal-population-historical-change.csv)
* [municipal-population-historical-change.geojson](#municipal-population-historical-change.geojson)
* [municipal-population-historical-yearsinsinglecolumn.csv](#municipal-population-historical-yearsinsinglecolumn.csv)
* [SouthPlatteMetro-instreamflow-reaches-decreed-with-amounts.geojson](#SouthPlatteMetro-instreamflow-reaches-decreed-with-amounts.geojson)
* [waterproviders-wedp-population-wateruse.geojson](#waterproviders-wedp-population-wateruse.geojson)

## CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv ##
This file contains ditch service area data from 2005 for the South Platte Basin (Division 1).  The file comes from [OWF's processing](http://data.openwaterfoundation.org/co/cdss-data-spatial-bybasin/) 
of [Colorado's Decision Support Systems (CDSS) Geographic Information System Data](http://cdss.state.co.us/GIS/Pages/GISDataHome.aspx).  OWF 
developed a tool using open source QGIS software that splits CDSS spatial data layers to provide datasets for specific water divisions (basins) or districts.
The resulting smaller datasets, provided in useful formats, are easier to work with and benefit the Colorado water community.

For each service area (polygon) shown, the name of the ditch, the acres served and the water district identifier (WDID) is provided.  The WDID can be used 
to link to other CDSS datasets.  While this file is not directly used in visualizations, it is contained within the repository because it 
is essentially a copy of CO-DWR-DitchServiceAreas-Division01-2005-20180228.geojson but is in a format that may be more readily viewed and used by others. 
Note that this file does not have any spatial data associated with it.

## CO-DWR-DitchServiceAreas-Division01-2005-20180228.geojson ##
This file contains ditch service area data from 2005 for the South Platte Basin (Division 1).  The file comes from [OWF's processing](http://data.openwaterfoundation.org/co/cdss-data-spatial-bybasin/) 
of [Colorado's Decision Support Systems (CDSS) Geographic Information System Data](http://cdss.state.co.us/GIS/Pages/GISDataHome.aspx).  OWF 
developed a tool using open source QGIS software that splits CDSS spatial data layers to provide datasets for specific water divisions (basins) or districts.
The resulting smaller datasets, provided in useful formats, are easier to work with and benefit the Colorado water community.

For each service area (polygon) shown, the name of the ditch, the acres served and the water district identifier (WDID) is provided.  The WDID can be used 
to link to other CDSS datasets.  This file is used in page 13 of the Water Entities story (Agricultural Entities), in which service areas are color-coded 
by the acreage served.  No additional processing of the dataset was required.

## Colorado_Counties.geojson ##
This file contains the boundaries for each county in Colorado.  The file was accessed from OWF's [owf-data-co-counties](https://github.com/OpenWaterFoundation/owf-data-co-counties) 
repository that contains unique identifers and other data for Colorado's counties.  The file was originally downloaded from the Colorado Water Conservation Board (CWCB)'s 
[Data Viewer](https://gis.colorado.gov/dnrviewer/Index.html?viewer=cwcbviewer) as a shapefile.  It was opened in QGIS and the coordinate reference system 
was converted to WGS 84 so that the map could be properly viewed in web applications.  The shapefile was then saved in GeoJSON format.

This file is used in page 7 of the Water Entities story (Population Projections to 2050), in which counties are color-coded by population.

## Colorado-IBCC-Basins-WGS84.geojson ##
This file contains the boundaries for each Interbasin Compact Committee (IBCC) basin in Colorado.  The file was accessed from OWF's [owf-data-co-roundtable-basins](https://github.com/OpenWaterFoundation/owf-data-co-roundtable-basins) 
repository that contains basic information regarding each basin.  The file was originally downloaded from the Colorado Water Conservation Board (CWCB)'s 
[Data Viewer](https://gis.colorado.gov/dnrviewer/Index.html?viewer=cwcbviewer) as a shapefile.  It was opened in QGIS and the coordinate reference system 
was converted to WGS 84 so that the map could be properly viewed in web applications.  The shapefile was then saved in GeoJSON format.

This file is used in most of the maps within the Water Entities story to indicate basin boundaries.

## Colorado-Municipal-Water-Providers-SouthPlatte-Metro.csv ##
This file contains municipal water provider data for the South Platte Basin.  The file comes from OWF's [owf-data-co-municipal-water-providers](https://github.com/OpenWaterFoundation/owf-data-co-municipal-water-providers) 
repository that contains unique identifiers and other data for Colorado's municipal water providers.  The dataset was filtered to only contain providers in the South Platte and 
Metro basins.  Each water provider is represented by a point and contains information such as the type of provider (municipality, water district, private company, etc.), website 
and links to water efficiency plans, if available.  See the [owf-data-co-municipal-water-providers](https://github.com/OpenWaterFoundation/owf-data-co-municipal-water-providers) 
repository for more information about how the dataset was developed.  

While this file is not directly used in visualizations, it is contained within the repository because it is essentially a copy of 
Colorado-Municipal-Water-Providers-SouthPlatte-Metro.geojson but is in a format that may be more readily viewed and used by others. 

## Colorado-Municipal-Water-Providers-SouthPlatte-Metro.geojson ##
This file contains municipal water provider data for the South Platte Basin.  The file comes from OWF's [owf-data-co-municipal-water-providers](https://github.com/OpenWaterFoundation/owf-data-co-municipal-water-providers) 
repository that contains unique identifiers and other data for Colorado's municipal water providers.  The dataset was filtered to only contain providers in the South Platte and 
Metro basins.  Each water provider is represented by a point and contains information such as the type of provider (municipality, water district, private company, etc.), website 
and links to water efficiency plans, if available.  After filtering the dataset, the file was first saved in CSV format, then opened in QGIS and saved in 
GeoJSON format.  See the [owf-data-co-municipal-water-providers](https://github.com/OpenWaterFoundation/owf-data-co-municipal-water-providers) 
repository for more information about how the dataset was developed.

This file is used in pages 9 and 11 of the Water Entities story (Municipal Water Providers and Municipal Water Use and Efficiency, respectively).  

## county-population-forecast.geojson ##
This file is a merging of the [Colorado_Counties.geojson](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/site/data/Colorado_Counties.geojson) and 
[county-population-forecast-yearsinmultiplecolumns.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/site/data/county-population-forecast-yearsinmultiplecolumns.csv) files. 

This file is used in page 7 of the Water Entities story (Population Projections to 2050), in which counties are color-coded by population.

## county-population-forecast-yearsinmultiplecolumns.csv ##
This file contains county population forecasts for the years 2000 to 2050.  Each year of data is within its own column, which is necessary for some visualizations. 
The data were processed with the [county-municipal-population-dola.R](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-municipal-population-dola.R) script. 
See the `analysis` folder for processing steps and data inputs.  

While this file is not directly used in visualizations, it is contained within the repository because it is essentially a copy of 
county-population-forecast.geojson but is in a format that may be more readily viewed and used by others. 

## county-population-forecast-yearsinsinglecolumn.csv ##
This file contains county population forecasts for the years 2000 to 2050.  Each year of data is combined into a single "Year" column.
The data were processed with the [county-municipal-population-dola.R](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-municipal-population-dola.R) script. 
See the `analysis` folder for processing steps and data inputs.  

This file is used in page 7 of the Water Entities story (Population Projections to 2050), in which counties are color-coded by population.

## municipal-population-2006-2016.csv ##
This file contains municipal historical population data for the years 2006 and 2016 and the percent change in population between those years. The 
data were processed with the [county-municipal-population-dola.R](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-municipal-population-dola.R) script. 
See the `analysis` folder for processing steps and data inputs.  

While this file is not directly used in visualizations, it is contained within the repository because it is essentially a copy of 
municipal-population-2006-2016.geojson but is in a format that may be more readily viewed and used by others. 

## municipal-population-2006-2016.geojson ##
This file is a merging of the [municipal-population-2006-2016.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/site/data/municipal-population-2006-2016.csv) and 
[Colorado-Municipalities-SouthPlatte-Metro.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/Colorado-Municipalities-SouthPlatte-Metro.csv) files,
so that the dataset has spatial data associated with it.  Colorado-Municipalities-SouthPlatte-Metro.csv was obtained from OWF's [owf-data-co-municipalities](https://github.com/OpenWaterFoundation/owf-data-co-municipalities) 
repository, which is a repository that contains identifiers and other data about Colorado municipalities.

This file is used in page 5 of the Water Entities story (Municipalities), in which municipalities are color-coded by 2016 population 
and sized by the percent change in population since 2006. 

## municipal-population-historical-change.csv ##
This file contains municipal historical population data for the years 1980 to 2016 and the percent change in population since 1980. The 
data were processed with the [county-municipal-population-dola.R](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-municipal-population-dola.R) script. 
See the `analysis` folder for processing steps and data inputs.  The data are sorted by year and have been linked to the 
[Colorado-Municipalities-SouthPlatte-Metro.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/Colorado-Municipalities-SouthPlatte-Metro.csv) file.  

While this file is not directly used in visualizations, it is contained within the repository because it is essentially a copy of 
municipal-population-historical-change.geojson but is in a format that may be more readily viewed and used by others.

## municipal-population-historical-change.geojson ##
This file contains municipal historical population data for the years 1980 to 2016 and the percent change in population since 1980. The 
data were processed with the [county-municipal-population-dola.R](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/county-municipal-population-dola.R) script. 
See the `analysis` folder for processing steps and data inputs.  The data are sorted by year and have been linked to the 
[Colorado-Municipalities-SouthPlatte-Metro.csv](https://github.com/OpenWaterFoundation/swsi-story-sp-entities/blob/master/analysis/Colorado-Municipalities-SouthPlatte-Metro.csv) file.  The 
file was first saved in CSV format; it was then opened in QGIS and saved in GeoJSON format.

This file is used in page 6 of the Water Entities story (Municipal Population Data), in which municipalities are color-coded by 
population and sized by the percent change in population since 1980.

## SouthPlatteMetro-instreamflow-reaches-decreed-with-amounts.geojson ##
This file contains instream flow data accessed from the Colorado Information Marketplace's [CWCB Instream Flow and Natural Lake Level Data](https://data.colorado.gov/Water/CWCB-Instream-Flow-and-Natural-Lake-Level-Data/kzsx-aqy6/data) 
dataset.  Data were filtered to only include the South Platte basin and then exported to CSV format.  The "Flow Amounts" column was manually parsed within Excel to obtain decreed flow amounts 
for each month.  The case number for each right was then linked to the "Instream Flow Reaches - Decreed and pending reaches" 
zipped shapefile available from [CDSS](http://cdss.state.co.us/GIS/Pages/AllGISData.aspx) within QGIS to obtain spatial data (lines) for each right.

This file is used in page 17 of the Water Entities story (Environmental Flow Protection), in which stream reaches are color-coded by monthly decreed flow amounts.

## waterproviders-wedp-population-wateruse.geojson ##
This file contains water use and population data for water providers that provide more than 2,000 acre-feet of water to their customers 
annually, termed covered entities.  Data come from the CWCB's [Water Efficiency Data Portal (WEDP)](http://cowaterefficiency.com/unauthenticated_home). 
OWF processed the data from the WEDP in [TSTool](https://sites.google.com/site/cdssstaging/tstool/download), an open-source data-processing 
software and put the results in a separate repository, [owf-data-co-wedp](https://github.com/OpenWaterFoundation/owf-data-co-wedp).  *This repository 
has not yet been completed.*

This file is used in page 10 of the Water Entities story (Municipal Water Use), in which municipal water providers are color-coded 
by population served and sized by water use.
