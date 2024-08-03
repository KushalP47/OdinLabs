import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../components/Utils/Navbar";
import { assignmentService } from "../../api/assignmentService";
import { Assignment } from "../../types/assignment";
import { Problem } from "../../types/problems";
import ProblemCard from "../../components/Problem/ProblemCard";
import TeamLeaderboard from "../../components/Assignment/TeamLeaderboard";
import ErrorModal from "../../components/Utils/ErrorModal";
import { useNavigate } from "react-router-dom";

const AssignmentDetail = () => {
	const { assignmentId } = useParams<{ assignmentId: string }>();
	if (!assignmentId) return null;
	console.log(assignmentId);
	const navigate = useNavigate();
	const user = useSelector((state: any) => state.auth.userData);
	const [assignment, setAssignment] = useState<Assignment | null>(null);
	const [tab, setTab] = useState<"problems" | "leaderboard">("problems");
	const [assignmentProblems, setAssignmentProblems] = useState<Problem[]>([]);
	const [message, setMessage] = useState<string>("");
	const [errorModal, setErrorModal] = useState<boolean>(false);

	useEffect(() => {
		async function fetchAssignment() {
			try {
				if (!assignmentId) return;
				const resp = await assignmentService.getAssignment(assignmentId);
				console.log(resp);
				if (resp.data.ok) {
					console.log(resp.data.message);
					const problems = await assignmentService.getAssignmentProblems(
						resp.data.assignment.assignmentProblems,
					);
					console.log(problems);
					if (!problems.data.ok) {
						setMessage(problems.data.message);
						setErrorModal(true);
					} else {
						setAssignmentProblems(problems.data.problems);
						setAssignment(resp.data.assignment);
					}
				} else if (resp.statusCode === 402) {
					navigate("/assignment");
				} else {
					setMessage(resp.data.message);
					setErrorModal(true);
				}
			} catch (error) {
				setMessage("Error fetching assignment");
				setErrorModal(true);
			}
		}
		fetchAssignment();
	}, [assignmentId]);

	if (!assignment) return <div>Loading...</div>;

	const assignmentUser = assignment.assignmentUsers.find(
		(assignmentUser) =>
			assignmentUser.assignmentUserRollNumber === user?.userRollNumber,
	);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar
				currentPage=""
				deadline={assignment.assignmentEndTime}
				assignmentId={String(assignment.assignmentId)}
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
								{assignmentProblems.map((problem) => {
									const problemStatus =
										assignmentUser?.assigmentUserProblemStatus.find(
											(status) => status.problemId === problem.problemId,
										);
									console.log(problemStatus);
									return problem ? (
										<ProblemCard
											key={problem.problemId}
											problem={problem}
											problemStatus={problemStatus}
											assignmentId={assignment.assignmentId}
											contestId={undefined}
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
							{assignmentUser && (
								<div>
									<p>
										<strong>Roll Number:</strong>{" "}
										{assignmentUser.assignmentUserRollNumber}
									</p>
									<p>
										<strong>Current Marks:</strong>{" "}
										{assignmentUser.assignmentUserCurrentMarks}
									</p>
									<p>
										<strong>Team Name:</strong>{" "}
										{assignmentUser.assignmentUserTeamName}
									</p>
								</div>
							)}
						</div>
					)}
					{tab === "leaderboard" && (
						<div className="w-full">
							<TeamLeaderboard assignmentUsers={assignment.assignmentUsers} />
						</div>
					)}
				</div>
				{errorModal && (
					<ErrorModal
						message={message}
						isOpen={errorModal}
						onClose={() => setErrorModal(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default AssignmentDetail;
