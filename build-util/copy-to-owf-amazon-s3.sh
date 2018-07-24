#!/bin/bash
#
# Copy the site/* contents to the stories.openwaterfoundation.org website.
# - replace all the files on the web with local files
# - only copy specific website files such as index.html so as to not clobber other content loaded separately

# Set --dryrun to test before actually doing
dryrun=""
#dryrun="--dryrun"
s3Folder="s3://stories.openwaterfoundation.org/co/swsi-story-sp-entities"

# Make sure that this is being run from the build-util folder
pwd=`pwd`
dirname=`basename ${pwd}`
if [ ! ${dirname} = "build-util" ]
        then
        echo "Must run from build-util folder"
        exit 1
fi

if [ "$1" == "" ]
	then
	echo ""
	echo "Usage:  $0 AmazonConfigProfile"
	echo ""
	echo "Copy the site files to the Amazon S3 static website folder:  $s3Folder"
	echo ""
	exit 0
fi

awsProfile="$1"

# Get the version to append to files
versionFile="../site/VERSION.txt"
version=`cat "${versionFile}"`
if [ -z "${version}" ]
        then
        echo ""
        echo "No ${versionFile} version file to modify filenames for caching- cannot continue."
        exit 1
fi

# Folder used for temporary files, mainly renamed files to prevent caching
tmpBuildFolder="tmp-build"
if [ ! -e "${tmpBuildFolder}" ]
        then
        echo ""
        echo "No temporary build folder ${tmpBuildFolder} - cannot continue."
        exit 1
fi

# Sync first, then copy specific files
aws s3 sync ../site ${s3Folder} ${dryrun} --delete --profile "$awsProfile"
# Update content of index.html to use versioned files
# - put the variable definitions first because all are used in index.html update
countyCssOrig="county-population-forecast-map.css"
countyCssWithVersion="county-population-forecast-map.${version}.css"
cssOrig="style.css"
cssWithVersion="style.${version}.css"
customleafletcssOrig="custom-leaflet-style.css"
customleafletcssWithVersion="custom-leaflet-style.${version}.css"
# JavaScript files that need versioned
# -don't include /map-files because slash messes up sed command
fileParserJsOrig="fileparser.js"
fileParserJsWithVersion="fileparser.${version}.js"
# JavaScript map page files that need versioned
# -don't include /map-files because slash messes up sed command
# Muni...
countyPopJsOrig="county-population-forecast-map.js"
countyPopJsWithVersion="county-population-forecast-map.${version}.js"
muniJsOrig="municipalities-southplatte-metro-map.js"
muniJsWithVersion="municipalities-southplatte-metro-map.${version}.js"
muni2JsOrig="municipalities-southplatte-metro-map-2.js"
muni2JsWithVersion="municipalities-southplatte-metro-map-2.${version}.js"
muniPopHistJsOrig="municipal-population-historical-map.js"
muniPopHistJsWithVersion="municipal-population-historical-map.${version}.js"
wp1051JsOrig="water-providers-1051-data-map.js"
wp1051JsWithVersion="water-providers-1051-data-map.${version}.js"
wpEffJsOrig="water-providers-efficiency-plans-map.js"
wpEffJsWithVersion="water-providers-efficiency-plans-map.${version}.js"
wpJsOrig="water-providers-southplatte-metro-map.js"
wpJsWithVersion="water-providers-southplatte-metro-map.${version}.js"
# Agriculture...
ditchServiceAreaJsOrig="ditch-service-areas-2005-map.js"
ditchServiceAreaJsWithVersion="ditch-service-areas-2005-map.${version}.js"
# Environment...
instreamFlowJsOrig="instream-flow-map.js"
instreamFlowJsWithVersion="instream-flow-map.${version}.js"
#
cat ../site/index.html | sed -e "s/${countyPopJsOrig}/${countyPopJsWithVersion}/g" | sed -e "s/${muniJsOrig}/${muniJsWithVersion}/g" | sed -e "s/${muni2JsOrig}/${muni2JsWithVersion}/g" | sed -e "s/${muniPopHistJsOrig}/${muniPopHistJsWithVersion}/g" | sed -e "s/${wp1051JsOrig}/${wp1051JsWithVersion}/g" | sed -e "s/${wpEffJsOrig}/${wpEffJsWithVersion}/g" | sed -e "s/${wpJsOrig}/${wpJsWithVersion}/g" | sed -e "s/${countyCssOrig}/${countyCssWithVersion}/g" | sed -e "s/${cssOrig}/${cssWithVersion}/g" | sed -e "s/${customleafletcssOrig}/${customleafletcssWithVersion}/g" | sed -e "s/${fileParserJsOrig}/${fileParserJsWithVersion}/g" | sed -e "s/${ditchServiceAreaJsOrig}/${ditchServiceAreaJsWithVersion}/g" | sed -e "s/${instreamFlowJsOrig}/${instreamFlowJsWithVersion}/g" > ${tmpBuildFolder}/index.html
aws s3 cp ${tmpBuildFolder}/index.html ${s3Folder}/index.html ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/county-population-forecast-map.css ${s3Folder}/css/county-population-forecast-map.${version}.css ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/style.css ${s3Folder}/css/style.${version}.css ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/custom-leaflet-style.css ${s3Folder}/css/custom-leaflet-style.${version}.css ${dryrun} --profile "$awsProfile"
# General
aws s3 cp ../site/js/fileparser.js ${s3Folder}/js/fileparser.${version}.js ${dryrun} --profile "$awsProfile"
# Muni
aws s3 cp ../site/js/map-files/county-population-forecast-map.js ${s3Folder}/js/map-files/county-population-forecast-map.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/municipalities-southplatte-metro-map.js ${s3Folder}/js/map-files/municipalities-southplatte-metro-map.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/municipalities-southplatte-metro-map-2.js ${s3Folder}/js/map-files/municipalities-southplatte-metro-map-2.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/municipal-population-historical-map.js ${s3Folder}/js/map-files/municipal-population-historical-map.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/water-providers-1051-data-map.js ${s3Folder}/js/map-files/water-providers-1051-data-map.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/water-providers-efficiency-plans-map.js ${s3Folder}/js/map-files/water-providers-efficiency-plans-map.${version}.js ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/js/map-files/water-providers-southplatte-metro-map.js ${s3Folder}/js/map-files/water-providers-southplatte-metro-map.${version}.js ${dryrun} --profile "$awsProfile"
# Agriculture
aws s3 cp ../site/js/map-files/ditch-service-areas-2005-map.js ${s3Folder}/js/map-files/ditch-service-areas-2005-map.${version}.js ${dryrun} --profile "$awsProfile"
# Environment
aws s3 cp ../site/js/map-files/instream-flow-map.js ${s3Folder}/js/map-files/instream-flow-map.${version}.js ${dryrun} --profile "$awsProfile"
