#!/bin/bash

# This script is used to upload the submodules to the gcs bucket
# zip the submodules and upload to the gcs bucket, submodules are present in the modules folder
# upload all the modules to the gcs bucket one by one

# Set the project id
BUCKET_NAME="goat-pen-bucket"

MODULES_FOLDER="/usr/src/app/modules"


# Get the list of modules
modules=$(ls $MODULES_FOLDER)

# Loop through the modules and upload to the gcs bucket

for module in $modules
do
    echo "Uploading the module $module to the gcs bucket"
    # Zip the module
    cd $MODULES_FOLDER
    # zip -r $module.zip $MODULES_FOLDER/$module
    zip -r $module.zip $module

    # Upload the module to the gcs bucket
    # if the bucket is not present, create the bucket
    if [ -z "$GCLOUD_PROJECT" ]; then
        echo "GCLOUD_PROJECT is not set"
        exit 1
    fi
    gcloud storage ls | grep $BUCKET_NAME-$GCLOUD_PROJECT
    if [ $? -ne 0 ]; then
        echo "Creating the bucket $BUCKET_NAME-$GCLOUD_PROJECT"
        # gcloud storage mb gs://$BUCKET_NAME-$GCLOUD_PROJECT
        gcloud storage buckets create gs://$BUCKET_NAME-$GCLOUD_PROJECT --location=us-central1 --public-access-prevention --uniform-bucket-level-access
    fi

    gcloud storage cp $module.zip gs://$BUCKET_NAME-$GCLOUD_PROJECT/$module.zip
    # Remove the zip file
    rm $module.zip

done

