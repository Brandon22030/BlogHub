import Image from "next/image";
import SocialButtons from "./socialButtons";

export default function Newsletter() {
  return (
    <div className="bg-[#F5F5F5] pb-10 rounded-r-3xl w-[900px]">
      <div className="pl-40 pt-10 pr-10">
        <div className="flex justify-between gap-28">
          {/* Mega menu & Newsletters */}
          <div className="">
            <div className="mb-[31px]">
              <div className="flex gap-[6px] items-center mb-5">
                <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
                <p className="font-semibold text-md text-black">Mega News</p>
              </div>
              <p className="pl-3 text-sm text-[##3E3232BF] text-justify text-black">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Egestas purus viverra accumsan in nisl nisi. Arcu cursus vitae
                congue mauris rhoncus aenean vel elit scelerisque. In egestas
                erat imperdiet sed euismod nisi porta lorem mollis. Morbi
                tristique senectus et netus. Mattis pellentesque id nibh tortor
                id aliquet lectus proin
              </p>
            </div>
            <div className="mb-[31px]">
              <div className="flex gap-[6px] items-center mb-5">
                <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
                <p className="font-semibold text-md text-black">Newsletters</p>
              </div>
              <div className="flex items-center bg-white rounded-xl pr-3">
                <input
                  type="mail"
                  name="email"
                  placeholder="Write Your Email ..."
                  className="w-full py-4 text-sm pl-2 rounded-xl focus:outline-none focus:ring-0"
                />
                <Image
                  src="/mailsend.svg"
                  alt="reed_ops"
                  width={20}
                  height={20}
                />
              </div>
            </div>
          </div>

          {/* Categories & Social networks */}
          <div>
            <div className="mb-[31px]">
              <div className="flex gap-[6px] items-center mb-5">
                <Image src="/red_ops.svg" alt="reed_ops" width={4} height={4} />
                <p className="font-semibold text-md text-black">Categories</p>
              </div>
              <div className="space-y-3 pl-3 text-sm text-black">
                <p>Culture</p>
                <p>Fashion</p>
                <p>Featured</p>
                <p>Food</p>
                <p>Healthy Living</p>
                <p>Technologie</p>
              </div>
            </div>

            <div>
              <div className="items-center mb-5 space-y-6">
                <div className="flex gap-[6px]">
                  <Image
                    src="/red_ops.svg"
                    alt="reed_ops"
                    width={4}
                    height={4}
                  />
                  <p className="font-semibold text-md text-black">
                    Social Network
                  </p>
                </div>
                <div>
                  <SocialButtons />
                </div>
              </div>
              <div className="space-y-4 pl-3"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#3E3232] pl-52 bg-opacity-5 border py-4 mr-10 rounded-r-xl">
        <div className="container mx-auto flex justify-between items-center text-gray-600 text-sm pr-4">
          <div>
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>{" "}
            |{" "}
            <a href="#" className="hover:underline">
              Terms & Conditions
            </a>
          </div>
          <div className="text-[#3E3232BF]">
            All Copyright (C) {new Date().getFullYear()} Reserved
          </div>
        </div>
      </div>
    </div>
  );
}
