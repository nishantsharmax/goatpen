import DeployCard from "./deployingDynamicCards";
import Link from "next/link";
import goatList from "@/assets/goat-pen-assets/config.json";

export default function Deploy() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-start bg-gradient-to-b from-black from-35% via-orange-700 via-60% to-black to-100% bg-fixed pt-32">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_.1px,transparent_0.5px),linear-gradient(to_bottom,#ffffff1a_.1px,transparent_0.5px)] bg-[size:40px_40px]"></div>
      <div>
        <div className="p-10">
          <h1 className="mb-8 text-center text-4xl font-bold text-white">
            Goat Pen Deployer
          </h1>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {goatList.map((goat, index) =>
              goat["card-title"] === "GearGoat" ||
              goat["card-title"] === "ICSGoat" ? (
                <div key={index} className="w-full">
                  <DeployCard
                    title={goat["card-title"]}
                    description={goat.description}
                    imageSrc={goat.image}
                  />
                </div>
              ) : (
                <Link key={goat.id} href={`/deploy/${goat.id}`} passHref>
                  <DeployCard
                    title={goat["card-title"]}
                    description={goat.description}
                    imageSrc={goat.image}
                  />
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
