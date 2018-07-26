# swsi-story-sp-entities #

This repository contains the "South Platte and Metro Basin Water Entities" story and all of its associated content. 
The story highlights the various types of water entities in the South Platte and Metro basins of Colorado, such as 
cities, agriculture, environmental, recreational and industrial entities. The purpose of the story is to provide general context 
for the number, location, and extent of such entities in the basin, provide links to useful datasets and highlight 
important water resources issues.  Background on Colorado water law and other topics is included to provide context 
and references for Colorado water resources.

The Water Entities story was created with the [fullPage.js](https://alvarotrigo.com/fullPage/) JavaScript library.  
See the story [deployed on the Open Water Foundation (OWF)'s website](http://stories.openwaterfoundation.org/co/swsi-story-sp-entities/).


## Repository Contents ##

The repository contains the following:

```text
analysis/             Folder containing data files from external sources and R scripts used to process the data files
build-util/           Folder containing useful scripts to view, build, and deploy documentation
site/                 Folder containing the static website and all of the data in the website
  css/                Folder containing CSS (cascading style sheet) files used to style the story 
  data/               Folder containing data used to create visualizations, such as maps
  images/             Folder containing images used within the story
  js/                 Folder containing JavaScript files used within the story, including copies of third-party libraries and local code
  webfonts/           Folder containing fonts used within the story
  index.html          The landing page (website) for the story
  VERSION.txt         Text file that provides the date of the last update of the story 
.gitattributes        Typical Git configuration file for repository attributes, in particular handling of line-ending and binary files
.gitignore            Typical Git configuration file to ignore files that should not be committed to the repository
README.md             This file; an explanation of repository contents, data files and sources

```

## Data Sources for Water Entities Story ##
The table below lists each page of the Water Entities story and the data, if applicable, used to create the visualization within that page.  
Any data processing steps are summarized in the README file in the `data` folder.

Page Number | Page Name | Data Files | Data Source
--- | --- | --- | ---
1 | South Platte and Metro Basin Water Entities | None | None
2 | Water Resources Concepts | None | None
3 | Colorado Water Rights Concepts | None | None
4 | Water Use Concepts | None | None
5 | Municipalities | municipal-population-2006-2016.geojson | [Department of Local Affairs (DOLA) State Demography Office](https://demography.dola.colorado.gov/data/)
6 | Municipal Population Data | municipal-population-historical-change.geojson | [Department of Local Affairs (DOLA) State Demography Office](https://demography.dola.colorado.gov/data/)
7 | Population Projections to 2050 | county-population-forecast.geojson | [Department of Local Affairs (DOLA) State Demography Office](https://demography.dola.colorado.gov/population/population-totals-counties/#population-totals-for-colorado-counties)
8 | Municipal Water Supply | None | None
9 | Municipal Water Providers | Colorado-Municipal-Water-Providers-SouthPlatte-Metro.geojson | Open Water Foundation (OWF)'s [owf-data-co-municipal-water-providers GitHub repository](https://github.com/OpenWaterFoundation/owf-data-co-municipal-water-providers)
10 | Municipal Water Use | waterproviders-wedp-population-wateruse.geojson | Colorado Water Conservation Board's [Water Efficiency Data Portal](http://cowaterefficiency.com/unauthenticated_home)
11 | Municipal Water Use and Efficiency | Colorado-Municipal-Water-Providers-SouthPlatte-Metro.geojson | Open Water Foundation (OWF)'s [owf-data-co-municipal-water-providers GitHub repository](https://github.com/OpenWaterFoundation/owf-data-co-municipal-water-providers)
12 | Agricultural Entities | None | None
13 | Agricultural Entities | CO-DWR-DitchServiceAreas-Division01-2005-20180228.geojson | [OWF via Colorado's Decision Support Systems](http://data.openwaterfoundation.org/co/cdss-data-spatial-bybasin/view-map.html)
14 | Changes in Agricultural Lands | Greeley-2005.jpg, Greeley-2017.jpg | Google Earth
15 | Agricultural Water Use and Efficiency | http://viz.openwaterfoundation.org/co/owf-viz-co-spdss-ag-gapminder/ | [OWF](http://viz.openwaterfoundation.org/)
16 | Environmental Entities | None | None
17 | Environmental Flow Protection | SouthPlatteMetro-instreamflow-reaches-decreed-with-amounts.geojson | [Colorado's Decision Support Systems (CDSS)](http://cdss.state.co.us/GIS/Pages/AllGISData.aspx), [Colorado Information Marketplace](https://data.colorado.gov/Water/CWCB-Instream-Flow-and-Natural-Lake-Level-Data/kzsx-aqy6/data)
18 | Environmental Entities | http://viz.openwaterfoundation.org/co/cwcb-viz-co-watershed-plans/index.html | [OWF](http://viz.openwaterfoundation.org/)
19 | Recreational Entities | None | None
20 | Industrial Entities | None | None
21 | Resources | None | None
22 | Sources | None | None

## Contributing ##

The Open Water Foundation has created this story during the South Platte Data Platform project.
If you use the repository and have comments, please contact the maintainers and/or use the GitHub issues to provide feedback.

## Maintainers ##

Kristin Swaim (@kswaim, kristin.swaim@openwaterfoundation.org) is the primary maintainer at the Open Water Foundation.

Steve Malers (@smalers, steve.malers@openwaterfoundation.org) is the secondary contact.

## Contributors ##

None yet, other than OWF staff.