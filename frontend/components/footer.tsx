import Newsletter from "./footer/newsletter";
import NewComments from "./footer/newComments";
import Follow from "./footer/follow";

/**
 * Footer component for the BlogHub application.
 * Renders newsletter signup, new comments, and follow sections.
 * @returns JSX.Element - The footer section of the app
 */
export default function Footer() {
  return (
    <>
      <div className="mt-[100px] flex gap-6 items-center">
        <Newsletter />
        <NewComments />
        <Follow />
      </div>
    </>
  );
}

