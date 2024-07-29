// src/components/UserPerformanceModal.tsx

import React from "react";
import { ProblemStatus } from "../../types/assignment"; // or "./contest" if you're using it from there
import { IoClose } from "react-icons/io5"; // Optional: using an icon for the close button

interface UserPerformanceModalProps {
	isOpen: boolean;
	onClose: () => void;
	problemStatuses: ProblemStatus[];
	userName: string; // To display the user's name at the top of the modal
}

const UserPerformanceModal: React.FC<UserPerformanceModalProps> = ({
	isOpen,
	onClose,
	problemStatuses,
	userName,
}) => {
	if (!isOpen) return null;

	// Calculate the total score
	const totalScore = problemStatuses.reduce(
		(acc, curr) => acc + curr.problemScore,
		0,
	);

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
				{/* Header */}
				<div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
					<h2 className="text-2xl font-semibold text-basecolor">
						Performance Summary - {userName}
					</h2>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600">
						<IoClose size={24} />
					</button>
				</div>

				{/* Table Content */}
				<div className="p-6">
					<table className="min-w-full divide-y divide-gray-200">
						<thead>
							<tr>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
									Problem ID
								</th>
								<th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 uppercase">
									Score
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{problemStatuses.map((problem, index) => (
								<tr key={index} className="hover:bg-gray-50">
									<td className="px-4 py-2 text-sm text-gray-800">
										{problem.problemId}
									</td>
									<td className="px-4 py-2 text-sm text-gray-800">
										{problem.problemScore}
									</td>
								</tr>
							))}
							{/* Total Score Row */}
							<tr className="bg-gray-100 font-semibold">
								<td className="px-4 py-2 text-sm text-gray-800">Total</td>
								<td className="px-4 py-2 text-sm text-gray-800">
									{totalScore}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default UserPerformanceModal;
