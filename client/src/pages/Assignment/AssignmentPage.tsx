import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import ProblemsTable from "../../components/ProblemsTable";
import { Assignment } from "../../types/assignment";

const AssignmentPage = () => {
	const { assignmentId } = useParams();
	const [assignment, setAssignment] = useState<Assignment | null>(null);
	useEffect(() => {
		// Fetch assignment details
	}, []);
	return (
		<div>
			<Navbar currentPage="Assignment" />
			<div className="bg-white min-h-screen w-full">
				<h1 className="text-3xl text-basecolor text-center">
					{assignment?.assignmentName || "Assignment 1"}
				</h1>
				<div className="flex justify-center mt-4">
					<p className="text-lg text-basecolor">
						Deadline: {assignment?.assignmentEndTime || "2021-10-10"}
					</p>
				</div>
				{assignment?.assignmentProblems && (
					<ProblemsTable problems={assignment?.assignmentProblems} />
				)}
			</div>
		</div>
	);
};

export default AssignmentPage;
