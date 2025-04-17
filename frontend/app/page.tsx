import Image from "next/image";
import { NavBar } from "@/components/navBar";
import Home_Categories from "@/components/home_categories";
import Mega_menu from "@/components/mega_categories";

import Banner from "@/components/homePage/banner";
import PopularPosts from "@/components/homePage/popularPosts";
import NewPosts from "@/components/homePage/newPosts";

export default function Home() {
  return (
    <>
      <NavBar />

      <Home_Categories />

      <Banner />

      <PopularPosts />

      <NewPosts />

      {/* <Mega_menu/> */}
    </>
  );
}
