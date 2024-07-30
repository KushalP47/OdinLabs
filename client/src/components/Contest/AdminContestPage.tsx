import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Utils/Navbar";
import { contestService } from "../../api/contestService";
import { Contest, ContestUser } from "../../types/contest";
import { Problem } from "../../types/problems";
import ProblemCard from "../../components/Problem/ProblemCard";
import Leaderboard from "../../components/Contest/Leaderboard";
import ErrorModal from "../Utils/ErrorModal";
import { useSelector } from "react-redux";
import StudentTable from "./StudentTable";

const AdminContestPage = () => {
	const { contestId } = useParams<{ contestId: string }>();
	if (!contestId) return <>ContestId not found</>;
	const [contest, setContest] = useState<Contest | null>(null);
	const [tab, setTab] = useState<"problems" | "leaderboard" | "students">(
		"problems",
	);
	const [contestProblems, setContestProblems] = useState<Problem[]>([]);
	const [leaderboard, setLeaderboard] = useState<ContestUser[]>([]);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [students, setStudents] = useState<ContestUser[]>([]);
	const user = useSelector((state: any) => state.auth.userData);

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
						setStudents(data.contest.contestUsers);
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

	return (
		<>
			{contest && (
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
									tab === "problems"
										? "bg-white text-secondary text-xl"
										: "text-xl"
								}`}
								onClick={() => setTab("problems")}>
								Problems
							</a>
							<a
								className={`tab ${
									tab === "students"
										? "bg-white text-secondary text-xl"
										: "text-xl"
								}`}
								onClick={() => setTab("students")}>
								Students
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
											return problem ? (
												<ProblemCard
													key={problem.problemId}
													problem={problem}
													problemStatus={undefined}
													contestId={contest.contestId}
												/>
											) : null;
										})}
									</div>
								</div>
							)}
							{tab === "students" && (
								<div className="w-full">
									<StudentTable students={students} />
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
			)}
		</>
	);
};

export default AdminContestPage;
