# Agricultural entities analyses
# Uses the Irrigated Lands, Ditch Service Areas and Structures datasets from CDSS
# May also incorporate Division 1 Canals spatial data
# Focus on South Platte Basin

#Set working directory
setwd ("C:\\Users\\kms\\southplattedataplatform\\git-repos\\swsi-story-sp-entities\\site\\analysis\\")

#Load required package
require(data.table)
require(dplyr)
require(tidyr)
require(curl)
require(stringr)

rm(list=ls())

# 1) Read in data
# Irrigated Lands for Division 1 (South Platte) (polygons) 2005 and 2015
irrigated_lands_2005 = read.csv("..\\data\\CO-DWR-IrrigatedLands-Division01-2005-20180228.csv", 
header = TRUE)
irrigated_lands_2005 = irrigated_lands_2005 %>%
  rename(Irrig_Type_2005 = IRRIG_TYPE)
head(irrigated_lands_2005)

irrigated_lands_2015 = read.csv("..\\data\\CO-DWR-IrrigatedLands-Division01-2015-20180228.csv", 
header = TRUE)
irrigated_lands_2015 = irrigated_lands_2015 %>%
  rename(Irrig_Type_2015 = IRRIG_TYPE)
head(irrigated_lands_2015)

# Ditch Service Areas for Division 1 (polygons)
ditch_areas_2005 = read.csv("..\\data\\CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv", 
header = TRUE)
head(ditch_areas_2005)

# Read in structures for Division 1 (points)
structures = read.csv("..\\data\\structures-southplatte.csv", 
header = TRUE)
head(structures)

#Read in canals for Division 1 (lines)
canals = read.csv("..\\data\\Div1_Canals.csv", 
header = TRUE)
head(canals)

############################################################################################
# 2) Statistics for Irrigated Lands
# a) Total acres flood irrigated vs. sprinkler irrigated for each crop type
(crop_summary = irrigated_lands_2015 %>%
  group_by(CROP_TYPE, IRRIG_TYPE) %>%
  summarise(Acres = sum(ACRES)))
# ** COULD DO THIS FOR ALL YEARS OF IRRIGATED LANDS DATA (1956, 1976, 1987, 1997, 2001, 2005)
# TO SEE CHANGE OVER TIME **



#############################################################################################
# 3) Statistics for Structures
# a) Total number of structures associated with each water source
(structure_watersource = structures %>%
  group_by(watersrc) %>%
  tally(sort=TRUE) %>%
  rename(Water_Source = watersrc))

#############################################################################################
# 4) Link ditch service areas to structures to see the total acreage for each water source
ditch_areas_watersource = inner_join(ditch_areas_2005, structures, by = c("WDID" = "wdid")) %>%
  select(WDID, DITCH_NAME, ACREAGE, structtype, watersrc, watersrcmi) %>%
# a) Summarize acreage per water source
  group_by(watersrc) %>%
  summarise(WaterSource_Acres = sum(ACREAGE)) %>%
  arrange(desc(WaterSource_Acres)) %>%
  rename(Water_Source = watersrc)
print(ditch_areas_watersource, n=120)







