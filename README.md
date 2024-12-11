# GoatPen : Hack, Hone, Harden

![1](https://github.com/user-attachments/assets/1fdab362-d482-4777-8760-27ff91212c09)

GoatPen is a diverse collection of vulnerable applications and infrastructure, affectionately referred to as "goats," designed for learners to practice their skills. Currently, GoatPen includes AWSGoat (AWS Security), GCPGoat (GCP Security), AzureGoat (Azure Security), GearGoat (Automobile Security), and ICSGoat (ICS Security), with more in the development and concept stages. Together, these tools have garnered over 2,700 stars and 1,200 forks on GitHub, reflecting their popularity and utility in the security community. Each member of GoatPen is actively maintained and updated.

Deploying these tools is made simple with GoatPen, requiring only Docker on your local system. GoatPen's built-in deployment helpers ensure a smooth setup of individual components, offering flexibility and ease of use for security professionals and developers. This platform also makes it easy for enthusiasts and learners to discover and keep up with the latest updates and additions to these security tools.

The project will be divided into modules and each module will be a separate goat application/infrastructure. It will leverage IaC through terraform, Google Cloud Build, and Google App Engine to ease the deployment process.

**Presented at**

- [BlackHat Europe 2024](https://www.blackhat.com/eu-24/arsenal/schedule/#goatpen-hack-hone-harden-41915)

### Developed with :heart: by [INE](https://ine.com/) 

[<img src="https://user-images.githubusercontent.com/25884689/184508144-f0196d79-5843-4ea6-ad39-0c14cd0da54c.png" alt="drawing" width="200"/>](https://discord.gg/TG7bpETgbg)

## Built With

* Shell
* NextJs
* Python 3
* Terraform
* Docker 
* Google Cloud Platform


# Getting Started

### Prerequisites
* A Linux/Windows/MacOs Machine with docker installed
* Editor level access to a google cloud project
* Project specific gcp credentials


### Installation

GoatPen can be run in two configurations (APP_MODE's)

* **cli:** Deploy/Destroy all goat modules by interacting through the cli

* **web:** Deploy/Destroy all goat modules by interacting through the web gui, deployed on Google App Engine

Here are the steps to follow:

**Step 1.** Clone the repo

```
git clone https://github.com/nishantsharmax/goatpen 
```

**Step 2.** Update SubModules

```
cd goatpen
cd modules && git submodule update --init --recursive
```

**Step 3.** Build GoatPen image

```
cd ..
docker build . -t goatpen
```

<p align="center">
  <img src="https://github.com/user-attachments/assets/e9fb7389-595e-44c7-bb65-812ac0789f78">
</p>

**Step 4.** Run the container in either web or cli mode.

**Web Mode**

Required Inputs:

**GCP_PROJECT_NAME**: GCP Project to deploy GoatPen's Web GUI on GAE

**SERVICE_ACCOUNT_EMAIL**: GCP Service Account Email to be used by GoatPen

```
docker run -it -e GCLOUD_PROJECT=<GCP_PROJECT_NAME> -e APP_MODE=web -e ADMIN_PASSWORD=Admin@123 -e SERVICE_ACCOUNT_NAME=<SERVICE_ACCOUNT_EMAIL> --name goat-pen-web goatpen
```

**CLI Mode**

Required Inputs:

**GCP_PROJECT_NAME**: GCP Project to deploy GoatPen's Web GUI on GAE

**SERVICE_ACCOUNT_EMAIL**: GCP Service Account Email to be used by GoatPen

**SERVICE_ACCCOUNT_KEY_PATH**: Local Path to GCP Project Service Account file

```
docker run -it -e GCLOUD_PROJECT=<GCP_PROJECT_NAME> -e APP_MODE=cli  -e GOOGLE_APPLICATION_CREDENTIALS="/app/secure/service-account-key.json" -v <SERVICE_ACCCOUNT_KEY_PATH>:/app/secure/service-account-key.json --name goatpen-cli goatpen
```

**Web Deployment Process Screenshots**

<p align="center">
  <img src="https://github.com/user-attachments/assets/064738ab-c68e-462d-854a-b4b6fe6b92ef">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/82929d5d-47a1-40ab-a07d-af4164ff42e2">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/ee285881-58e4-4db7-8f36-05cb2d382da1">
</p>
<p align="center">
  <img src="https://github.com/user-attachments/assets/44a12cbd-d87e-4899-aa4b-ca04b7f4f426">
</p>

**Step 4.** Deploy required module

<p align="center">
  <img src="https://github.com/user-attachments/assets/d7d6ce61-aeb3-4d5a-9a0e-4e236bab9e41">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/119ca125-8554-4378-bb6b-5862feafd383">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f9241852-a57c-4f36-82e2-9fb6d1b4e8d9">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/92ac1359-737b-45d3-86bb-824b19b48569">
</p>




**Step 5.** Destroy required module
TODO:
add screenshot for destroy module usage from cli



<p align="center">
  <img src="https://github.com/user-attachments/assets/4b0a6dac-22af-4113-a4cc-3ced5ae54aac">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/824f0f0d-3870-47c5-9067-c7cddc0f73a1">
</p>



# Modules

GoatPen is designed to make it easy for contributors to keep on adding vulnerable applications/infrastructures that could be deployed by without any dependency on the user's system. 

**How it works:**

For each module added there's a cloudbuild.yml file in the directory ``web/assets/goat-pen-assets/build-files``. This configuration file can cutomize the deployment process as per each goat app.

For each module to be added to the web gui,
the required input file is to be added at ``web/assets/goat-pen-assets/input-files``, a sample file is available at ``web/assets/goat-pen-assets/input-files/example.json``

Furthermore to add information about each web gui deployment it can be added to ``web/assets/goat-pen-assets/md-files``, these will be rendered as markdown on the web gui.

# Contributors

Rishappreet Singh Moonga, Software Engineer, INE  <rmoon@ine.com>

Shantanu Kale, Lab Infrastructure Team Lead, INE  <skale@ine.com>

Nishant Sharma, Director, Lab Platform, INE <nsharma@ine.com>

# Documentation

For more details refer to the "GoatPen.pdf" PDF file. This file contains the slide deck used for presentations.

# Screenshots


<p align="center">
  <img src="https://github.com/user-attachments/assets/e9fb7389-595e-44c7-bb65-812ac0789f78">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/d7d6ce61-aeb3-4d5a-9a0e-4e236bab9e41">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/aed0aa15-bd2d-485e-8564-263a3067a585">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/f9241852-a57c-4f36-82e2-9fb6d1b4e8d9">
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/824f0f0d-3870-47c5-9067-c7cddc0f73a1">
</p>

## Contribution Guidelines

* Contributions in the form of code improvements, module additions, feature improvements, and any general suggestions are welcome. 
* Improvements to the functionalities of the current modules are also welcome. 
* The source code for each module can be found linked as submodules in ``modules/`` this can be used to add existing applications into goatpen.

# License

This program is free software: you can redistribute it and/or modify it under the terms of the MIT License.

You should have received a copy of the MIT License along with this program. If not, see https://opensource.org/licenses/MIT.

# Sister Projects

- [AWSGoat](https://github.com/ine-labs/AWSGoat)
- [AzureGoat](https://github.com/ine-labs/AzureGoat)
- [GCPGoat](https://github.com/ine-labs/GCPGoat)
- [GearGoat](https://github.com/ine-labs/GearGoat)
- [ICSGoat](https://github.com/ine-labs/ICSGoat)
- [AWSDefenderGPT](https://github.com/ine-labs/AWSDefenderGPT)
- [Threatseeker](https://github.com/ine-labs/Threatseeker)
- [PA Toolkit (Pentester Academy Wireshark Toolkit)](https://github.com/pentesteracademy/patoolkit)
- [ReconPal: Leveraging NLP for Infosec](https://github.com/pentesteracademy/reconpal) 
- [VoIPShark: Open Source VoIP Analysis Platform](https://github.com/pentesteracademy/voipshark)
- [BLEMystique](https://github.com/pentesteracademy/blemystique)
