import Image from "next/image";

export default function Follow() {
  return (
    <div>
      <div className="flex gap-[6px] items-center mb-5 text-black">
        <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
        <p className="font-semibold text-md">Follow on Instagram</p>
      </div>
    </div>
  );
}
