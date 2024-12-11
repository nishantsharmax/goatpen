import DeployingProjectMD from "@/components/goatpen/deployingProjectMD";
import DynamicForm from "@/components/goatpen/deployingDynamicForms";
import goatList from "@/assets/goat-pen-assets/config.json";
import fs from "fs";

type ProjectType =
  | "aws-goat"
  | "azure-goat"
  | "gcp-goat"
  | "gear-goat"
  | "ics-goat";

function page({ params }: { params: { project: string } }) {
  const goatData = goatList.find((goat) => goat.id === params.project);
  const configFile = (goatData && goatData["config-file"]) || null;
  const targetEndpoint = (goatData && goatData["target-endpoint"]) || null;
  const cardTitle = (goatData && goatData["card-title"]) || null;
  let inputFile = null;
  let mdFile = null;
  try {
    inputFile =
      goatData && goatData["input-file"]
        ? JSON.parse(fs.readFileSync(goatData["input-file"], "utf8"))
        : null;
  } catch (e) {
    inputFile = null;
  }
  try {
    mdFile =
      goatData && goatData["md-file"]
        ? fs.readFileSync(goatData["md-file"]).toString()
        : null;
  } catch (e) {
    mdFile = null;
  }

  return (
    <div className="relative min-h-screen flex-col items-center justify-start bg-gradient-to-b from-black from-35% via-orange-700 via-60% to-black to-100% bg-fixed pt-20">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_.1px,transparent_0.5px),linear-gradient(to_bottom,#ffffff1a_.1px,transparent_0.5px)] bg-[size:40px_40px]"></div>
      <div>
        <div className="">
          {!goatData ? (
            <h1 className="mb-8 text-center text-4xl font-bold text-white">
              404: Page Not Found
            </h1>
          ) : (
            <div className="flex min-h-[calc(100vh-5rem)]">
              <div className="h-[calc(100vh-5rem)] w-1/2 overflow-y-scroll bg-gray-100 bg-opacity-50 p-4">
                {mdFile ? (
                  <DeployingProjectMD
                    project={goatData.id as ProjectType}
                    mdFileData={mdFile}
                    title={goatData["title"]}
                    imageSrc={goatData["image"]}
                  />
                ) : (
                  <h2 className="flex justify-center text-2xl font-bold">
                    No Data Available
                  </h2>
                )}
              </div>

              <div className="h-[calc(100vh-5rem)] w-1/2 overflow-y-scroll bg-gray-200 bg-opacity-70 p-4">
                {inputFile && configFile && targetEndpoint && cardTitle ? (
                  <DynamicForm
                    formData={inputFile}
                    configFile={configFile}
                    goatType={goatData.id as ProjectType}
                    goatBucketName={goatData["use-repo"] || ""}
                    goatModuleUrlName={goatData["use-repo"] || ""}
                    targetEndpoint={targetEndpoint}
                    cardTitle={cardTitle}
                  />
                ) : (
                  <h2 className="flex justify-center text-2xl font-bold">
                    No Input Available
                  </h2>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default page;
