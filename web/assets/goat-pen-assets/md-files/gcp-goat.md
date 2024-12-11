# Overview

###### GCPGoat is a vulnerable by design infrastructure on GCP featuring the latest released OWASP Top 10 web application security risks (2021) and other misconfiguration based on services such as IAM, Storage Bucket, Cloud Functions and Compute Engine. GCPGoat mimics real-world infrastructure but with added vulnerabilities. It features multiple escalation paths and is focused on a black-box approach.

<!-- --- -->

# Deployment Configuration Overview

###### This project utilizes Google Cloud Platform (GCP) for deployment. The configuration is segmented into sections based on deployment options and project-specific parameters. Please follow the instructions below to complete the deployment setup.

## Deployment Options

Choose one of the following options from the dropdown to define how to authenticate and deploy the project:

- **Option 1**: Use the **Current Logged-In** Account and Project  
  If you select this option, no additional deployment-specific configurations are needed as the active GCP credentials and project will be utilized.

- **Option 2**: Use a **Service Account** for Deployment  
  If you choose this option, you must provide the **Service Account Email** and the associated **Project ID**. Ensure that the currently authenticated user has appropriate permissions for accessing and deploying to the specified project.

<!-- --- -->

## Required Permissions

When using a service account for deployment, ensure it has the following IAM roles to perform necessary operations:

- **Cloud Build Service Agent**
- **Storage Object Viewer**

<!-- --- -->

## Pre-Requisites

Ensure the following pre-requisites are met before initiating the deployment:

- The project should be newly created.
- The **Service-Usage API** should be enabled for the project.

<!-- --- -->

## Deployment Inputs

After setting up the basic configurations, provide the required project-specific values based on your chosen deployment method:

- **Option 1:** Using the Current Logged-In Account and Project
  - **GCP_PROJECT_ID**
  - **GCP_BILLING_ACCOUNT_NAME**

- **Option 2:** Using a Service Account for Deployment
  - **GCP_SERVICE_ACCOUNT_KEY**
  - **GCP_PROJECT_ID**
  - **GCP_BILLING_ACCOUNT_NAME**

<!-- --- -->

## Retrieving the Required Values

Follow these steps to obtain the necessary credentials:

1. **GCP_PROJECT_ID**: Go to the [GCP Console](https://console.cloud.google.com), select your project, and copy the **Project ID**.
2. **GCP_BILLING_ACCOUNT_NAME**: Navigate to the **Billing section** and copy the **Billing Account Name**.
3. **GCP_SERVICE_ACCOUNT_KEY**:
   - Go to **IAM & Admin** > **Service Accounts**, create a new service account, and download the key in JSON format.

<!-- --- -->

## Required Permissions

For deployments using a service account, ensure it has the following permissions:

- **App Engine Admin**
- **App Engine Creator**
- **Artifact Registry Administrator**
- **Cloud Functions Admin**
- **Editor**
- **Project IAM Admin**
- **Role Administrator**

Also, navigate to the **Billing** section, select **Manage Billing Account**, and add the service account as a **Billing Account Administrator**.

<!-- --- -->

## Final Step: Deploy

After completing all required fields, click on the **Deploy** button to start the deployment process.

<!-- --- -->

# Thanks
