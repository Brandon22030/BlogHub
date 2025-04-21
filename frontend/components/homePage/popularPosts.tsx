import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

/**
 * PopularPosts component for BlogHub.
 * Displays a header with navigation buttons for popular posts.
 * @returns JSX.Element - Header with navigation buttons
 */
export default function PopularPosts() {
  return (
    <div>
      <div className="flex items-center mb-5 mt-16 justify-between">
        <div className="flex gap-[6px] items-center text-black">
          <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
          <p className="font-semibold text-md">Popular Posts</p>
        </div>
        <div className="space-x-6">
          <button
            // onClick={handlePrev}
            className="p-2 bg-[#F5F5F5] text-black rounded-lg "
          >
            <FaChevronLeft />
          </button>
          <button
            // onClick={handleNext}
            className="p-2 bg-[#F5F5F5] text-black rounded-lg "
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
}
