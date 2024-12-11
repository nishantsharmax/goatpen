# Use an Ubuntu base image
FROM ubuntu:22.04

# Set non-interactive mode for apt to avoid user prompts during installation
ENV DEBIAN_FRONTEND=noninteractive

# Install required tools: curl, gnupg, git, node.js, yarn, and gcloud CLI
RUN apt-get update && apt-get install -y \
    curl gnupg build-essential apt-transport-https lsb-release ca-certificates libffi-dev software-properties-common

    
RUN apt-get install -y zip unzip 

RUN apt-get install -y python3.11

RUN ln -sf /usr/bin/python3.11 /usr/bin/python3

# RUN add-apt-repository ppa:deadsnakes/ppa 

# RUN apt-get update && \
#     apt-get install -y python3.11 && \
#     ln -sf /usr/bin/python3.11 /usr/bin/python3 && \
#     apt-get clean && rm -rf /var/lib/apt/lists/*

RUN apt-get install -y python3-pip

# RUN curl -sS https://bootstrap.pypa.io/get-pip.py -o get-pip.py && \
#     python3.11 get-pip.py && \
#     rm get-pip.py

RUN python3 -m pip install --upgrade pip && \
    python3 -m pip install cffi && \
    python3 -m pip install pyopenssl && \
    pip3 install --user pyopenssl==23.2.0

# Install Node.js (LTS version) and Yarn package manager
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    nvm install 20 && \
    npm install --global yarn

# Install Google Cloud CLI
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && \
    curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg && \
    apt-get update -y && apt-get install google-cloud-cli -y


RUN python3 -m pip show pyopenssl

RUN gsutil version -l

# Set the working directory
WORKDIR /usr/src/app

# Copy project files (assuming your Next.js project files are in the same directory as this Dockerfile)
COPY ./web ./web
COPY ./cli ./cli
COPY ./modules ./modules
COPY ./upload_submodules.sh .

WORKDIR /usr/src/app/web

# Set environment variables
ENV GCLOUD_PROJECT=''
ENV GOOGLE_APPLICATION_CREDENTIALS=''
ENV ADMIN_PASSWORD=''

# Install dependencies with Yarn
RUN bash -c "source $HOME/.nvm/nvm.sh && yarn install --frozen-lockfile"

# Build the Next.js project
RUN bash -c "source $HOME/.nvm/nvm.sh && yarn build"

RUN bash -c "echo -e \"  ADMIN_PASSWORD: $(echo -n 'Admin@123' | sha256sum | awk '{print $1}')\n\" >> /usr/src/app/web/app.yaml; "

RUN cat /usr/src/app/web/app.yaml

RUN chmod +x /usr/src/app/upload_submodules.sh

CMD ["bash", "-c", "if [ \"$APP_MODE\" = \"cli\" ]; then cd /usr/src/app/cli && ./startup.sh; else cd /usr/src/app/web && \
      gcloud auth login && gcloud config set project $GCLOUD_PROJECT && \
      hashed_password=$(echo -n \"$ADMIN_PASSWORD\" | sha256sum | awk '{print $1}') && \
      sed -i \"s/^  ADMIN_PASSWORD:.*/  ADMIN_PASSWORD: $hashed_password/\" app.yaml && \
      /usr/src/app/upload_submodules.sh && \
      gcloud app deploy --service-account=$SERVICE_ACCOUNT_NAME; \
    fi"]


# To run the docker file web
# docker run -it -e GCLOUD_PROJECT=lab-team-dev-3 -e APP_MODE=web -e ADMIN_PASSWORD=Admin@123 -e SERVICE_ACCOUNT_NAME=goatpen-deployer@lab-team-dev-3.iam.gserviceaccount.com --name goat-pen-web goatpen

# Note: Password should contains Capital letter, small letter, number and special character and at least 8 characters

# To run the docker file cli
# docker run -it \                                
#   -e GCLOUD_PROJECT=<project-name> \
#   -e APP_MODE=cli \
#   -e GOOGLE_APPLICATION_CREDENTIALS="/app/secure/service-account-key.json" \
#   -v ./local-sa-file.json:/app/secure/service-account-key.json \
#   --name goat-pen-cli \
#   goat-pen

# docker run -it -e GCLOUD_PROJECT=lab-team-dev-1 -e APP_MODE=cli  -e GOOGLE_APPLICATION_CREDENTIALS="/app/secure/service-account-key.json" -v ./test-build-sa.json:/app/secure/service-account-key.json --name goatpen-cli-test goatpen  
