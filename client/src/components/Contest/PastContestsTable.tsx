// src/components/PastContestsTable.tsx

import React, { useState, useEffect } from "react";
import { contestService } from "../../api/contestService";
import { Contest, ContestUser } from "../../types/contest";
import { useSelector } from "react-redux";
import UserPerformanceModal from "../User/UserPerformnaceModal";

interface ContestUserInfo {
	contestUser: ContestUser;
	contest: Contest;
}

const PastContestsTable: React.FC = () => {
	const [contestUserPerformances, setContestUserPerformances] = useState<
		ContestUserInfo[]
	>([]);
	const user = useSelector((state: any) => state.auth.userData);
	const [selectedContestUser, setSelectedContestUser] =
		useState<ContestUser | null>(null);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	useEffect(() => {
		async function fetchContest() {
			try {
				const { data } = await contestService.getAllContests();
				console.log(data);
				if (data.ok) {
					console.log(user);
					const pastContests = data.contests.filter((contest: Contest) => {
						const currTime = new Date().getTime();
						const contestEndTime = new Date(contest.contestEndTime).getTime();
						return (
							contestEndTime < currTime &&
							contest.contestSection === user?.userSection
						);
					});
					console.log(pastContests);
					const performances: ContestUserInfo[] = pastContests
						.map((contest: Contest) => {
							const contestUser: ContestUser | undefined =
								contest.contestUsers.find(
									(contestUser: ContestUser) =>
										contestUser.contestUserRollNumber === user?.userRollNumber,
								);
							console.log(contestUser);
							console.log(contest);
							if (contestUser !== undefined) {
								return {
									contest,
									contestUser: contestUser,
								};
							}
						})
						.filter((item: any) => item !== undefined) as ContestUserInfo[];
					console.log(performances);
					setContestUserPerformances(performances);
				}
			} catch (error) {
				console.error("Error fetching contests:", error);
			}
		}

		fetchContest();
	}, []);

	// Open modal function
	const openModal = (contestUser: ContestUser) => {
		setSelectedContestUser(contestUser);
		setIsModalOpen(true);
	};

	return (
		<div className="mt-10 w-full px-6 lg:px-10">
			<div className="shadow overflow-hidden border-b border-secondary rounded-lg">
				<table className="min-w-full bg-white divide-y divide-secondary">
					<thead className="bg-basecolor">
						<tr>
							<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
								Contest ID
							</th>
							<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
								Contest Name
							</th>
							<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
								Marks
							</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-gray-200">
						{contestUserPerformances.length > 0 ? (
							contestUserPerformances.map(
								(contestUserInfo: ContestUserInfo, index: number) => {
									return (
										<tr
											key={contestUserInfo.contest.contestId}
											className={`hover:bg-gray-100 cursor-pointer ${
												index % 2 === 0 ? "bg-gray-50" : "bg-white"
											}`}
											onClick={() => openModal(contestUserInfo.contestUser)}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-basecolor">
												{contestUserInfo.contest.contestId}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-basecolor">
												{contestUserInfo.contest.contestName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-basecolor">
												{contestUserInfo.contestUser.contestUserCurrentMarks}
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
									No past contests found
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* User Performance Modal */}
			{selectedContestUser && (
				<UserPerformanceModal
					isOpen={isModalOpen}
					onClose={() => setIsModalOpen(false)}
					problemStatuses={selectedContestUser.contestUserProblemStatus}
					userName={selectedContestUser.contestUserName}
				/>
			)}
		</div>
	);
};

export default PastContestsTable;
