import { useEffect, useState } from "react";
import { ProblemStatus } from "../../types/assignment";
import { Problem } from "../../types/problems";
import { Link } from "react-router-dom";

interface ProblemCardProps {
	key: number;
	problem: Problem;
	problemStatus?: ProblemStatus;
	assignmentId?: number;
	contestId?: number;
}

const ProblemCard = ({
	key,
	problem,
	problemStatus,
	assignmentId,
	contestId,
}: ProblemCardProps) => {
	const getDifficultyClass = (difficulty: string) => {
		switch (difficulty) {
			case "Easy":
				return "font-bold text-success";
			case "Medium":
				return "font-bold text-warning";
			case "Hard":
				return "font-bold text-error";
			default:
				return "font-bold text-gray-500"; // Default class if difficulty is not matched
		}
	};
	const [problemLink, setProblemLink] = useState("");
	// Determine URL based on whether it is an assignment or contest
	useEffect(() => {
		console.log("assignmentId", assignmentId);
		console.log("contestId", contestId);
		console.log("key", key);
		if (assignmentId !== undefined) {
			console.log("problem Id", key);
			setProblemLink(
				`/assignment/${assignmentId}/problem/${problem.problemId}`,
			);
		} else if (contestId !== undefined) {
			console.log("problem Id", key);
			setProblemLink(`/contest/${contestId}/problem/${problem.problemId}`);
		} else {
			setProblemLink(`#`);
		}
	}, []);

	return (
		<div className="card bg-white shadow-xl p-4">
			<div className="flex flex-row justify-between items-center">
				<div className="w-2/3 flex flex-col">
					<h2 className="card-title text-xl font-semibold text-basecolor">
						{problem.problemTitle}
					</h2>
					<div className={`flex flex-col text-basecolor mb-4`}>
						<span className="flex flex-row">
							<p className={getDifficultyClass(problem.problemDifficulty)}>
								{problem.problemDifficulty}
							</p>
						</span>
						<span>Score: {problemStatus?.problemScore ?? "Not Attempted"}</span>
					</div>
				</div>
				<div className="divider divider-horizontal"></div>
				<div className="w-1/3 flex justify-center items-center">
					<Link to={problemLink}>
						<button className="btn btn-primary text-white">
							Solve Problem
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProblemCard;
