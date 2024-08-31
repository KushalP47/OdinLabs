import { ContestUser } from "../../types/contest";
import { codeExecutionService } from "../../api/codeExecutionService";
import { Submission } from "../../types/submissions";
import { useState } from "react";
// import { useSelector } from "react-redux"; // Uncomment if using Redux
import ErrorModal from "../Utils/ErrorModal";
import Submissions from "../Submission/Submissions";

interface LeaderboardTabProps {
	contestUsers: ContestUser[];
}

const LeaderboardTab = ({ contestUsers }: LeaderboardTabProps) => {
	const [submissionStatus, setSubmissionStatus] = useState<Submission[]>([]);
	const userData = localStorage.getItem("userData");
	if (!userData) return <>User data not found</>;
	const user = JSON.parse(userData);
	const [isErrorModalVisible, setIsErrorModalVisible] =
		useState<boolean>(false);
	const [errorModalMessage, setErrorModalMessage] = useState<string>("");
	const [submissionModalVisible, setSubmissionModalVisible] =
		useState<boolean>(false);

	const handleProblemClick = async (
		problemId: number,
		contestUserRollNumber: string,
	) => {
		if (!user.userIsAdmin) return;
		const resp = await codeExecutionService.getContestUserProblemStatus(
			String(problemId),
			contestUserRollNumber,
		);
		console.log(resp);
		if (resp.data.ok) {
			console.log(resp.data.data);
			setSubmissionStatus(resp.data.data);
			setSubmissionModalVisible(true);
		} else {
			setIsErrorModalVisible(true);
			setErrorModalMessage(resp.data.message || resp.message);
		}
	};

	const downloadCSV = () => {
		const headers = [
			"Rank",
			"Name",
			"Roll Number",
			...contestUsers[0].contestUserProblemStatus.map(
				(_, idx) => `Problem ${idx + 1}`,
			),
			"Marks",
		];
		const rows = contestUsers
			.sort((a, b) => b.contestUserCurrentMarks - a.contestUserCurrentMarks)
			.map((user, index) => [
				index + 1,
				user.contestUserName,
				user.contestUserRollNumber,
				...user.contestUserProblemStatus.map((problem) => problem.problemScore),
				user.contestUserCurrentMarks,
			]);

		let csvContent =
			"data:text/csv;charset=utf-8," +
			[headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
		var encodedUri = encodeURI(csvContent);
		var link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "leaderboard.csv");
		document.body.appendChild(link); // Required for FF

		link.click();
	};

	return (
		<div className="bg-white p-4 rounded-2xl shadow-md w-full mx-auto mt-5">
			<div className="overflow-x-auto">
				{user.userIsAdmin && (
					<div className="flex justify-end">
						<button
							onClick={downloadCSV}
							className="btn text-white  btn-success mb-4">
							Download
						</button>
					</div>
				)}
				<table className="min-w-full bg-white border border-gray-200 rounded-lg">
					<thead>
						<tr className="bg-secondary text-white font-semibold">
							<th className="py-3 px-6 text-left">Rank</th>
							<th className="py-3 px-6 text-left">Name</th>
							<th className="py-3 px-6 text-left">Roll Number</th>
							{contestUsers[0].contestUserProblemStatus.map((problem) => (
								<th key={problem.problemId} className="py-3 px-6 text-left">
									{problem.problemId}
								</th>
							))}
							<th className="py-3 px-6 text-left">Marks</th>
						</tr>
					</thead>
					<tbody>
						{contestUsers
							.sort(
								(a, b) => b.contestUserCurrentMarks - a.contestUserCurrentMarks,
							)
							.map((user, index) => (
								<tr
									key={user.contestUserRollNumber}
									className={`border-t border-gray-200 ${
										index % 2 === 0 ? "bg-gray-50" : "bg-white"
									}`}>
									<td className="py-3 px-6 font-semibold text-gray-700">
										{index + 1}
									</td>
									<td className="py-3 px-6 font-semibold text-gray-700">
										{user.contestUserName}
									</td>
									<td className="py-3 px-6 font-semibold text-gray-700">
										{user.contestUserRollNumber}
									</td>
									{user.contestUserProblemStatus.map((problem) => (
										<td
											key={problem.problemId}
											className="py-3 px-6 font-semibold text-gray-700"
											onClick={() =>
												handleProblemClick(
													problem.problemId,
													user.contestUserRollNumber,
												)
											}>
											{problem.problemScore}
										</td>
									))}
									<td className="py-3 px-6 font-semibold text-gray-700">
										{user.contestUserCurrentMarks} Marks
									</td>
								</tr>
							))}
					</tbody>
				</table>
				{submissionModalVisible && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
						<div className="bg-white rounded-lg shadow-lg p-6 w-3/5 mx-auto flex flex-col items-center">
							<h2 className="text-xl font-semibold mb-4 text-basecolor text-center">
								Submissions
							</h2>
							<Submissions submissions={submissionStatus} />
							<button
								className="btn btn-error text-white px-4 py-2 mt-4 rounded text-lg hover:bg-red-600"
								onClick={() => setSubmissionModalVisible(false)}>
								Close
							</button>
						</div>
					</div>
				)}
				{isErrorModalVisible && (
					<ErrorModal
						isOpen={isErrorModalVisible}
						onClose={() => setIsErrorModalVisible(false)}
						message={errorModalMessage}
					/>
				)}
			</div>
		</div>
	);
};

export default LeaderboardTab;
