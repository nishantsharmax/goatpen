#!/bin/bash
# get the banner from banners/banners.sh
main_banner=$(./banners/banners.sh)
echo "$main_banner"

# add two blank lines
echo -e "\n\n"

# Function to display the menu
display_menu() {
    local items=("$@")

    echo "Please choose an option from the list:"
    for i in "${!items[@]}"; do
        echo "$((i+1))) ${items[$i]}"
    done
    echo ""
}

# Function to validate user input
validate_user_input() {
    local user_input=$1
    local item_count=$2

    # Check if the input is a number
    if [[ "$user_input" =~ ^[0-9]+$ ]]; then
        local index=$((user_input - 1))

        # Check if the number is within the valid range
        if [[ $index -ge 0 && $index -lt $item_count ]]; then
            echo "$index"
            return 0
        else
            echo "-1"
            return 1
        fi
    else
        echo "-1"
        return 1
    fi
}

# Function to check if AWS credentials are present and valid
check_aws_credentials() {
    # Define the path to the .aws credentials file
    local AWS_CREDENTIALS_FILE="$HOME/.aws/credentials"

    # Check if the .aws directory exists
    if [ ! -d "$HOME/.aws" ]; then
        return 1  # Directory not found, return false (1)
    fi

    # Check if the credentials file exists
    if [ ! -f "$AWS_CREDENTIALS_FILE" ]; then
        return 1  # File not found, return false (1)
    fi


    # Extract the aws_access_key_id and aws_secret_access_key values
    local access_key_id=$(grep -E '^\s*aws_access_key_id\s*=' "$AWS_CREDENTIALS_FILE" | awk -F '=' '{print $2}' | xargs)
    local secret_access_key=$(grep -E '^\s*aws_secret_access_key\s*=' "$AWS_CREDENTIALS_FILE" | awk -F '=' '{print $2}' | xargs)

    # Check if values are found and non-empty
    if [[ -z "$access_key_id" || -z "$secret_access_key" ]]; then
        return 1  # Missing or empty credentials, return false (1)
    fi

    # Echo the credentials to return them
    echo "AWS_ACCESS_KEY_ID=\"$access_key_id\" AWS_SECRET_ACCESS_KEY=\"$secret_access_key\""

    return 0  # Credentials are present and valid, return true (0)
}


# Main function to display menu, prompt user, and handle validation
main() {

    local terraform_items=("Deploy" "Destroy" "Quit")
    local terraform_user_input
    local terraform_selected_index
    local module_quit=1

    while true; do
        echo "What do you want to do?"
        display_menu "${terraform_items[@]}"
        read -p "Enter the number of your choice: " terraform_user_input
        terraform_selected_index=$(validate_user_input "$terraform_user_input" "${#terraform_items[@]}")
        if [[ "$terraform_selected_index" -eq $(( ${#terraform_items[@]} - 1 )) ]]; then
            echo "Quitting..."
            module_quit=0
            exit 0
        fi

        if [[ "$terraform_selected_index" -ne -1 ]]; then
            break
        else
            echo -e "Invalid input. Please try again.\n"
        fi
    done

    local items=("AWS Goat" "Azure Goat" "GCP Goat" "Quit")
    local user_input
    local selected_index
    local gcp_service_account_path=""
    local terraform_action=$([[ "$terraform_selected_index" -eq 0 ]] && echo "Deploy" || echo "Destroy")


    while true; do

        # Display the menu
        echo -e "\nWhat Goat Do You Want To $terraform_action?"
        display_menu "${items[@]}"

        # Prompt for user input
        read -p "Enter the number of your choice: " user_input

        # Validate user input
        selected_index=$(validate_user_input "$user_input" "${#items[@]}")

        if [[ "$selected_index" -eq $(( ${#items[@]} - 1 )) ]]; then
            echo "Quitting..."
            module_quit=0
            exit 0
            break
        fi

        # Check if the index is valid
        if [[ "$selected_index" -ne -1 ]]; then
            break
        else
            echo -e "Invalid input. Please try again.\n"
        fi
    done

    # if selected_index is 0 then ask for the which module to deploy
    local aws_goat_module_options=("Module 1" "Module 2" "Quit")
    local selected_module_index=-1

    if [[ "$selected_index" -eq 0 ]]; then
        while true; do
            echo -e "\nWhich module do you want to $(echo "$terraform_action"  | tr '[:upper:]' '[:lower:]')?"
            display_menu "${aws_goat_module_options[@]}"
            read -p "Enter the number of your choice: " user_input
            selected_module_index=$(validate_user_input "$user_input" "${#aws_goat_module_options[@]}")

            if [[ "$selected_module_index" -eq $(( ${#aws_goat_module_options[@]} - 1 )) ]]; then
                echo "Quitting..."
                module_quit=0
                exit 0
                break
            fi

            if [[ "$selected_module_index" -ne -1 ]]; then
                echo -e "\nYou selected: ${aws_goat_module_options[$selected_module_index]}"
                break
            else
                echo -e "Invalid input. Please try again.\n"
            fi
        done
    fi

    local cloud_build_deployed_account_creds_type=("GCP AUTH" "SERVICE ACCOUNT KEY" "Quit")
    local selected_cloud_build_deployed_account_creds_type_index=-1
    local gcp_service_account_creds_type=("GOOGLE_DEPLOYER_SERVICE_ACCOUNT_EMAIL" "GOOGLE_DEPLOYER_PROJECT_ID")
    local gcp_service_account_creds=()

    if [[ module_quit -eq 1 ]]; then

        while true; do
            echo -e "\nHow do you want to authenticate the deployment?"
            display_menu "${cloud_build_deployed_account_creds_type[@]}"
            read -p "Enter the number of your choice: " auth_user_input
            selected_cloud_build_deployed_account_creds_type_index=$(validate_user_input "$auth_user_input" "${#cloud_build_deployed_account_creds_type[@]}")

            if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq $(( ${#cloud_build_deployed_account_creds_type[@]} - 1 )) ]]; then
                echo "Quitting..."
                module_quit=0
                exit 0
                break
            fi

            if [[ "$selected_cloud_build_deployed_account_creds_type_index" -ne -1 ]]; then
                echo -e "\nYou selected: ${cloud_build_deployed_account_creds_type[$selected_cloud_build_deployed_account_creds_type_index]}"
                break
            else
                echo -e "Invalid input. Please try again.\n"
            fi

        done
            
        if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq 0 ]]; then
            echo "Verifying GCP auth credentials..."
            local active_account=$(gcloud config get-value account 2>/dev/null)

            if [[ -z "$active_account" || "$active_account" == "(unset)" ]]; then
                echo "No active login detected."
                selected_cloud_build_deployed_account_creds_type_index=1
            elif [[ "$active_account" == *"gserviceaccount.com" ]]; then
                echo "Currently logged in with a service account: $active_account"
                selected_cloud_build_deployed_account_creds_type_index=1
            else
                echo "Currently logged in with a user account: $active_account"
                selected_cloud_build_deployed_account_creds_type_index=0
            fi
        fi
            
        while true; do
            read -p "Enter the path of the GCP service account key, which is used to $(echo "$terraform_action"  | tr '[:upper:]' '[:lower:]') resources: " gcp_service_account_path

            if [[ -z "$gcp_service_account_path" ]]; then
                echo -e "No GCP service account path provided\n"
                continue
            elif [[ ! -f "$gcp_service_account_path" ]]; then
                echo -e "GCP service account file not found\n"
                continue
            else 
                echo -e "GCP service account file found\n"
            fi

            echo "Getting GCP service account details..."
            
            break
        done

        if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq 1 ]]; then
            for requirement in "${gcp_service_account_creds_type[@]}"; do
                if [[ "$requirement" == "GOOGLE_DEPLOYER_SERVICE_ACCOUNT_EMAIL" ]]; then
                    echo -e "\nProvide the email of the service account which is used to deploy the build"
                elif [[ "$requirement" == "GOOGLE_DEPLOYER_PROJECT_ID" ]]; then
                    echo -e "\nProvide the project id where the service account is available"
                fi
                read -p "Enter the value for $requirement: " value
                echo ""
                gcp_service_account_creds+=("$requirement=\"$value\"")
            done
        fi
    
    fi
    
    local want_aws_goat_requirements=("Want to use the local AWS credentials" "Want to Provide AWS credentials" "Quit")
    local aws_goat_requirements=("AWS_ACCESS_KEY_ID" "AWS_SECRET_ACCESS_KEY")
    local azure_goat_requirements=("AZURE_CLIENT_ID" "AZURE_CLIENT_SECRET" "AZURE_TENANT_ID" "AZURE_SUBSCRIPTION_ID")
    local gcp_goat_requirements=("GOOGLE_SERVICE_ACCOUNT_KEY" "GOOGLE_PROJECT_ID" "GOOGLE_PROJECT_BILLING_ACCOUNT_NAME")
    local gcp_goat_authed_requirements=("GOOGLE_PROJECT_ID" "GOOGLE_PROJECT_BILLING_ACCOUNT_NAME")

    if [[ module_quit -eq 1 ]]; then

        local able_to_deploy=0
        local required_credentials=()
        while true; do
            echo -e "\nSelected Goat: ${items[$selected_index]}"
            # Check if the user wants to use local AWS credentials or provide them
            local selected_aws_goat_requirement
            local selected_aws_goat_requirement_index
            required_credentials=()

            if [[ "$selected_index" -eq 0 ]]; then
            
                display_menu "${want_aws_goat_requirements[@]}"
                read -p "Enter the number of your choice: " selected_aws_goat_requirement
                selected_aws_goat_requirement_index=$(validate_user_input "$selected_aws_goat_requirement" "${#want_aws_goat_requirements[@]}")
                able_to_deploy=0 # reset if loops comes means things was not fully finialized

                if [[ "$selected_aws_goat_requirement_index" -eq $(( ${#want_aws_goat_requirements[@]} - 1 )) ]]; then
                    echo "Quitting..."
                    exit 0
                    break
                fi

                if [[ "$selected_aws_goat_requirement_index" -ne -1 ]]; then
                    echo "You selected: ${want_aws_goat_requirements[$selected_aws_goat_requirement_index]}"
                else
                    echo -e "Invalid input. Please try again."
                    continue
                fi

                if [[ "$selected_aws_goat_requirement_index" -eq 0 ]]; then
                    # Use local AWS credentials
                    echo "Using local AWS credentials"
                    # check if the credentials are available at user's home directory then .aws/credentials
                    # if not available then ask the user to provide the credentials
                    local credentials
                    credentials=$(check_aws_credentials)

                    if [[ $? -eq 0 ]]; then
                        echo "AWS credentials found and valid"
                        required_credentials=($credentials)
                    else
                        echo "AWS credentials not found or invalid"
                        selected_aws_goat_requirement_index=1
                    fi

                fi
            fi


            if [[ ("$selected_aws_goat_requirement_index" -eq 1 && "$selected_index" -eq 0 ) || ( $selected_index -lt 3 &&  $selected_index -ge 1 ) ]]; then
                # Provide AWS credentials
                echo "Provide ${items[$selected_index]} credentials"
                local required_list=()
                if [[ "$selected_index" -eq 0 ]]; then
                    required_list=("${aws_goat_requirements[@]}")
                fi
                if [[ "$selected_index" -eq 1 ]]; then
                    required_list=("${azure_goat_requirements[@]}")
                fi
                if [[ "$selected_index" -eq 2 ]]; then
                    if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq 0 ]]; then
                        required_list=("${gcp_goat_authed_requirements[@]}")
                    else
                        required_list=("${gcp_goat_requirements[@]}")
                    fi
                fi
                
                for requirement in "${required_list[@]}"; do
                    if [[ "$requirement" == "GOOGLE_SERVICE_ACCOUNT_KEY" ]]; then
                        echo -e "\nProvide the path of the service account key which is used to deploy the selected module resources"
                    fi
                    read -sp "Enter the value for $requirement: " value
                    echo ""
                    required_credentials+=("$requirement=\"$value\"")
                done
            fi

            echo -e "\n${items[$selected_index]} are going to be $(echo "$terraform_action"  | tr '[:upper:]' '[:lower:]')ed..."
            if [[ "$selected_module_index" -ne -1 ]]; then
                echo -e "With Module: ${aws_goat_module_options[$selected_module_index]}\n"
            fi
            
            able_to_deploy=1

            break

        done

        local goat_bucket=("AWSGoat" "AzureGoat" "GCPGoat" "GearGoat" "ICSGoat")
        local bucket_url=''

        if [[ "$able_to_deploy" -eq 1 ]]; then
            echo -e "\nGetting the signed url for the goat..."
            if [[ ! -z "$GOOGLE_APPLICATION_CREDENTIALS" && "$gcp_service_account_path" == "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
                echo "Activating the service account..."
                gcloud auth activate-service-account --key-file=$gcp_service_account_path
                export CLOUDSDK_CORE_PROJECT=$GCLOUD_PROJECT

                cd /usr/src/app/modules
                zip -r ${goat_bucket[$selected_index]}.zip ${goat_bucket[$selected_index]}
                cd -

                if [ -z "$GCLOUD_PROJECT" ]; then
                    echo "GCLOUD_PROJECT is not set"
                    exit 1
                fi
                
                gcloud storage ls | grep gs://goat-pen-bucket-$GCLOUD_PROJECT
                if [ $? -ne 0 ]; then
                    echo "Creating the bucket gs://goat-pen-bucket-$GCLOUD_PROJECT"
                    gcloud storage buckets create gs://goat-pen-bucket-$GCLOUD_PROJECT --location=us-central1 --public-access-prevention --uniform-bucket-level-access
                fi
                gcloud storage cp ${goat_bucket[$selected_index]}.zip gs://goat-pen-bucket-$GCLOUD_PROJECT/${goat_bucket[$selected_index]}.zip
                rm ${goat_bucket[$selected_index]}.zip
            fi
            bucket_url=$(gsutil signurl $gcp_service_account_path gs://goat-pen-bucket-$GCLOUD_PROJECT/${goat_bucket[$selected_index]}.zip | awk 'NR==2{print $5}')
        fi

        if [[ ! -z "$bucket_url" ]]; then
            echo -e "\n${terraform_action}ing the goat..."

            if [[ -z "$required_credentials" ]]; then
                echo "Credentials are empty"
            fi
            for credential in "${required_credentials[@]}"; do
                eval $credential
                cred_key=$(echo $credential | cut -d'=' -f1)
                export $cred_key
            done

            if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq 1 ]]; then
                if [[ -z "$gcp_service_account_creds" ]]; then
                    echo "Deployer Service Account Creds are empty"
                fi

                for credential in "${gcp_service_account_creds[@]}"; do
                    eval $credential
                    cred_key=$(echo $credential | cut -d'=' -f1)
                    export $cred_key
                done
            fi

            # echo "export MODULE_URL=$bucket_url"
            export MODULE_URL=$bucket_url

            local directroy_goat_names=("AWSGoat" "AzureGoat" "GCPGoat" "GearGoat" "ICSGoat")

            # echo "export MODULE_TYPE=${directroy_goat_names[$selected_index]}"
            export MODULE_TYPE=${directroy_goat_names[$selected_index]}
            if [[ "$selected_index" -eq 0 ]]; then
                if [[ "$selected_module_index" -eq 0 || "$selected_index" -eq -1 ]]; then
                    # echo "export TERRAFORM_DIRECTORY=${directroy_goat_names[$selected_index]}-master/modules/module-1"
                    export TERRAFORM_DIRECTORY=${directroy_goat_names[$selected_index]}/modules/module-1
                fi
                if [[ "$selected_module_index" -eq 1 ]]; then
                    # echo "export TERRAFORM_DIRECTORY=${directroy_goat_names[$selected_index]}-master/modules/module-2"
                    export TERRAFORM_DIRECTORY=${directroy_goat_names[$selected_index]}/modules/module-2
                fi
            elif [[ "$selected_index" -gt 0 ]]; then
                # echo "export TERRAFORM_DIRECTORY=${directroy_goat_names[$selected_index]}-master"
                export TERRAFORM_DIRECTORY=${directroy_goat_names[$selected_index]}
            fi

            if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq 1 && ( -z "$GOOGLE_DEPLOYER_SERVICE_ACCOUNT_EMAIL" || -z "$GOOGLE_DEPLOYER_PROJECT_ID" ) ]]; then
                echo "Deployer Service Account Email or Project ID is missing"
            elif [[ -z "$TERRAFORM_DIRECTORY" || -z "$MODULE_TYPE" || -z "$MODULE_URL" || -z "$required_credentials" ]]; then
                echo "Some required values are missing"
                echo "TERRAFORM_DIRECTORY: $TERRAFORM_DIRECTORY"
                echo "MODULE_TYPE: $MODULE_TYPE"
                echo "MODULE_URL: $MODULE_URL"
            else
                echo "${terraform_action}ing the goat..."

                if [[ ! -z "$GOOGLE_SERVICE_ACCOUNT_KEY" ]]; then
                    export GOOGLE_SERVICE_ACCOUNT_KEY=$(base64 -i $GOOGLE_SERVICE_ACCOUNT_KEY)
                fi
                
                if [[ "$selected_cloud_build_deployed_account_creds_type_index" -eq 0 ]]; then
                    echo "Running with Authenticated GCP account"
                    export GOOGLE_ACCESS_TOKEN=$(gcloud auth print-access-token | base64)
                    gcloud builds submit --config CloudBuildFiles/cloudbuild.yml --substitutions=_MODULE_URL="$MODULE_URL",_AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID",_AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY",_AWS_DEFAULT_REGION="us-east-1",_AZURE_CLIENT_ID="$AZURE_CLIENT_ID",_AZURE_CLIENT_SECRET="$AZURE_CLIENT_SECRET",_AZURE_TENANT_ID="$AZURE_TENANT_ID",_AZURE_SUBSCRIPTION_ID="$AZURE_SUBSCRIPTION_ID",_GCP_SERVICE_ACCOUNT_KEY="$GOOGLE_SERVICE_ACCOUNT_KEY",_GCP_PROJECT_ID="$GOOGLE_PROJECT_ID",_GCP_PROJECT_BILLING_ACCOUNT_NAME="$GOOGLE_PROJECT_BILLING_ACCOUNT_NAME",_GCP_REGION="us-central1",_TERRAFORM_DIRECTORY="$TERRAFORM_DIRECTORY",_MODULE_TYPE="$MODULE_TYPE",_TERRAFORM_ACTION="$terraform_action",_GOOGLE_AUTHED_TOKEN="$GOOGLE_ACCESS_TOKEN" 
                else
                    echo "Running with Service Account Key"
                    echo "projects/$GOOGLE_DEPLOYER_PROJECT_ID/serviceAccounts/$GOOGLE_DEPLOYER_SERVICE_ACCOUNT_EMAIL"
                    gcloud builds submit --config CloudBuildFiles/cloudbuild.yml --substitutions=_MODULE_URL="$MODULE_URL",_AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID",_AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY",_AWS_DEFAULT_REGION="us-east-1",_AZURE_CLIENT_ID="$AZURE_CLIENT_ID",_AZURE_CLIENT_SECRET="$AZURE_CLIENT_SECRET",_AZURE_TENANT_ID="$AZURE_TENANT_ID",_AZURE_SUBSCRIPTION_ID="$AZURE_SUBSCRIPTION_ID",_GCP_SERVICE_ACCOUNT_KEY="$GOOGLE_SERVICE_ACCOUNT_KEY",_GCP_PROJECT_ID="$GOOGLE_PROJECT_ID",_GCP_PROJECT_BILLING_ACCOUNT_NAME="$GOOGLE_PROJECT_BILLING_ACCOUNT_NAME",_GCP_REGION="us-central1",_TERRAFORM_DIRECTORY="$TERRAFORM_DIRECTORY",_MODULE_TYPE="$MODULE_TYPE",_TERRAFORM_ACTION="$terraform_action" --service-account="projects/$GOOGLE_DEPLOYER_PROJECT_ID/serviceAccounts/$GOOGLE_DEPLOYER_SERVICE_ACCOUNT_EMAIL" --default-buckets-behavior="REGIONAL_USER_OWNED_BUCKET"
                fi
            fi
        fi
    fi
}

main
