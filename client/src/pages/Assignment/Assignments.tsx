import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { assignmentService } from "../../api/assignmentService";
import { Assignment } from "../../types/assignment";
import AssignmentCard from "../../components/Assignment/AssignmentCard";
import { isOngoing, isUpcoming, isCompleted } from "../../lib/dateUtils";

const Assignments = () => {
	const navigate = useNavigate();
	const currentStatus = useSelector((state: any) => state.auth.status);
	const user = useSelector((state: any) => state.auth.userData);
	const isAdmin = user?.isAdmin;
	const [assignments, setAssignments] = useState<Assignment[]>([]);

	useEffect(() => {
		async function getAssignments() {
			try {
				const { data } = await assignmentService.getAllAssignments();
				setAssignments(data.assignments);
			} catch (error) {
				console.error("Failed to fetch assignments", error);
			}
		}
		getAssignments();
	}, [currentStatus]);

	const handleAssignmentClick = (id: number) => {
		navigate(`/assignment/${id}`);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Assignment" />
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{isAdmin && (
						<div className="flex flex-row justify-end items-center m-4">
							<button className="btn btn-primary btn-md text-lg mb-4 text-white">
								Add Assignment
							</button>
						</div>
					)}
					{currentStatus ? (
						<div className="flex flex-col">
							{["Ongoing", "Upcoming", "Completed"].map((status) => (
								<div
									key={status}
									className="collapse collapse-arrow bg-gray-100 mb-4">
									<input
										type="checkbox"
										defaultChecked={status === "Ongoing"}
									/>
									<div className="collapse-title text-2xl font-bold text-secondary">
										{status} Assignments
									</div>
									<div className="collapse-content">
										<div className="flex flex-col">
											{assignments.map((assignment) => {
												const isCurrentAssignment =
													status === "Ongoing" && isOngoing(assignment);
												const isFutureAssignment =
													status === "Upcoming" && isUpcoming(assignment);
												const isPastAssignment =
													status === "Completed" && isCompleted(assignment);
												if (
													isCurrentAssignment ||
													isFutureAssignment ||
													isPastAssignment
												) {
													return (
														<AssignmentCard
															key={assignment.assignmentId}
															assignment={assignment}
															user={user}
															handleClick={handleAssignmentClick}
															isUpcoming={status === "Upcoming"}
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

export default Assignments;
