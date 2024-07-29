// src/components/PastAssignmentsTable.tsx

import React, { useState, useEffect } from "react";
import { assignmentService } from "../../api/assignmentService";
import { Assignment, AssignmentUser } from "../../types/assignment";
import { useSelector } from "react-redux";
import UserPerformanceModal from "../User/UserPerformnaceModal";

interface AssignmentUserInfo {
	assignmentUser: AssignmentUser;
	assignment: Assignment;
}

const PastAssignmentsTable: React.FC = () => {
	const [assignmentUserPerformances, setAssignmentUserPerformances] = useState<
		AssignmentUserInfo[]
	>([]);
	const user = useSelector((state: any) => state.auth.userData);
	const [selectedAssignmentUser, setSelectedAssignmentUser] =
		useState<AssignmentUser | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		async function fetchAssignment() {
			try {
				const { data } = await assignmentService.getAllAssignments();
				console.log(data);
				if (data.ok) {
					console.log(user);
					const pastAssignments = data.assignments.filter(
						(assignment: Assignment) => {
							const currTime = new Date().getTime();
							const assignmentEndTime = new Date(
								assignment.assignmentEndTime,
							).getTime();
							return (
								assignmentEndTime < currTime &&
								assignment.assignmentSection === user?.userSection
							);
						},
					);
					console.log(pastAssignments);
					const performances: AssignmentUserInfo[] = pastAssignments
						.map((assignment: Assignment) => {
							const assignmentUser: AssignmentUser | undefined =
								assignment.assignmentUsers.find(
									(assignmentUser: AssignmentUser) =>
										assignmentUser.assignmentUserRollNumber ===
										user?.userRollNumber,
								);
							console.log(assignmentUser);
							console.log(assignment);
							if (assignmentUser !== undefined) {
								return {
									assignment,
									assignmentUser: assignmentUser,
								};
							}
						})
						.filter((item: any) => item !== undefined) as AssignmentUserInfo[];
					console.log(performances);
					setAssignmentUserPerformances(performances);
				}
			} catch (error) {
				console.error("Error fetching assignments:", error);
			}
		}

		fetchAssignment();
	}, []);

	// Open modal function
	const openModal = (assignmentUser: AssignmentUser) => {
		setSelectedAssignmentUser(assignmentUser);
		setIsModalOpen(true);
	};

	return (
		<div className="mt-10 w-full px-6 lg:px-10">
			<div className="shadow overflow-hidden border-b border-secondary rounded-lg">
				<table className="min-w-full bg-white divide-y divide-secondary">
					<thead className="bg-basecolor">
						<tr>
							<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
								Assignment ID
							</th>
							<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
								Assignment Name
							</th>
							<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
								Marks
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{assignmentUserPerformances.length > 0 ? (
							assignmentUserPerformances.map(
								(assignmentUserInfo: AssignmentUserInfo, index: number) => {
									return (
										<tr
											key={assignmentUserInfo.assignment.assignmentId}
											className={`hover:bg-gray-100 cursor-pointer ${
												index % 2 === 0 ? "bg-gray-50" : "bg-white"
											}`}
											onClick={() =>
												openModal(assignmentUserInfo.assignmentUser)
											}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-basecolor">
												{assignmentUserInfo.assignment.assignmentId}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-basecolor">
												{assignmentUserInfo.assignment.assignmentName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-basecolor">
												{
													assignmentUserInfo.assignmentUser
														.assignmentUserCurrentMarks
												}
											</td>
										</tr>
									);
								},
							)
						) : (
							<tr>
								<td
									colSpan={3}
									className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium text-gray-500">
									No past assignments found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* User Performance Modal */}
			{selectedAssignmentUser && (
				<UserPerformanceModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					problemStatuses={selectedAssignmentUser.assigmentUserProblemStatus}
					userName={user.userName} // Assuming userName is available here
				/>
			)}
		</div>
	);
};

export default PastAssignmentsTable;
