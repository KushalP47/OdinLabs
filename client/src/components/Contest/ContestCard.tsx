// src/components/Contest/ContestCard.tsx

import React, { useState } from "react";
import { Contest } from "../../types/contest";
import { formatDate, isOngoingContest } from "../../lib/dateUtils";
import ConfirmationModal from "./ConfirmationModal";
import { contestService } from "../../api/contestService";
interface ContestCardProps {
	contest: Contest;
	user: any;
	handleClick: (id: number) => void;
	isAdmin: boolean; // Pass admin status as a prop
}

const ContestCard: React.FC<ContestCardProps> = ({
	contest,
	user,
	handleClick,
	isAdmin,
}) => {
	const userMarks = contest.contestUsers.find(
		(contestUser) => contestUser.contestUserRollNumber === user?.rollNumber,
	)?.contestUserCurrentMarks;

	// Check if the contest is ongoing
	const ongoing = isOngoingContest(contest);

	// State for modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	// Function to handle join button click
	const handleJoinClick = () => {
		if (isAdmin) {
			// Direct navigation for admin or ongoing contest
			handleClick(contest.contestId);
		} else {
			// Open confirmation modal for students if contest is not ongoing
			setIsModalOpen(true);
		}
	};

	// Function to confirm join
	const confirmJoin = () => {
		try {
			setIsModalOpen(false);
			const res = async () => {
				await contestService
					.signInContest(String(contest.contestId))
					.then((response) => {
						console.log(response);
						if (response.data) {
							handleClick(contest.contestId);
						} else {
							console.error("Failed has already joined the contest once");
						}
					});
			};
			res();
			// handleClick(contest.contestId);
		} catch (error) {
			console.error("Failed to join contest", error);
		}
	};

	return (
		<div key={contest.contestId} className="mb-4">
			<div className="card bg-white w-full shadow-xl flex flex-row px-4">
				<div className="card-body px-2 w-3/4">
					<h2 className="card-title text-basecolor text-xl font-semibold">
						{contest.contestName}
					</h2>
					<div className="flex flex-row text-basecolor">
						{userMarks !== undefined && (
							<>
								Marks: {userMarks}
								<div className="divider divider-horizontal"></div>
							</>
						)}
						Start: {formatDate(contest.contestStartTime)}
						<div className="divider divider-horizontal"></div>
						End: {formatDate(contest.contestEndTime)}
					</div>
				</div>
				<div className="divider divider-horizontal py-4"></div>
				<div className="flex w-1/4 justify-center items-center">
					<button
						className={`btn btn-primary w-1/2 text-white px-2 ${
							!isAdmin && !ongoing ? "disabled" : ""
						}`}
						onClick={handleJoinClick}
						disabled={!isAdmin && !ongoing}>
						{!isAdmin && !ongoing ? "Not Available" : "Join"}
					</button>
				</div>
			</div>

			{/* Confirmation Modal */}
			<ConfirmationModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onConfirm={confirmJoin}
			/>
		</div>
	);
};

export default ContestCard;
