import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import FullscreenModal from "../components/FullscreenModal";
import { useSelector } from "react-redux";

const Contest: React.FC = () => {
	const [fullscreen, setFullscreen] = useState<boolean>(false);
	const [showModal, setShowModal] = useState<boolean>(false);
	const [contestOngoing, setContestOngoing] = useState<boolean>(false); // Track contest state
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);

	useEffect(() => {
		const handleFullscreenChange = () => {
			setFullscreen(!!document.fullscreenElement);
			if (!document.fullscreenElement && contestOngoing) {
				setShowModal(true); // Show modal if exiting fullscreen during ongoing contest
			}
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);

		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, [contestOngoing]); // Include contestOngoing in dependency array

	useEffect(() => {
		setStatus(currentStatus);
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

	const handleStartContest = () => {
		setContestOngoing(true); // Start contest
		toggleFullscreen(); // Start fullscreen mode
	};

	const handleEndContest = () => {
		setContestOngoing(false); // End contest
		document.exitFullscreen(); // Exit fullscreen if still in fullscreen mode
	};

	const handleModalConfirm = () => {
		setShowModal(false);
		toggleFullscreen(); // Try to go fullscreen again
	};

	return (
		<div
			className={`flex flex-col min-h-screen ${
				fullscreen ? "fullscreen" : ""
			}`}>
			{/* Navbar */}
			<Navbar currentPage="Contest" />

			{/* Right Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				{status && (
					<>
						{/* Contest Button */}
						{contestOngoing ? (
							<button
								className="bg-red-500 hover:bg-red-700 text-black font-bold py-2 px-4 rounded"
								onClick={handleEndContest}>
								End Contest
							</button>
						) : (
							<button
								className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
								onClick={handleStartContest}>
								Start Contest (Fullscreen)
							</button>
						)}

						{/* Content Section */}
						<div className="flex-1 overflow-auto">
							{/* Your contest content here */}
						</div>
					</>
				)}
			</div>

			{/* Display message if user is not logged in */}
			{!status && (
				<h2 className="text-2xl text-basecolor">
					Please login to view this page
				</h2>
			)}

			{/* Fullscreen Modal */}
			{showModal && <FullscreenModal onConfirm={handleModalConfirm} />}

			{/* Style to freeze background when modal is active */}
			{showModal && (
				<div className="fixed top-0 left-0 w-screen h-screen bg-gray-700 bg-opacity-50 z-40" />
			)}
		</div>
	);
};

export default Contest;
