import React, { useState } from "react";
import { Contest } from "../../types/contest";
import { formatDate, isOngoingContest } from "../../lib/dateUtils";
import ConfirmationModal from "./ConfirmationModal";
import { contestService } from "../../api/contestService";
import ErrorModal from "../Utils/ErrorModal";
import { setContestData } from "../../store/contestSlice";
import { getCookie } from "../../lib/cookieUtility";
import { useDispatch } from "react-redux";
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
	const dispatch = useDispatch();
	const userMarks = contest.contestUsers.find(
		(contestUser) => contestUser.contestUserRollNumber === user?.rollNumber,
	)?.contestUserCurrentMarks;

	// Check if the contest is ongoing
	const ongoing = isOngoingContest(contest);

	// State for confirmation modal
	const [isModalOpen, setIsModalOpen] = useState(false);

	// State for error modal
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

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
						if (response.data.ok) {
							// Dispatch the updated contest data
							const customContestCookie = getCookie("customContestCookie");
							dispatch(
								setContestData({
									customContestCookie,
									contestId: contest.contestId,
								}),
							);
							handleClick(contest.contestId);
						} else {
							// Set error message and open error modal
							setErrorMessage(response.message);
							setIsErrorModalOpen(true);
						}
					});
			};
			res();
		} catch (error) {
			// Handle error and show error modal
			setErrorMessage("Failed to join contest. Please try again later.");
			setIsErrorModalOpen(true);
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

			{/* Error Modal */}
			<ErrorModal
				isOpen={isErrorModalOpen}
				onClose={() => setIsErrorModalOpen(false)}
				message={errorMessage}
			/>
		</div>
	);
};

export default ContestCard;
