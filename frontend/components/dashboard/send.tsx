import { useState } from "react";
import SendPost from "./Sending/sendPost";
import SendVideo from "./Sending/sendVideo";

export default function Send() {
  const [activeTab, setActiveTab] = useState("sendPost");

  const renderTab = () => {
    switch (activeTab) {
      case "sendPost":
        return <SendPost />;
      case "sendVideo":
        return <SendVideo />;
      default:
        return <SendPost />;
    }
  };

  return (
    <>
      <div>
        <div className="flex space-x-4">
          {["sendPost", "sendVideo"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-4 py-2 transition text-[#3E3232] font-semibold duration-300 ${
                activeTab === tab
                  ? "font-bold bg-[#F5F5F5] rounded-xl"
                  : "text-gray-600"
              }`}
            >
              <div className="flex gap-.5 items-center">
                <span
                  className={`rounded-full h-2 w-2 bg-[#F81539] transition-all duration-300 ${
                    activeTab === tab ? "-translate-x-1/2 scale-100" : "scale-0"
                  }`}
                ></span>
                {tab === "sendPost" ? "Send Post" : "Send Video"}
              </div>
            </button>
          ))}
        </div>
        <div className="mt-11">{renderTab()}</div>
      </div>
    </>
  );
}
