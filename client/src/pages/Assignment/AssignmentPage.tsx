import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import ProblemsTable from "../../components/ProblemsTable";
import { Assignment } from "../../types/assignment";
import { assignmentService } from "../../api/assignmentService";
import { Problem } from "../../types/problems";

const AssignmentPage = () => {
	const { assignmentId } = useParams();
	const [assignment, setAssignment] = useState<Assignment | null>(null);
	const [problems, setProblems] = useState<Problem[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function getAssignment() {
			if (!assignmentId) return;
			console.log(assignmentId);
			const data = await assignmentService.getAssignment(assignmentId);
			const newAssignment: Assignment = {
				assignmentId: data.assignment.assignmentId,
				assignmentName: data.assignment.assignmentName,
				assignmentProblems: data.assignment.assignmentProblems,
				assignmentStartTime: data.assignment.assignmentStartTime,
				assignmentEndTime: data.assignment.assignmentEndTime,
				assignmentDescription: data.assignment.assignmentDescription,
				assignmentUsers: data.assignment.assignmentUsers,
				assignmentTeamLeaderboard: data.assignment.assignmentTeamLeaderboard,
			};
			setAssignment(newAssignment);
		}
		getAssignment();
	}, []);

	useEffect(() => {
		if (assignment) {
			assignmentService
				.getAssignmentProblems(assignment.assignmentProblems)
				.then((data) => {
					setProblems(data.problems);
					setLoading(false);
				});
		}
	}, [assignment]);

	return (
		<div>
			<Navbar currentPage="Assignment" />
			<div className="bg-white min-h-screen w-full">
				{assignment && (
					<h1 className="text-3xl text-basecolor text-center">
						{assignment.assignmentName}
					</h1>
				)}
				{problems && (
					<ProblemsTable
						problems={problems}
						deadline={assignment?.assignmentEndTime}
					/>
				)}
			</div>
		</div>
	);
};

export default AssignmentPage;
