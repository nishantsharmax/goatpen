interface DeployCardProps {
  title: string;
  description: string;
  imageSrc: string;
}

export default function DeployCard({
  title,
  description,
  imageSrc,
}: DeployCardProps) {
  return (
    <div className="group relative aspect-square w-full rounded-[32px] bg-white bg-opacity-30 p-[3px] shadow-lg transition-all duration-500 ease-in-out hover:rounded-tl-[55px] sm:w-80 md:w-96 lg:w-96">
      <button className="absolute right-8 top-6 rounded-full border-none bg-black bg-opacity-100 px-2 py-1 text-xs font-bold text-white shadow-md transition-all duration-300 hover:bg-white  hover:text-black hover:shadow-glow hover:shadow-white">
        {title === "GearGoat" || title === "ICSGoat"
          ? "Comming Soon"
          : "Deploy"}
      </button>

      <div className="absolute left-[3px] top-[3px] z-[1] h-[calc(100%-6px)] w-[calc(100%-6px)] overflow-hidden rounded-[29px] transition-all duration-500 ease-in-out hover:scale-[1.3] group-hover:left-[10px] group-hover:top-[10px] group-hover:z-[3] group-hover:h-[140px] group-hover:w-[140px] group-hover:rounded-full group-hover:border-[7px] group-hover:border-[#003049] group-hover:ease-in-out">
        <img
          src={imageSrc}
          alt={`${title} image`}
          className="full h-[84%] w-full object-contain transition-all duration-500 ease-in-out group-hover:h-full group-hover:scale-[1.1] group-hover:bg-white group-hover:bg-opacity-55 group-hover:backdrop-blur"
        />
      </div>

      <div className="absolute bottom-[3px] left-[3px] right-[3px] top-[84%] z-[2] overflow-hidden rounded-[29px] bg-gradient-to-br from-[#ff8800] to-[#fcca46] shadow-inner transition-all duration-500 ease-in-out group-hover:top-[20%] group-hover:rounded-[80px_29px_29px_29px] group-hover:delay-150">
        <div className="absolute bottom-16 left-6 right-6 h-40 overflow-hidden">
          <span className="mt-4 block text-sm text-white">{description}</span>
        </div>

        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between">
          <div className="flex gap-4">
            <div className="block text-xl font-bold text-[#023047]">
              {title}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
