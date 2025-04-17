import Image from "next/image";

/**
 * NewComments component for BlogHub.
 * Displays a section header for recent or highlighted comments.
 * @returns JSX.Element - The new comments section
 */
export default function NewComments() {
  return (
    <div>
      <div className="flex gap-[6px] items-center mb-5 text-black">
        <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
        <p className="font-semibold text-md">Mega Comments</p>
      </div>
    </div>
  );
}
