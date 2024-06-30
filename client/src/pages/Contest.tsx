import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Contest = () => {
	const [fullscreen, setFullscreen] = useState(false);

	const handleFullscreenChange = () => {
		setFullscreen(!!document.fullscreenElement);
	};

	//add the event listener to the document
	useEffect(() => {
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	});

	const toggleFullscreen = () => {
		if (!document.fullscreenElement) {
			document.documentElement.requestFullscreen().catch((err) => {
				console.error("Error attempting to enable full screen:", err.message);
			});
		} else {
			document.exitFullscreen();
		}
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
					{fullscreen ? "Exit Fullscreen" : "Fullscreen"}
				</button>

				{/* Content Section */}
				<div className="flex-1 overflow-auto">
					{/* Your content here */}
				</div>
			</div>
		</div>
	);
};

export default Contest;
