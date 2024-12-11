import { CloudBuildClient } from "@google-cloud/cloudbuild";
import { Storage } from "@google-cloud/storage";
import path from "path";

import { NextRequest, NextResponse } from "next/server";

async function uploadFilesToGCS(
  storageClient: Storage,
  bucketName: string,
  localPath: string,
) {
  const [bucket] = await storageClient.bucket(bucketName).exists();
  const randomString = () =>
    Array.from({ length: 4 }, () => Math.random().toString(36).slice(2))
      .join("")
      .slice(0, 32);
  const destinationFilename = `${Date.now()}.${Math.random()
    .toString(10)
    .slice(2, 8)}-${randomString()}.yaml`;

  if (!bucket) {
    await storageClient.createBucket(bucketName);
  }

  // Upload the file to GCS
  await storageClient.bucket(bucketName).upload(localPath, {
    destination: `source/${destinationFilename}`,
  });

  const [metadata] = await storageClient
    .bucket(bucketName)
    .file(`source/${destinationFilename}`)
    .getMetadata();
  const generation = metadata.generation;

  return [`source/${destinationFilename}`, generation];
}

async function checkBuildStatusAndLog(
  cloudBuildClient: CloudBuildClient,
  storageClient: Storage,
  operationID: string,
) {
  let buildWorking = true;
  let firstTime = true;
  while (buildWorking) {
    const [builds] = await cloudBuildClient.getBuild({
      projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
      id: operationID,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const logsBucket = builds.logsBucket?.startsWith("gs://")
      ? builds.logsBucket
      : "";
    const filename = `log-${operationID}.txt`;
    const bucket = storageClient.bucket(logsBucket);

    if (firstTime) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      firstTime = false;
    }
    const file = bucket.file(filename);
    const [contents] = await file.download();

    if (builds.status !== "WORKING" && builds.status !== "QUEUED") {
      buildWorking = false;
    }
  }

  const [build] = await cloudBuildClient.getBuild({
    projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
    id: operationID,
  });
  const status = build.status;
  const logUrl = build.logUrl || "";

  const logsBucket = build.logsBucket?.startsWith("gs://")
    ? build.logsBucket
    : "";
  const filename = `log-${operationID}.txt`;

  const bucket = storageClient.bucket(logsBucket);
  const file = bucket.file(filename);
  const [contents] = await file.download();

  return [status, logUrl, contents.toString()];
}

async function generateSignedUrl(
  storageClient: Storage,
  bucketName: string,
  fileName: string,
) {
  try {
    // Define the expiration time for the URL (e.g., 1 hour)
    const options = {
      version: "v4" as const, // Use v4 signed URLs (recommended)
      action: "read" as const, // Action can be 'read', 'write', 'delete', or 'resumable'
      expires: Date.now() + 60 * 60 * 1000, // 1 hour
    };

    // Get a signed URL for the file
    const [url] = await storageClient
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    return url;
  } catch (err) {
    console.error("Error generating signed URL:", err);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    _TERRAFORM_ACTION,
    configPath,
    targetEndpoint,
    cardTitle,
    _TERRAFORM_DIRECTORY,
    _MODULE_TYPE,
    _MODULE_URL_NAME,
  } = body;

  if (!configPath) {
    return NextResponse.json(
      { error: "Missing deployment configuration file" },
      { status: 400 },
    );
  }

  if (!_TERRAFORM_DIRECTORY || !_MODULE_URL_NAME) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const storage = new Storage();

  const sourceDirectory = path.join(`${__dirname}../../../../`, configPath);
  const bucketName = `${
    process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT
  }_cloudbuild`;
  const [uploadedFileName, generation] = await uploadFilesToGCS(
    storage,
    bucketName,
    configPath,
  );

  // Initialize the Cloud Build client
  const cloudBuildClient = new CloudBuildClient();

  const exceptionElements = ["AWSGoat", "AzureGoat", "GCPGoat"];
  const bucketNameElements = body["_TERRAFORM_DIRECTORY"];

  const substitutions = [];
  if (exceptionElements.includes(bucketNameElements)) {
    substitutions.push(`_MODULE_TYPE=${bucketNameElements}`);
  }

  for (const key in body) {
    if (key === "_GCP_SERVICE_ACCOUNT_KEY") {
      const base64Key = Buffer.from(body[key]).toString("base64");
      substitutions.push(`${key}=${base64Key}`);
    } else if (key.startsWith("_") && key !== "_MODULE_URL_NAME") {
      substitutions.push(`${key}=${body[key]}`);
    }
  }

  const url = await generateSignedUrl(
    storage,
    `gs://goat-pen-bucket-${
      process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT
    }`,
    `${_MODULE_URL_NAME}.zip`,
  );

  if (url) {
    substitutions.push(`_MODULE_URL=${url}`);
  } else {
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 },
    );
  }

  const buildConfig = {
    projectId: process.env.GCLOUD_PROJECT || process.env.GOOGLE_CLOUD_PROJECT,
    build: {
      steps: [
        {
          name: "gcr.io/cloud-builders/gsutil",
          args: [
            "cp",
            `gs://${bucketName}/${uploadedFileName}`,
            "cloudbuild.yaml",
          ],
        },
        {
          name: "gcr.io/cloud-builders/gcloud",
          args: [
            "builds",
            "submit",
            "--config=cloudbuild.yaml",
            `--substitutions=${substitutions.join(",")}`,
            "--async",
            "--default-buckets-behavior=REGIONAL_USER_OWNED_BUCKET",
          ],
        },
      ],
      // serviceAccount: process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL,
      options: {
        defaultLogsBucketBehavior: "REGIONAL_USER_OWNED_BUCKET" as const,
      },
    },
  };

  try {
    // Submit the Cloud Build job
    const [operation] = await cloudBuildClient.createBuild(buildConfig);

    const operationID =
      operation.metadata &&
      (operation.metadata as any).build &&
      (operation.metadata as any).build.id;

    const [status, logUrl, contents] = await checkBuildStatusAndLog(
      cloudBuildClient,
      storage,
      operationID,
    );

    if (status !== "SUCCESS" || !contents) {
      return NextResponse.json(
        { error: "Failed to trigger Cloud Build" },
        { status: 500 },
      );
    }

    const regex =
      /Logs are available at \[\s*(https:\/\/console\.cloud\.google\.com\/cloud-build\/builds\/[^\s]+)\s*\]/;
    const match = (contents as string).match(regex);

    let projectBuildLogUrl = "";
    let projectOperationID = "";
    if (match && match[1]) {
      projectBuildLogUrl = match[1];
      projectOperationID = match[1].split("/").pop()?.split("?")[0] || "";
    } else {
      return NextResponse.json(
        { error: "Failed to extract log URL" },
        { status: 500 },
      );
    }

    const [projectStatus, projectLogUrl, projectContents] =
      await checkBuildStatusAndLog(
        cloudBuildClient,
        storage,
        projectOperationID,
      );

    let url = "";
    if (_TERRAFORM_ACTION === "Deploy") {
      for (let i = 0; i < targetEndpoint.length; i++) {
        const endpoint = targetEndpoint[i];
        const urlRegex = new RegExp(
          `${endpoint}\\s*=\\s*"(https?:\\/\\/[^\\s"]+)"`,
        );
        const matcher = (projectContents as string).match(urlRegex);

        url = matcher ? matcher[1] : "";
        if (url) {
          break;
        }
      }
    } else {
      url = "destroy";
    }

    let message = "Don't know what happened";
    if (projectStatus === "SUCCESS") {
      if (url) {
        message = `Build completed successfully. ${cardTitle} is ${url}`;
      } else {
        url = "unknown";
      }
    } else if (projectStatus === "FAILURE") {
      message = "Build failed";
      url = "failed";
    } else if (projectStatus === "CANCELLED") {
      message = "Build was cancelled";
      url = "cancelled";
    }
    return NextResponse.json({
      message: message,
      buildId: projectOperationID,
      projectStatus,
      url: url,
    });
  } catch (error) {
    console.error("Error triggering Cloud Build:", error);
    return NextResponse.json(
      { error: "Failed to trigger Cloud Build" },
      { status: 500 },
    );
  }
}
