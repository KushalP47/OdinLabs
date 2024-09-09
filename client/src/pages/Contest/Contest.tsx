// src/pages/Contests.tsx

import { useEffect, useState } from "react";
import Navbar from "../../components/Utils/Navbar";
import { useSelector } from "react-redux";
import { contestService } from "../../api/contestService";
import { Contest } from "../../types/contest";
import { useNavigate } from "react-router-dom";
import ContestCard from "../../components/Contest/ContestCard";
import {
	isOngoingContest,
	isUpcomingContest,
	isCompletedContest,
} from "../../lib/dateUtils";
import ErrorModal from "../../components/Utils/ErrorModal";
import { set } from "date-fns";

const Contests = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const user = useSelector((state: any) => state.auth.userData);
	const isAdmin = user?.userIsAdmin;
	const [contests, setContests] = useState<Contest[]>([]);
	const navigate = useNavigate();
	const [errorModal, setErrorModal] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");
	const [serverTime, setServerTime] = useState<string>("");
	useEffect(() => {
		setStatus(currentStatus);
		if (currentStatus) {
			contestService
				.getAllContests()
				.then((data) => {
					setServerTime(data.serverTime);
					if (data.data.ok) {
						if (user?.userIsAdmin === false) {
							const userContests = data.data.contests.filter(
								(contest: Contest) =>
									contest.contestSection === user?.userSection,
							);
							setContests(userContests);
						} else {
							setContests(data.data.contests);
						}
					} else {
						setMessage(data.data.message);
						setErrorModal(true);
					}
				})
				.catch((err) => {
					setMessage("Error fetching contests" || err?.message);
					setErrorModal(true);
				});
		}
	}, [currentStatus]);

	const handleContestClick = (contestId: number) => {
		navigate(`/contest/${contestId}`);
	};

	const handleAddContest = () => {
		navigate("/contest/create");
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Contest" />
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{isAdmin && (
						<div className="flex flex-row justify-begin items-center m-4">
							<button
								onClick={handleAddContest}
								className="btn btn-primary btn-md text-lg mb-4 text-white">
								Add Contest
							</button>
						</div>
					)}
					{status ? (
						<div className="flex flex-col">
							{["Ongoing", "Upcoming", "Completed"].map((contestStatus) => (
								<div
									key={contestStatus}
									className="collapse collapse-arrow bg-gray-100 mb-4">
									<input
										type="checkbox"
										defaultChecked={contestStatus === "Ongoing"}
									/>
									<div className="collapse-title text-2xl font-bold text-secondary">
										{contestStatus} Contests
									</div>
									<div className="collapse-content">
										<div className="flex flex-col">
											{contests.map((contest) => {
												const isCurrentContest =
													contestStatus === "Ongoing" &&
													isOngoingContest(contest, serverTime);
												const isFutureContest =
													contestStatus === "Upcoming" &&
													isUpcomingContest(contest, serverTime);
												const isPastContest =
													contestStatus === "Completed" &&
													isCompletedContest(contest, serverTime);

												if (
													isCurrentContest ||
													isFutureContest ||
													isPastContest
												) {
													return (
														<ContestCard
															key={contest.contestId}
															contest={contest}
															user={user}
															handleClick={handleContestClick}
															isAdmin={isAdmin} // Pass admin status
														/>
													);
												}
												return null;
											})}
										</div>
									</div>
								</div>
							))}
						</div>
					) : (
						<h2 className="text-2xl text-basecolor">
							Please login to view this page
						</h2>
					)}
					{errorModal && (
						<ErrorModal
							message={message}
							isOpen={errorModal}
							onClose={() => setErrorModal(false)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Contests;
