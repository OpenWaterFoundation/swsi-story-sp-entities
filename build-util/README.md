# build-util #

This folder contains useful scripts.

* `copy-to-owf-amazon-s3.sh` - upload website to OWF Amazon S3 static website
* `create-upload-site.sh` - create a website that can be uploaded (but don't upload)
* `run-http-server-8000.sh` - run a local web server to view files on `localhost:8000`
	+ Default is to view the development site files
	+ Run with any command line argument to view the prepped upload site in `tmp-build`
* `tmp-build/` - folder that contains the website ready for upload, ignored from repo
