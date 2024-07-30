// src/components/Assignment/AssignmentCard.tsx

import React from "react";
import { Assignment } from "../../types/assignment";
import { formatDate, isOngoing } from "../../lib/dateUtils";
import { useNavigate } from "react-router-dom";

interface AssignmentCardProps {
	assignment: Assignment;
	user: any;
	handleClick: (id: number) => void;
	isAdmin: boolean; // Pass admin status as a prop
}

const AssignmentCard: React.FC<AssignmentCardProps> = ({
	assignment,
	user,
	handleClick,
	isAdmin,
}) => {
	const navigate = useNavigate();
	const userMarks = assignment.assignmentUsers.find(
		(assignmentUser) =>
			assignmentUser.assignmentUserRollNumber === user?.rollNumber,
	)?.assignmentUserCurrentMarks;

	// Check if the assignment is ongoing
	const ongoing = isOngoing(assignment);

	// Function to handle solve button click
	const handleSolveClick = () => {
		// Direct navigation for admin or ongoing assignment
		handleClick(assignment.assignmentId);
	};

	const handleUpdateClick = () => {
		// Direct navigation for admin or ongoing assignment
		navigate(`/assignment/update/${assignment.assignmentId}`);
	};
	return (
		<div key={assignment.assignmentId} className="mb-4">
			<div className="card bg-white w-full shadow-xl flex flex-row px-4">
				<div className="card-body px-2 w-3/4">
					<h2 className="card-title text-basecolor text-xl font-semibold">
						{assignment.assignmentName}
					</h2>
					<div className="flex flex-row text-basecolor">
						Marks: {userMarks}
						<div className="divider divider-horizontal"></div>
						Deadline: {formatDate(assignment.assignmentEndTime)}
					</div>
				</div>
				<div className="divider divider-horizontal py-4"></div>
				<div className="flex w-1/4 justify-center items-center m-2">
					<button
						className={`btn btn-primary w-1/2 text-white px-2 ${
							!isAdmin && !ongoing ? "disabled" : ""
						}`}
						onClick={handleSolveClick}
						disabled={!isAdmin && !ongoing}>
						{!isAdmin && !ongoing ? "Not Available" : "Solve"}
					</button>
					{isAdmin && <div className="divider divider-horizontal"></div>}
					{isAdmin && (
						<button
							className="btn btn-secondary w-1/2 text-white px-2"
							onClick={handleUpdateClick}>
							Update
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default AssignmentCard;
