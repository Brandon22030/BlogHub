import Newsletter from "./footer/newsletter";
import NewComments from "./footer/newComments";
import Follow from "./footer/follow";

export default function Footer() {
  return (
    <>
      <div className="mt-[100px] flex gap-6 items-center mb-10">
        <Newsletter />
        <NewComments />
        <Follow />
      </div>
    </>
  );
}
