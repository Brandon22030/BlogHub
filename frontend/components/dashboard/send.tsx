import SendPost from "./Sending/sendPost";

/**
 * Send component for BlogHub dashboard.
 * Provides an interface for sending a post.
 * @returns JSX.Element - The send post section
 */
export default function Send() {
  return (
    <>
      <div>
        <div className="flex space-x-4 mx-20">
          {/* Tab buttons removed */}
        </div>
        <div className="mt-11">
          <SendPost />
        </div>
      </div>
    </>
  );
}
