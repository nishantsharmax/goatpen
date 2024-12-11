# Overview

###### AzureGoat is a vulnerable by design infrastructure on Azure featuring the latest released OWASP Top 10 web application security risks (2021) and other misconfiguration based on services such as App Functions, CosmosDB, Storage Accounts, Automation and Identities. AzureGoat mimics real-world infrastructure but with added vulnerabilities. It features multiple escalation paths and is focused on a black-box approach.

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

After defining the deployment options, provide the following Azure-specific credentials:

- **AZURE_CLIENT_ID**
- **AZURE_CLIENT_SECRET**
- **AZURE_TENANT_ID**
- **AZURE_SUBSCRIPTION_ID**

To obtain these values, follow these steps:

1. Log in to the **Azure Portal**.
2. Navigate to **Azure Active Directory** (now known as **Microsoft Entra ID**).
3. Go to **App Registrations** and select **New Registration**.
4. Fill in the details and click **Register**.
5. Copy the **Application (client) ID** and **Directory (tenant) ID**, and paste them in the respective fields.
6. Go to **Certificates & Secrets** and click on **New Client Secret**.
7. Fill in the details, click **Add**, and copy the secret value for the **AZURE_CLIENT_SECRET** field.
8. To obtain the **Subscription ID**, navigate to **Subscriptions** and copy the **Subscription ID** value.

<!-- --- -->

## Important Considerations for Azure Permissions

Ensure that the Service Principal associated with the Azure Client ID has the necessary role permissions:

- **Owner** (for full administrative privileges).
- Alternatively, use the **Contributor** role along with a custom role that includes the following permissions:

  - **Microsoft.Authorization/roleAssignments/write**
  - **Microsoft.Authorization/roleAssignments/delete**

When assigning the custom role, make sure to add the condition:

- **Allow user to assign all roles (highly privileged)**

Apply these permissions at the resource group or subscription level for proper access control.

<!-- --- -->

## Final Step: Deploy

After completing all required fields, click on the **Deploy** button to start the deployment process.

<!-- --- -->

# Thanks
