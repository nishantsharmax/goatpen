# Overview

###### AWSGoat is a vulnerable by design infrastructure on AWS featuring the latest released OWASP Top 10 web application security risks (2021) and other misconfiguration based on services such as IAM, S3, API Gateway, Lambda, EC2, and ECS. AWSGoat mimics real-world infrastructure but with added vulnerabilities. It features multiple escalation paths and is focused on a black-box approach.

<!-- --- -->

# Deployment Configuration Overview

###### This project utilizes Google Cloud Platform (GCP) for deployment. The configuration is segmented into sections based on deployment options and project-specific parameters. Please follow the instructions below to complete the deployment setup.

## Deployment Options

Choose one of the following options from the dropdown to define how to authenticate and deploy the project:

- **Option 1**: Use the **Current Logged-In Account** and Project  
  If you select this option, no additional deployment-specific configurations are needed as the active GCP credentials and project will be utilized.

- **Option 2**: Use a **Service Account** for Deployment  
  If you choose this option, you must provide the **Service Account Email** and the associated **Project ID**. Ensure that the currently authenticated user has appropriate permissions for accessing and deploying to the specified project.

<!-- --- -->

## Required Permissions

When using a service account for deployment, ensure it has the following IAM roles to perform necessary operations:

- **Cloud Build Service Agent**
- **Storage Object Viewer**

<!-- --- -->

## Project-Specific Credentials

After defining the deployment options, provide the following AWS credentials:

- **AWS_ACCESS_KEY_ID**
- **AWS_SECRET_ACCESS_KEY**

These values are required to enable authentication with AWS. To retrieve them, follow these steps:

1. Log in to the **AWS Management Console**.
2. Navigate to **IAM (Identity and Access Management)**.
3. Select the IAM user for deployment (or create a new one if needed).
4. Open the **Security Credentials** tab.
5. Click on **Create New Access Key** or use an existing key.
6. Copy the **Access Key ID** and **Secret Access Key** and paste them into the respective fields.

<!-- --- -->

## Important Considerations

The permissions required for the AWS Access Key can be as follows:

- **AdministratorAccess** for comprehensive privileges.
- For minimal permissions, refer to the AWSGoat repository's [policy.json](https://github.com/ine-labs/AWSGoat/blob/master/policy/policy.json) to create a custom policy and attach it to the designated user.

<!-- --- -->

## Final Step: Deploy

After completing all required fields, click on the **Deploy** button to start the deployment process.

<!-- --- -->

# Thanks
