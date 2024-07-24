// src/pages/Contests.tsx

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
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

const Contests: React.FC = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const user = useSelector((state: any) => state.auth.userData);
	const isAdmin = user?.userIsAdmin;
	const [contests, setContests] = useState<Contest[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		setStatus(currentStatus);
		if (currentStatus) {
			contestService
				.getAllContests()
				.then((data) => {
					if (data.data.ok) setContests(data.data.contests);
					else console.error(data.data.message);
				})
				.catch((err) => {
					console.error(err);
				});
		}
	}, [currentStatus]);

	const handleContestClick = (contestId: number) => {
		navigate(`/contest/${contestId}`);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Contest" />
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{isAdmin && (
						<div className="flex flex-row justify-end items-center m-4">
							<button className="btn btn-primary btn-md text-lg mb-4 text-white">
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
													isOngoingContest(contest);
												const isFutureContest =
													contestStatus === "Upcoming" &&
													isUpcomingContest(contest);
												const isPastContest =
													contestStatus === "Completed" &&
													isCompletedContest(contest);

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
				</div>
			</div>
		</div>
	);
};

export default Contests;
