import Image from "next/image";

/**
 * SendPulse component for BlogHub dashboard.
 * Displays a skeleton UI for the send post form while loading.
 * @returns JSX.Element - The loading skeleton for send post
 */
export const SendPulse = () => {
  return (
    <>
      <div role="status" className="relative rounded-lg w-full mx-20">
        <div className="pt-16">
          <div className="flex h-screen gap-6 animate-pulse">
            {/* FIRST PART */}
            <div className="items-center flex-auto">
              <div className="flex gap-6 mb-5">
                {/* TITLE INPUT */}
                <div className="w-1/2">
                  {/* <label htmlFor="title" className="font-semibold mb-4">
                    Titre
                  </label> */}
                  <div className="w-full py-3 px-2 border border-gray-100 h-12 rounded-xl bg-[#F5F5F5]"></div>
                </div>

                {/* CATEGORIES INPUT */}
                <div className="w-1/2">
                  {/* <label htmlFor="categories" className="font-semibold mb-4">
                    Choisir une catégorie
                  </label> */}
                  <div className="w-full py-3 px-2 border border-gray-100 h-12 rounded-xl bg-[#F5F5F5]"></div>
                </div>
              </div>

              {/* TOOLBAR */}
              <div>
                {/* <p className="font-semibold">Explanation</p> */}
                <div className="shadow-lg p-5 rounded-xl border border-opacity-5">
                  <div className="w-full bg-[#F5F5F5] min-h-[350px] p-2 border rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* SECOND PART */}
            <div className="flex-auto">
              {/* <p className="font-semibold mb-4">Add Image</p> */}
              {/* Zone de Dropzone */}
              <div className="p-3 bg-[#F5F5F5] rounded-xl items-center mb-7">
                <div className="h-80 relative">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 w-full h-full flex flex-col justify-center items-center text-center bg-[#F5F5F5]">
                    <div className="text-gray-400 mb-2">
                      <Image
                        src="/dragndrop.svg"
                        alt="Preview"
                        width={96}
                        height={96}
                        className="rounded-lg"
                      />
                    </div>
                    <p className="text-[#3E3232] text-opacity-75 font-medium mt-9 mb-6 text-sm">
                      Drop image here, paste or
                    </p>
                    <label className="border group hover:bg-[#F81539] hover:text-[#F81539] hover:bg-opacity-10 flex items-center gap-2 mt-2 px-4 py-2 rounded-xl shadow-sm text-gray-600 transition duration-300 ease-in-out cursor-pointer">
                      <div className="relative w-4 h-4">
                        <Image
                          src="/add.svg"
                          alt="add"
                          width={14}
                          height={14}
                          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                        />
                        <Image
                          src="/add-hover.svg"
                          alt="link hover"
                          width={16}
                          height={16}
                          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </div>
                      <span className="font-semibold">Select</span>
                      <input type="file" className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-6 justify-center">
                {/* DRAFT BUTTON */}
                <button className="group hover:bg-[#F81539] text-[#3E3232] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl">
                  <div className="relative w-4 h-4">
                    {/* Icône normale */}
                    <Image
                      src="/draft.svg"
                      alt="draft"
                      width={16}
                      height={16}
                      className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                    />
                    {/* Icône au survol */}
                    <Image
                      src="/draft-hover.svg"
                      alt="draft hover"
                      width={16}
                      height={16}
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <span className="font-semibold text-opacity-75">Draft</span>
                </button>

                {/* PREVIEW BUTTON */}
                <button className="group hover:bg-[#F81539] text-[#3E3232] hover:text-white font-semibold transition duration-300 ease-in-out py-3 px-4 bg-gray-200 flex justify-center items-center gap-2 rounded-xl">
                  <div className="relative w-4 h-4">
                    {/* Icône normale */}
                    <Image
                      src="/preview.svg"
                      alt="preview"
                      width={16}
                      height={16}
                      className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
                    />
                    {/* Icône au survol */}
                    <Image
                      src="/preview-hover.svg"
                      alt="preview hover"
                      width={16}
                      height={16}
                      className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <span className="font-semibold text-opacity-75">Preview</span>
                </button>

                {/* PUBLIC BUTTON */}
                <button className="bg-[#F81539] bg-opacity-75 text-white flex gap-2 px-4 py-3 rounded-xl font-semibold hover:bg-[#F81539] transition duration-300 ease-in-out">
                  <Image
                    src="/public.svg"
                    alt="color"
                    width={16}
                    height={16}
                    className="hover:text-white transition-colors duration-300"
                  />
                  <span>Public</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

/**
 * LoadingMarked component for BlogHub dashboard.
 * Displays a skeleton UI for loading marked/bookmarked posts.
 * @returns JSX.Element - The loading skeleton for marked posts
 */
export const LoadingMarked = () => {
  return (
    <>
      <div role="status" className="relative rounded-lg w-full">
        <div className="container mx-auto animate-pulse">
          <div className="grid grid-cols-1 bg-[#E6E6E6] bg-opacity-15 rounded-xl sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white flex flex-col justify-between shadow-md border-2 border-gray-50 rounded-xl overflow-hidden p-3">
              <div className="text-gray-400 mb-2">
                <Image
                  src="/dragndrop.svg"
                  alt="Preview"
                  width={400}
                  height={200}
                  className="w-full h-48 rounded-xl "
                />
              </div>
              <div className="pt-4">
                <h3 className="text-md px-3 font-semibold line-clamp-1 text-[#3E3232]"></h3>
                <p className="text-gray-600 px-3 text-sm line-clamp-1 overflow-hidden mt-2"></p>
                <div className="w-full">
                  <div className="flex items-center justify-between mx-auto mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl">
                    <div className="flex items-center">
                      <div className="ml-2 text-sm ">
                        <p className="text-[#3E3232] font-semibold"></p>
                        <p className="text-[#3E3232] text-opacity-75"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="bg-white flex flex-col justify-between shadow-md border-2 border-gray-50 rounded-xl overflow-hidden p-3">
              <div className="text-gray-400 mb-2">
                <Image
                  src="/dragndrop.svg"
                  alt="Preview"
                  width={400}
                  height={200}
                  className="w-full h-48 rounded-xl "
                />
              </div>
              <div className="pt-4">
                <h3 className="text-md px-3 font-semibold line-clamp-1 text-[#3E3232]"></h3>
                <p className="text-gray-600 px-3 text-sm line-clamp-1 overflow-hidden mt-2"></p>
                <div className="w-full">
                  <div className="flex items-center justify-between mx-auto mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl">
                    <div className="flex items-center">
                      <div className="ml-2 text-sm ">
                        <p className="text-[#3E3232] font-semibold"></p>
                        <p className="text-[#3E3232] text-opacity-75"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/*  */}
            <div className="bg-white flex flex-col justify-between shadow-md border-2 border-gray-50 rounded-xl overflow-hidden p-3">
              <div className="text-gray-400 mb-2">
                <Image
                  src="/dragndrop.svg"
                  alt="Preview"
                  width={400}
                  height={200}
                  className="w-full h-48 rounded-xl "
                />
              </div>
              <div className="pt-4">
                <h3 className="text-md px-3 font-semibold line-clamp-1 text-[#3E3232]"></h3>
                <p className="text-gray-600 px-3 text-sm line-clamp-1 overflow-hidden mt-2"></p>
                <div className="w-full">
                  <div className="flex items-center justify-between mx-auto mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl">
                    <div className="flex items-center">
                      <div className="ml-2 text-sm ">
                        <p className="text-[#3E3232] font-semibold"></p>
                        <p className="text-[#3E3232] text-opacity-75"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
