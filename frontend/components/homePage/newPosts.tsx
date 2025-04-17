import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";

export default function NewPosts() {
  return (
    <div>
      <div className=" flex items-center mb-5 mt-16 justify-between">
        <div className="flex gap-[6px] items-center text-black">
          <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
          <p className="font-semibold text-md">New Posts</p>
        </div>
        <div className="hover:scale-105 transition-transform cursor-pointer p-2 flex text-[#3E3232] rounded-lg items-center justify-center bg-[#F5F5F5] space-x-2">
          <p className="text-xs">Show All</p>
          <button
            // onClick={handleNext}
            className="text-xs"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
