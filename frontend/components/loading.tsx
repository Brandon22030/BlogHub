import Image from "next/image";

export function Loader() {
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <div>
          <Image
            className=""
            src="/logo.svg"
            alt="logo"
            width={250}
            height={59}
            priority
          />
        </div>
        <div className="flex items-center box-border p-1.5 w-48 h-7 bg-gray-800 shadow-inner rounded-full">
          <div className="relative flex justify-center flex-col w-0% h-5 bg-gradient-to-t from-[#FC4308] to-[#FC4308] rounded-full animate-loading">
            <div className="absolute flex items-center gap-4">
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
              <div className="bg-gradient-to-tl from-white to-transparent w-2.5 h-11 opacity-30 rotate-45"></div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex flex-col items-center justify-center gap-1">
      <Image
            className=""
            src="/logo.svg"
            alt="logo"
            width={201}
            height={59}
            priority
          />
        <div className="w-48 h-8 bg-gray-800 rounded-full flex items-center shadow-inner overflow-hidden">
          <div className="h-4 w-0 bg-gradient-to-r from-orange-600 to-yellow-400 rounded-full animate-[loading_4s_ease-out_infinite]"></div>
          <div className="absolute flex gap-4">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="w-2.5 h-11 bg-white opacity-30 rotate-45 origin-bottom-left"
              ></span>
            ))}
          </div>
        </div>
      </div> */}
    </>
  );
}
