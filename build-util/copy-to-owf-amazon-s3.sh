#!/bin/bash
#
# Copy the site/* contents to the stories.openwaterfoundation.org website.
# - replace all the files on the web with local files
# - only copy specific website files such as index.html so as to not clobber other content loaded separately

# Set --dryrun to test before actually doing
dryrun=""
#dryrun="--dryrun"
s3Folder="s3://stories.openwaterfoundation.org/co/swsi-story-ipps-sp"

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
cssOrig='style.css'
cssWithVersion="style.${version}.css"
customleafletcssOrig='custom-leaflet-style.css'
customleafletcssWithVersion="custom-leaflet-style.${version}.css"
cat ../site/index.html | sed -e "s/${cssOrig}/${cssWithVersion}/g" | sed -e "s/${customleafletcssOrig}/${customleafletcssWithVersion}/g" > ${tmpBuildFolder}/index.html
aws s3 cp ${tmpBuildFolder}/index.html ${s3Folder}/index.html ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/style.css ${s3Folder}/css/style.${version}.css ${dryrun} --profile "$awsProfile"
aws s3 cp ../site/css/custom-leaflet-style.css ${s3Folder}/css/custom-leaflet-style.${version}.css ${dryrun} --profile "$awsProfile"
