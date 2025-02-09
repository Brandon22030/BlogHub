import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    id: 1,
    title: "Opening Day Of Boating Season, Seattle WA",
    description:
      "Of Course The Pacific Northwest Plays By Water, And When It Does, There’s Really Only One Way To Do It…",
    author: "James",
    date: "July 16, 2022",
    slug: "/categories/car",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
  {
    id: 2,
    title: "How To Choose The Right Laptop For...",
    description: "Choosing The Right Laptop For Blogging Depends On...",
    author: "Louis Halladay",
    slug: "/categories/car",
    date: "July 15, 2022",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
  {
    id: 3,
    title: "How To Choose The Right Laptop For...",
    description: "Choosing The Right Laptop For Blogging Depends On...",
    author: "Louis Halladay",
    slug: "/categories/car",
    date: "July 15, 2022",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
  {
    id: 4,
    title: "How To Choose The Right Laptop For...",
    description: "Choosing The Right Laptop For Blogging Depends On...",
    author: "Louis Halladay",
    slug: "/categories/car",
    date: "July 15, 2022",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
  {
    id: 5,
    title: "How To Choose The Right Laptop For...",
    description: "Choosing The Right Laptop For Blogging Depends On...",
    author: "Louis Halladay",
    slug: "/categories/car",
    date: "July 15, 2022",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
  {
    id: 6,
    title: "How To Choose The Right Laptop For...",
    description: "Choosing The Right Laptop For Blogging Depends On...",
    author: "Louis Halladay",
    slug: "/categories/car",
    date: "July 15, 2022",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
  {
    id: 7,
    title: "How To Choose The Right Laptop For...",
    description: "Choosing The Right Laptop For Blogging Depends On...",
    author: "Louis Halladay",
    slug: "/categories/car",
    date: "July 15, 2022",
    image: "/mega_car.svg",
    avatar: "/avatar.svg",
  },
];

export default function Marked() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 bg-[#E6E6E6] bg-opacity-15 rounded-xl sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link key={article.id} href={article.slug}>
              <div
                // key={article.id}
                className="bg-white flex flex-col justify-between shadow-md border-2 border-gray-50 rounded-xl overflow-hidden p-3"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  width={400}
                  height={250}
                  className="w-full h-48 rounded-xl object-cover"
                />
                <div className="pt-4">
                  <h3 className="text-md px-3 font-semibold line-clamp-1 text-[#3E3232]">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 px-3 text-sm line-clamp-2 overflow-hidden mt-2">
                    {article.description}
                  </p>
                  <div className="w-full">
                    <div className="flex items-center justify-between mx-auto mt-4 bg-[#F5F5F5] py-3 px-4 rounded-xl">
                      <div className="flex items-center">
                        <Image
                          src={article.avatar}
                          alt={article.author}
                          width={30}
                          height={30}
                          className="w-11 h-11 rounded-xl object-cover"
                        />
                        <div className="ml-2 text-sm ">
                          <p className="text-[#3E3232] font-semibold">
                            {article.author}
                          </p>
                          <p className="text-[#3E3232] text-opacity-75">
                            {article.date}
                          </p>
                        </div>
                      </div>
                      <Image
                        src="/signet.svg"
                        alt="signet"
                        width={30}
                        height={30}
                        className="w-10 h-10 "
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
