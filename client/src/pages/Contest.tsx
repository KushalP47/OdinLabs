import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FullscreenModal from "../components/FullscreenModal";

const Contest: React.FC = () => {
  const [fullscreen, setFullscreen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
      if (!document.fullscreenElement) {
        setShowModal(true); // Show modal if exiting fullscreen
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err.message);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    toggleFullscreen(); // Try to go fullscreen again
  };

  return (
    <div className={`flex min-h-screen ${fullscreen ? "fullscreen" : ""}`}>
      {/* Navbar */}
      <Navbar currentPage="Contest" />

      {/* Right Section */}
      <div className="bg-white w-5/6 border-4 border-blue shadow-xl flex flex-col p-8">
        {/* Title Section */}
        <div className="flex justify-start mb-8">
          <h1 className="text-4xl font-bold">Contest</h1>
        </div>

        {/* Fullscreen Button */}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
          onClick={toggleFullscreen}
        >
          {fullscreen ? "Exit Fullscreen" : "Start Contest (Fullscreen)"}
        </button>

        {/* Content Section */}
        <div className="flex-1 overflow-auto">
          {/* Your contest content here */}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showModal && <FullscreenModal onConfirm={handleModalConfirm} />}
      
      {/* Style to freeze background when modal is active */}
      {showModal && <div className="fixed top-0 left-0 w-screen h-screen bg-gray-700 bg-opacity-50 z-40" />}
    </div>
  );
};

export default Contest;
