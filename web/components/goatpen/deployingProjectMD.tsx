import { remark } from "remark";
import html from "remark-html";

function addTailwindCss(
  htmlContent: string,
  tag: string,
  className: string,
): string {
  const tagRegex = new RegExp(`<${tag}(\\s|>)`, "g");
  const classRegex = new RegExp(`className="([^"]*)`, "g");
  const newHtmlContent = htmlContent
    .replace(tagRegex, `<${tag} class="${className}"$1`)
    .replace(classRegex, `class="${className} $1`);
  return newHtmlContent;
}

type ProjectType =
  | "aws-goat"
  | "azure-goat"
  | "gcp-goat"
  | "gear-goat"
  | "ics-goat";

export default async function deployingProjectMD({
  project,
  mdFileData,
  title,
  imageSrc,
}: {
  project: ProjectType;
  mdFileData: string;
  title: string;
  imageSrc: string;
}) {
  try {
    const processedContent = await remark().use(html).process(mdFileData);
    let htmlContent = processedContent.toString();

    htmlContent = addTailwindCss(
      htmlContent,
      "h1",
      "text-center my-6 text-3xl font-bold",
    );
    htmlContent = addTailwindCss(
      htmlContent,
      "h2",
      "my-6 text-2xl font-semibold",
    );
    htmlContent = addTailwindCss(
      htmlContent,
      "h3",
      "my-6 text-xl font-semibold",
    );
    htmlContent = addTailwindCss(htmlContent, "h6", "my-6 text-lg");
    htmlContent = addTailwindCss(htmlContent, "p", "my-2");
    htmlContent = addTailwindCss(htmlContent, "ul", "my-4 list-disc pl-6");
    htmlContent = addTailwindCss(htmlContent, "ol", "my-4 list-decimal pl-6");
    htmlContent = addTailwindCss(htmlContent, "a", "text-[#fcbf49] underline");

    return (
      <div className="p-4">
        <h2 className="mx-auto mb-4 text-center text-4xl font-bold text-gray-900">
          {title || ""}
        </h2>

        <div className="mb-4">
          <img
            src={imageSrc}
            alt="Sample Image"
            className="mx-auto max-h-72 rounded	object-contain"
          />
        </div>
        <div
          className="container mx-auto p-6 text-gray-800"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className="p-4">
        <h2 className="mx-auto mb-4 text-center text-4xl font-bold text-gray-900"></h2>

        <div className="mb-4">
          <img
            alt={`${project} Image`}
            className="mx-auto max-h-72 rounded	object-contain"
          />
        </div>
      </div>
    );
  }
}
