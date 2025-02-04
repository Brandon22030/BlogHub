import Image from "next/image";
import { NavBar } from "@/components/navBar";
import Home_Categories from "@/components/home_categories";

export default function Home() {
  return (
    <>
      <NavBar/>

      <Home_Categories/>
    </>
  );
}
