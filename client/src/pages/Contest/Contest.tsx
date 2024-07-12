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
	const user = useSelector((state: any) => state.auth.userData);
	const isAdmin = user?.isAdmin;
	const contests = [
		{
			id: 1,
			title: "Contest 1",
			status: "Completed",
			marks: 100,
			duration: "2 hours",
			start: "2021-10-10 10:00:00",
		},
		{
			id: 2,
			title: "Contest 2",
			status: "Completed",
			marks: 100,
			duration: "2 hours",
			start: "2021-10-10 10:00:00",
		},
		{
			id: 3,
			title: "Contest 3",
			status: "Ongoing",
			marks: 100,
			duration: "2 hours",
			start: "2021-10-10 10:00:00",
		},
		{
			id: 4,
			title: "Contest 4",
			status: "Upcoming",
			marks: 100,
			duration: "2 hours",
			start: "2021-10-10 10:00:00",
		},
	];
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
							<div>
								<div className="flex flex-row justify-end items-center m-4">
									{isAdmin && (
										<button className="btn btn-primary btn-md text-lg mb-4 text-white">
											Add Contest
										</button>
									)}
								</div>
								{status && (
									<div className="flex flex-col">
										<div className="collapse collapse-arrow bg-gray-100 mb-4">
											<input type="checkbox" defaultChecked />
											<div className="collapse-title text-2xl font-bold text-secondary">
												Ongoing Contest
											</div>
											<div className="collapse-content">
												<div className="flex flex-col">
													{contests.map((contest) =>
														contest.status === "Ongoing" ? (
															<div key={contest.id} className="mb-4">
																<div className="card bg-white w-full shadow-xl flex flex-row px-4">
																	<div className="card-body px-2 w-3/4">
																		<h2 className="card-title text-basecolor text-xl font-semibold">
																			{contest.title}
																		</h2>
																		<div className="flex flex-row text-basecolor">
																			Marks: {contest.marks}
																			<div className="divider divider-horizontal"></div>
																			Duration: {contest.duration}
																			<div className="divider divider-horizontal"></div>
																			Start: {contest.start}
																		</div>
																	</div>
																	<div className="divider divider-horizontal py-4"></div>
																	<div className="flex w-1/4 justify-center items-center">
																		<button
																			className="btn btn-primary w-1/2 text-white px-2"
																			onClick={handleStartContest}>
																			Start
																		</button>
																	</div>
																</div>
															</div>
														) : null,
													)}
												</div>
											</div>
										</div>
										<div className="collapse collapse-arrow bg-gray-100 mb-4">
											<input type="checkbox" />
											<div className="collapse-title text-2xl font-bold text-secondary">
												Upcoming Contests
											</div>
											<div className="collapse-content">
												<div className="flex flex-col">
													{contests.map((contest) =>
														contest.status === "Upcoming" ? (
															<div key={contest.id} className="mb-4">
																<div className="card bg-white w-full shadow-xl flex flex-row px-4">
																	<div className="card-body px-2 w-3/4">
																		<h2 className="card-title text-basecolor text-xl font-semibold">
																			{contest.title}
																		</h2>
																		<div className="flex flex-row text-basecolor">
																			Marks: {contest.marks}
																			<div className="divider divider-horizontal"></div>
																			Duration: {contest.duration}
																			<div className="divider divider-horizontal"></div>
																			Start: {contest.start}
																		</div>
																	</div>
																	<div className="divider divider-horizontal py-4"></div>
																	<div className="flex w-1/4 justify-center items-center">
																		<button
																			disabled
																			className="btn btn-primary w-1/2 text-white px-2">
																			Start
																		</button>
																	</div>
																</div>
															</div>
														) : null,
													)}
												</div>
											</div>
										</div>
										<div className="collapse collapse-arrow bg-gray-100 mb-4">
											<input type="checkbox" />
											<div className="collapse-title text-2xl font-bold text-secondary">
												Completed Contests
											</div>
											<div className="collapse-content">
												<div className="flex flex-col">
													{contests.map((contest) =>
														contest.status === "Completed" ? (
															<div key={contest.id} className="mb-4">
																<div className="card bg-white w-full shadow-xl flex flex-row px-4">
																	<div className="card-body px-2 w-3/4">
																		<h2 className="card-title text-basecolor text-xl font-semibold">
																			{contest.title}
																		</h2>
																		<div className="flex flex-row text-basecolor">
																			Marks: {contest.marks}
																			<div className="divider divider-horizontal"></div>
																			Duration: {contest.duration}
																			<div className="divider divider-horizontal"></div>
																			Start: {contest.start}
																		</div>
																	</div>
																	<div className="divider divider-horizontal py-4"></div>
																	<div className="flex w-1/4 justify-center items-center">
																		<button className="btn btn-primary w-1/2 text-white px-2">
																			Visit
																		</button>
																	</div>
																</div>
															</div>
														) : null,
													)}
												</div>
											</div>
										</div>
									</div>
								)}
								{!status && (
									<h2 className="text-2xl text-basecolor">
										Please login to view this page
									</h2>
								)}
							</div>
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
