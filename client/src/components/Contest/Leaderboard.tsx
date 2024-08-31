import { ContestUser } from "../../types/contest";
import { codeExecutionService } from "../../api/codeExecutionService";
import { Submission } from "../../types/submissions";
import { useState } from "react";
// import { useSelector } from "react-redux";
import ErrorModal from "../Utils/ErrorModal";
import Submissions from "../Submission/Submissions";
interface LeaderboardTabProps {
	contestUsers: ContestUser[];
}

const LeaderboardTab = ({ contestUsers }: LeaderboardTabProps) => {
	const [submissionStatus, setSubmissionStatus] = useState<Submission[]>([]);
	// const user = useSelector((state: any) => state.auth.user);
	const [isErrorModalVisible, setIsErrorModalVisible] =
		useState<boolean>(false);
	const [errorModalMessage, setErrorModalMessage] = useState<string>("");
	const [submissionModalVisible, setSubmissionModalVisible] =
		useState<boolean>(false);
	const handleProblemClick = async (
		problemId: number,
		contestUserRollNumber: string,
	) => {
		// if (!user.userIsAdmin) return;
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
			// handle error
			setIsErrorModalVisible(true);
			setErrorModalMessage(resp.data.message);
		}
	};
	return (
		<div className="bg-white p-4 rounded-2xl shadow-md w-full mx-auto mt-5">
			<div className="overflow-x-auto">
				<table className="min-w-full bg-white border border-gray-200 rounded-lg">
					<thead>
						<tr className="bg-secondary text-white font-semibold">
							<th className="py-3 px-6 text-left">Rank</th>
							<th className="py-3 px-6 text-left">Name</th>
							<th className="py-3 px-6 text-left">Roll Number</th>
							{contestUsers[0].contestUserProblemStatus.map((problem) => (
								<th className="py-3 px-6 text-left">{problem.problemId}</th>
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
					<Submissions
						submissions={submissionStatus}
						closeSubmissionModal={() => setSubmissionModalVisible(false)}
					/>
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
