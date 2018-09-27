# Agricultural entities analyses
# Uses the Irrigated Lands, Ditch Service Areas and Structures datasets from CDSS
# May also incorporate Division 1 Canals spatial data
# Focus on South Platte Basin

#Set working directory
setwd ("C:\\Users\\kms\\southplattedataplatform\\git-repos\\swsi-story-sp-entities\\analysis\\")

#Load required package
require(data.table)
require(dplyr)
require(tidyr)
require(curl)
require(stringr)

rm(list=ls())

# 1) Read in data
# Irrigated Lands for Division 1 (South Platte) (polygons) 2005 and 2015
irrigated_lands_2005 = read.csv("CO-DWR-IrrigatedLands-Division01-2005-20180228.csv", 
header = TRUE)
head(irrigated_lands_2005)

irrigated_lands_2015 = read.csv("CO-DWR-IrrigatedLands-Division01-2015-20180228.csv", 
header = TRUE)
head(irrigated_lands_2015)

# Ditch Service Areas for Division 1 (polygons)
ditch_areas_2005 = read.csv("CO-DWR-DitchServiceAreas-Division01-2005-20180228.csv", 
header = TRUE)
head(ditch_areas_2005)

# Read in structures for Division 1 (points)
structures = read.csv("structures-southplatte.csv", 
header = TRUE)
head(structures)

#Read in canals for Division 1 (lines)
canals = read.csv("Div1_Canals.csv", 
header = TRUE)
head(canals)

############################################################################################
# 2) Statistics for Irrigated Lands
# a) Total acres flood irrigated vs. sprinkler irrigated for each crop type
# 2015
(crop_summary_2015 = irrigated_lands_2015 %>%
  group_by(CROP_TYPE, IRRIG_TYPE) %>%
  summarise(Acres = sum(ACRES)))
# Now summarize flood and sprinkler totals
(irrigation_summary_2015 = crop_summary_2015 %>%
  group_by(IRRIG_TYPE) %>%
  summarise(Acres = sum(Acres)))

# 2005
(crop_summary_2005 = irrigated_lands_2005 %>%
  group_by(CROP_TYPE, IRRIG_TYPE) %>%
  summarise(Acres = sum(ACRES)))
# Now summarize flood and sprinkler totals
(irrigation_summary_2005 = crop_summary_2005 %>%
  group_by(IRRIG_TYPE) %>%
  summarise(Acres = sum(Acres)))

# ** COULD DO THIS FOR ALL YEARS OF IRRIGATED LANDS DATA (1956, 1976, 1987, 1997, 2001, 2005)
# TO SEE CHANGE OVER TIME **

# b) Change from flood to sprinkler irrigation from 2005 to 2015
# Simplify datasets
irrigated_lands_2005 = irrigated_lands_2005 %>%
  rename(Irrig_Type_2005 = IRRIG_TYPE) %>%
  select(PARCEL_ID, CROP_TYPE, Irrig_Type_2005, ACRES) %>%
  arrange(PARCEL_ID)

irrigated_lands_2015 = irrigated_lands_2015 %>%
  rename(Irrig_Type_2015 = IRRIG_TYPE) %>%
  select(PARCEL_ID, CROP_TYPE, Irrig_Type_2015, ACRES) %>%
  arrange(PARCEL_ID)
  
# Merge datasets by Parcel ID
irrigated_lands_2005_2015 = inner_join(irrigated_lands_2015, irrigated_lands_2005, by = c("PARCEL_ID" = 
"PARCEL_ID"))
head(irrigated_lands_2005_2015, n=100)

# c) Summarize types of crops irrigated by first surface water WDID (SW_WDID1)
(wdid_summary_2015 = irrigated_lands_2015 %>%
  group_by(SW_WDID1) %>%
  summarise(Acres = sum(ACRES)) %>%
  arrange(desc(Acres)))
# Now take the top 5 and create a new dataset from those, then summarize by crop type
(wdid_summary_2015 = irrigated_lands_2015 %>%
  filter(SW_WDID1 %in% c("300919", "300911", "100687", "300929", "500526")) %>%
  group_by(SW_WDID1, CROP_TYPE) %>%
  summarise(Acres = sum(ACRES)) %>%
  arrange(SW_WDID1, desc(Acres)) %>%
  rename(WDID = SW_WDID1))

# Rearrange table
(wdid_summary_2015 = spread(wdid_summary_2015, CROP_TYPE, Acres))

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







