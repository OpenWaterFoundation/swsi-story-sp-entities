#Set working directory
setwd ("C:\\Users\\kms\\southplattedataplatform\\git-repos\\swsi-story-sp-entities\\analysis\\")

#Load required packages
require(data.table)
require(dplyr)
require(tidyr)
require(curl)
require(stringr)
require(geojsonio)  #Can read in .geojson
rm(list=ls())


# FORECAST POPULATION DATA  (2000-2050)
# Data are only available for counties

#############################################################################################################
# May eventually be able to do this step (reading data directly from web), but currently is not working
# The data.table package contains a function, fread(), that allows you to read data directly
# from a website.
# countypopulation = getURL('https://drive.google.com/uc?export=download&id=0B-vz6H4k4SESdkNHSng2VGlEc1k', ssl.verifyhost=FALSE, 
# ssl.verifypeer=FALSE)
# Data are in a character string (to check, type class(countypopulation); need to get into a data.frame object
# countypopulation = read.csv(textConnection(countypopulation), header=T)
##############################################################################################################

# 1) Download data
# Input county forecast population data (2000-2050)
# Data were downloaded from DOLA's website (https://demography.dola.colorado.gov/population/population-totals-counties/#population-totals-for-colorado-counties)
# Click on "1 year increments, 2000-2050" under "Population Forecasts - years (2000-2050)"
# Load data
county_forecast = read.csv("DOLA-county-population-forecast.csv", header = FALSE, skip=3)

# 2) Clean up the data
# Change the row with years to be the column headings
colnames(county_forecast) = unlist(county_forecast[row.names(county_forecast)=='1',])
# Then delete that row
county_forecast = county_forecast[!row.names(county_forecast)=='1',]
colnames(county_forecast)[colnames(county_forecast) =="67"] = "County"

# Remove leading and trailing spaces
county_forecast$County = str_trim(county_forecast$County, "left")
county_forecast$County = str_trim(county_forecast$County, "right")

# Reorganize the data
county_forecast_yearsincolumns = county_forecast %>%
  arrange(County) %>%			# Sort by county name	   
  filter(County != "COLORADO") %>%	# Remove blank rows and COLORADO
  filter(County != "")

# Change counties from character data type to factor
county_forecast_yearsincolumns$County = as.factor(county_forecast_yearsincolumns$County)

# Add prefix to year columns (Pop2018 instead of 2018) because there can be problems 
# with columns starting with a number
county_forecast_yearsincolumns_2 = county_forecast_yearsincolumns
colnames(county_forecast_yearsincolumns_2) = paste("Pop", 
  colnames(county_forecast_yearsincolumns_2), sep = "_")

#Remove "Pop" from County
county_forecast_yearsincolumns_2 = county_forecast_yearsincolumns_2 %>%
  rename(County = Pop_County)

# 3) Output dataset to CSV for use in some visualizations
write.csv(county_forecast_yearsincolumns_2, file="..\\site\\data\\county-population-forecast-yearsinmultiplecolumns.csv", row.names=FALSE)

# 4) Reshape dataset to have years within a single "Year" column
# Data are in a wide format, so will "gather" into long format
county_forecast_yearsinsinglecolumn =
  county_forecast_yearsincolumns %>%
    gather("Year", "Population", 2:52)

# Make sure Year and Population variables are numbers and not characters
county_forecast_yearsinsinglecolumn$Year = as.numeric(county_forecast_yearsinsinglecolumn$Year)
county_forecast_yearsinsinglecolumn$Population = as.numeric(county_forecast_yearsinsinglecolumn$Population)
# View data types
glimpse(county_forecast_yearsinsinglecolumn)

# 5) Output dataset to CSV for use in some visualizations
write.csv(county_forecast_yearsinsinglecolumn, file="..\\site\\data\\county-population-forecast-yearsinsinglecolumn.csv", 
row.names=FALSE)


################################################################################################################
# HISTORICAL POPULATION DATA (1980-2016)
# Data available for municipalities and counties

# 1) Download data; fread() is from the curl package and allows for direct download from the web
# Data are from DOLA at https://demography.dola.colorado.gov/data/.  The direct download accesses the "County and 
# Municipal Population Time Series 1980-2016" category and the county-muni-timeseries.csv file.	
historical_population = fread('https://storage.googleapis.com/co-publicdata/county-muni-timeseries.csv')
head(historical_population)

# 2) County data
# Filter "municipalityname" column to only include entities with "COUNTY" in the name
county_historical = historical_population %>%
  filter(placefips == 0) %>%
  filter(countyfips > 0)

# Get rid of "COUNTY" in the 2016 data
county_historical$municipalityname = sub(" COUNTY", "", county_historical$municipalityname)

# Convert county names to lowercase and then to proper case
county_historical$municipalityname = tolower(county_historical$municipalityname)
simpleCap = function(x) {
  s = strsplit(x, " ")[[1]]
  paste(toupper(substring(s, 1,1)), substring(s, 2), sep="", collapse=" ")
  }
county_historical$municipalityname = sapply(county_historical$municipalityname, simpleCap)

# Clean up data
county_historical = county_historical %>%
  rename(CountyName = municipalityname) %>%	# Change "municipalityname" to "CountyName"
  rename(CountyFIPS = countyfips) %>%		# Change "countyfips" to "CountyFIPS"
  rename(Year = year) %>%				# Change "year" to "Year"
  rename(TotalPopulation = totalpopulation) %>%		# Change "totalpopulation" to "TotalPopulation"
  select(CountyFIPS, CountyName, Year, TotalPopulation) %>%	# Get rid of placefips, id and countyplace columns
  arrange(CountyName, Year)	# Sort by county, then year

# 3) Municipal data
# Filter data to only include municipalities and get rid of unincorporated areas
muni_population = historical_population %>%
  filter(placefips > 0) %>%
  filter(placefips != 99990) %>%
  arrange(municipalityname)	#Sort data by municipality

# Clean up misspelled municipalities
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Vo", "Vona")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="turita", "Naturita")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Mount Crested Butte/G", "Mount Crested Butte")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Massa", "Manassa")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Igcio", "Ignacio")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Idaho Sprgs", "Idaho Springs")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Green Mtn Falls (Total)", "Green Mountain Falls (Total)")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Green Mtn. Falls (Part)", "Green Mountain Falls (Part)")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Green Mtn. Falls(part)", "Green Mountain Falls (part)")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Grada", "Granada")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Flager", "Flagler")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="City of Creede", "Creede")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="City of Castle Pines", "Castle Pines")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="City Of Castle Pines", "Castle Pines")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Bue Vista", "Buena Vista")
muni_population$municipalityname = replace(muni_population$municipalityname, 
  muni_population$municipalityname=="Bonza City", "Bonanza City")


# Need to separate 2010-2016 data from the rest because for some cities there is a "Total" that 
# shouldn't be added to the other "part"s
total_muni_pop = muni_population %>%
  filter(year >= 2010) %>% 
  rename(TotalPopulation = totalpopulation) %>%
  rename(Year = year) %>%
  rename(FIPS_ID = placefips)

# For the cities that have "Total" in the name, keep "Total" and remove "Part"
total_muni_pop = total_muni_pop[!like(total_muni_pop$municipalityname, "Part"),]

# Remove "(Total)" from the name
total_muni_pop$municipalityname = sub(" (Total)", "", total_muni_pop$municipalityname, fixed=TRUE)


# Create subset of data from 1980-2009, which will then be merged with the 2010-2016 data
muni_pop2 = muni_population %>%
  filter(year < 2010) %>%
  filter(!is.na(totalpopulation))

# Remove "(part)" from the name of some cities
muni_pop2$municipalityname = sub(" (part)", "", muni_pop2$municipalityname, fixed=TRUE)

# Group by municipality name and year and then add population together for each year
muni_pop3 = muni_pop2 %>%
  arrange(municipalityname, year) %>%
  group_by(municipalityname, year) %>%
  summarise(TotalPopulation = sum(totalpopulation, na.rm=TRUE))

# Create table of municipality name and placefips to join with the data 
muni_pop4 = muni_pop2 %>%
  select(placefips, municipalityname) %>%
  distinct()
# Join the tables together and rename column names
muni_pop3 = left_join(muni_pop3, muni_pop4)
muni_pop3 = muni_pop3 %>%
  rename(Year = year) %>%
  rename(FIPS_ID = placefips)

# Now join 1980-2009 data (muni_pop3) with the 2010-2016 data (total_muni_pop)
muni_historical = full_join(muni_pop3, total_muni_pop)

# Sort by municipality
muni_historical = muni_historical %>%
  arrange(Year) %>%	# Sort by year
  rename(MunicipalityName = municipalityname) %>%  # Change column name
  rename(Population = TotalPopulation) %>%  # Change column name
  select(MunicipalityName, FIPS_ID, Year, Population)	#Remove unneeded columns

# Export to csv
write.csv(muni_historical, file="..\\site\\data\\municipal-population-historical-yearsinsinglecolumn.csv", 
row.names=FALSE)

################################################################################################
# APPLIED USES OF THE COUNTY AND MUNICIPAL POPULATION DATA
# Filter and/or restructure data depending on the need

# 1) Create new dataset from county forecast data that will allow for calculating percent change 
# in population since 2017
# Used for potential heatmap for the South Platte Data Platform project

pop2017 = countypopulation_yearsinsinglecolumn %>%
  select(County, Year, Population) %>%
  filter(Year == 2017) %>%
  select(County, Population) %>%
  rename(Pop2017 = 'Population')

# Read in file of counties that includes which basin(s) each is in
countyinfo = read.csv("Colorado-Counties.csv", header = TRUE)
countybasin = countyinfo %>%
  select(CountyName, IBCC_Basin_CSV) %>%
  rename(County = CountyName)

# Merge basin info
  pop2017 = inner_join(pop2017, countybasin, by = c("County" = "County")) 

# Calculate the percent change in population since 2017 for 2018-2050
percent_change = full_join(countypopulation_yearsinsinglecolumn, pop2017)
percent_change = percent_change %>%
  filter(between(Year, 2017, 2050))	%>%			 			# Remove 2000-2016
  mutate(Percent_Change_2017 = (Population - Pop2017)/Pop2017*100) %>%	# Calculate percent change since 2017
  rename(CountyName = County)
# Round to 1 decimal place
percent_change$Percent_Change_2017 = round(percent_change$Percent_Change_2017, digits=1)
	
# This is for all counties; now filter to only include South Platte and Metro Basins
percent_change_sp = percent_change[like(percent_change$IBCC_Basin_CSV, "South Platte"),]
percent_change_metro = percent_change[like(percent_change$IBCC_Basin_CSV, "Metro"),]

# Merge datasets together
percent_change_spmetro = full_join(percent_change_sp, percent_change_metro)

percent_change_spmetro = percent_change_spmetro %>%
  filter(CountyName != "El Paso") %>%	# Remove since Colorado Springs is major city in county
  filter(CountyName != "Teller") %>%	# Remove since major population centers are in Arkansas Basin
  arrange(Year, CountyName)

#######################################################################################################
# 2) Percent change in municipal populations from 2006 to 2016
# Used for South Platte Data Platform project -- Leaflet map of municipalities sized by percent change and 
# colored by 2016 population

# Filter historical municipal dataset to only include 2006 and 2016 data
muni_pop_2016 = muni_historical %>%
  filter(Year %in% c(2016)) %>%
  rename(Pop2016 = Population) %>%
  select(-Year)
muni_pop_2006 = muni_historical %>%
  filter(Year %in% c(2006)) %>%
  rename(Pop2006 = Population) %>%
  select(-Year)

# Merge datasets together
muni_pop_2006_2016 = inner_join(muni_pop_2006, muni_pop_2016, by = c("MunicipalityName" = "MunicipalityName"))
muni_pop_2006_2016 = muni_pop_2006_2016 %>%
  select(MunicipalityName, Pop2006, Pop2016)

# Calculate percent change
muni_pop_2006_2016 = muni_pop_2006_2016 %>%
  mutate(Percent_Change = (Pop2016 - Pop2006)/Pop2006 * 100)
# Round to 1 decimal place
muni_pop_2006_2016$Percent_Change = round(muni_pop_2006_2016$Percent_Change, digits=1)

# Filter to only include municpalities in the South Platte and Metro Basins
spmetro_muni = read.csv("Colorado-Municipalities-SouthPlatte-Metro.csv", header=TRUE)

# Merge datasets together
muni_pop_2006_2016 = inner_join(spmetro_muni, muni_pop_2006_2016)

# Export to csv for visualization; converted to geojson outside of R for now
write.csv(muni_pop_2006_2016, file="municipal-population-2006-2016.csv", 
row.names=FALSE)

###########################################################################
# 3) Percent change in historical populations from 1980 to 2016
# Used for South Platte Data Platform project -- Leaflet map of municipalities sized by percent change and 
# colored by population; map has time slider to automatically cycle from 1980 to 2016

# Filter historical municipal dataset to only include 1980 to calculate percent change since this year
muni_pop_1980 = muni_historical %>%
  filter(Year %in% c(1980)) %>%
  rename(Pop1980 = Population) %>%
  select(-Year, -FIPS_ID)

# Merge datasets together
muni_historical_change = left_join(muni_historical, muni_pop_1980, by = c("MunicipalityName" = "MunicipalityName"))

# Calculate percent change
muni_historical_change = muni_historical_change %>%
  mutate(Percent_Change_1980 = (Population - Pop1980)/Pop1980 * 100)
# Round to 1 decimal place
muni_historical_change$Percent_Change_1980 = round(muni_historical_change$Percent_Change_1980, digits=1)

# Filter to only include municpalities in the South Platte and Metro Basins
muni_historical_change = inner_join(spmetro_muni, muni_historical_change)

# Sort by year
muni_historical_change = muni_historical_change[order(muni_historical_change$Year),]


# Export to csv for visualization; converted to geojson outside of R for now
write.csv(muni_historical_change, file="..\\site\\data\\municipal-population-historical-change.csv", 
row.names=FALSE)

###########################################################################
# 4) Compare municipal 2016 population to 2016 state population
# First get the State historical data
state_historical = historical_population %>%
  filter(placefips == 0) %>%
  filter(countyfips == 0) %>%
  rename(State = municipalityname) %>%
  rename(Year = year) %>%
  rename(Population = totalpopulation) %>%
  select(State, Year, Population)

# Correct misspellings
state_historical$State = replace(state_historical$State, 
  state_historical$State=="Colorad", "Colorado")
state_historical$State = replace(state_historical$State, 
  state_historical$State=="COLORADO STATE", "Colorado")

# State 2016 population is 5538180; will use to create new variable

# Access the "muni_pop_2006_2016" dataset and join the state data to it
muni_state_2016 = muni_pop_2006_2016

# Create new variable of 2016 state population
muni_state_2016$StatePop2016 = rep(5538180, 117)

# Calculate municipality's percent of state pop
muni_state_2016 = muni_state_2016 %>%
  mutate(Percent_State = Pop2016 / StatePop2016 * 100) %>%
  arrange(desc(Pop2016)) %>%
  select(MunicipalityName, Pop2016, Percent_State) %>%
  mutate(Cumulative_Percent = cumsum(Percent_State))
  
# Round percents to 2 decimal place
muni_state_2016$Percent_State = round(muni_state_2016$Percent_State, digits=2)
muni_state_2016$Cumulative_Percent = round(muni_state_2016$Cumulative_Percent, digits=1)

head(muni_state_2016, n=120)

# Export dataset to csv to be embedded as a table in the Water Entities story
write.csv(muni_state_2016, file="..\\site\\data\\municipal-population-2016-percent-state.csv", 
row.names=FALSE)

test = read.csv("..\\site\\data\\municipal-population-2016-percent-state.csv", header = TRUE)



#######################
# Read in county geojson file (test of adding in spatial data; note that you need 
# to remove the "var = Name" part of the file)
# May use this command later when more time is available
countyspatial = geojsonio::geojson_read("Colorado_Counties.geojson", what = "sp")




# Statewide testing of cumulative percent (just checking numbers)
# Access the "muni_pop_2006_2016" dataset and join the state data to it
muni_state_2016_b = muni_pop_2016
muni_state_2016_b = as.data.frame(muni_state_2016_b)

# Create new variable of 2016 state population
muni_state_2016_b$StatePop2016 = rep(5538180, 271)

# Calculate municipality's percent of state pop
muni_state_2016_b = muni_state_2016_b %>%
  mutate(Percent_State = Pop2016 / StatePop2016 * 100) %>%
  arrange(desc(Pop2016)) %>%
  select(MunicipalityName, Pop2016, Percent_State) %>%
  mutate(Cumulative_Percent = cumsum(Percent_State))
  
# Round percents to 2 decimal place
muni_state_2016_b$Percent_State = round(muni_state_2016$Percent_State, digits=2)
muni_state_2016$Cumulative_Percent = round(muni_state_2016$Cumulative_Percent, digits=1)

head(muni_state_2016_b, n=275)












