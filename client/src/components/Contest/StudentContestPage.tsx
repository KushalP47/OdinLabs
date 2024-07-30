import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { contestService } from "../../api/contestService";
import { Contest, ContestUser } from "../../types/contest";
import ProblemCard from "../../components/Problem/ProblemCard";
import Leaderboard from "../../components/Contest/Leaderboard";
import { Problem } from "../../types/problems";
import ErrorModal from "../Utils/ErrorModal";

const StudentContestPage = () => {
	const { contestId } = useParams<{ contestId: string }>();
	if (!contestId) return null;

	const user = useSelector((state: any) => state.auth.userData);
	const [contest, setContest] = useState<Contest | null>(null);
	const [tab, setTab] = useState<"problems" | "leaderboard">("problems");
	const [contestProblems, setContestProblems] = useState<Problem[]>([]);
	const [leaderboard, setLeaderboard] = useState<ContestUser[]>([]);

	// Error modal state
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");

	useEffect(() => {
		async function fetchContest() {
			try {
				if (!contestId) return;
				const { data } = await contestService.getContest(contestId);
				console.log(data);
				if (data.ok) {
					setContest(data.contest);
					// Fetch problems related to the contest
					const problems = await contestService.getContestProblems(
						data.contest.contestProblems,
					);
					console.log(problems);
					if (problems.data.ok) {
						setContestProblems(problems.data.problems);
						// Set leaderboard
						setLeaderboard(data.contest.contestUsers);
					} else {
						setErrorMessage(problems.data.error || "Failed to fetch problems."); // Set error message
						setIsModalOpen(true); // Open modal on error
					}
				} else {
					setErrorMessage(data.error || "Failed to fetch contest."); // Set error message
					setIsModalOpen(true); // Open modal on error
				}
			} catch (error: any) {
				setErrorMessage(error.message || "Failed to fetch contest."); // Set error message
				setIsModalOpen(true); // Open modal on error
			}
		}
		fetchContest();
	}, [contestId]);

	if (!contest) return <div>Loading...</div>;

	const contestUser = contest.contestUsers.find(
		(contestUser) => contestUser.contestUserRollNumber === user?.userRollNumber,
	);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar
				currentPage=""
				deadline={contest.contestEndTime}
				contestId={String(contest.contestId)}
			/>
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div className="tabs tabs-boxed mb-4 bg-gray-100 font-bold text-lg">
					<a
						className={`tab ${
							tab === "problems" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("problems")}>
						Problems
					</a>
					<a
						className={`tab ${
							tab === "leaderboard"
								? "bg-white text-secondary text-xl"
								: "text-xl"
						}`}
						onClick={() => setTab("leaderboard")}>
						Leaderboard
					</a>
				</div>
				<div className="flex">
					{tab === "problems" && (
						<div className="w-3/4 pr-4">
							<div className="grid grid-cols-1 gap-4 overflow-y-auto">
								{contestProblems.map((problem) => {
									const problemStatus =
										contestUser?.contestUserProblemStatus.find(
											(status) => status.problemId === problem.problemId,
										);
									return problem ? (
										<ProblemCard
											key={problem.problemId}
											problem={problem}
											problemStatus={problemStatus}
											contestId={contest.contestId}
										/>
									) : null;
								})}
							</div>
						</div>
					)}
					{tab === "problems" && (
						<div className="w-1/4 h-full rounded-lg bg-gray-100 p-4 text-basecolor text-lg">
							<h3 className="text-lg font-semibold mb-4 text-secondary">
								User Details
							</h3>
							{contestUser && (
								<div>
									<p>
										<strong>Student Name:</strong> {contestUser.contestUserName}
									</p>
									<p>
										<strong>Roll Number:</strong>{" "}
										{contestUser.contestUserRollNumber}
									</p>
									<p>
										<strong>Current Marks:</strong>{" "}
										{contestUser.contestUserCurrentMarks}
									</p>
								</div>
							)}
						</div>
					)}
					{tab === "leaderboard" && (
						<div className="w-full">
							<Leaderboard contestUsers={leaderboard} />
						</div>
					)}
				</div>
			</div>

			{/* Error Modal */}
			<ErrorModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				message={errorMessage}
			/>
		</div>
	);
};

export default StudentContestPage;
