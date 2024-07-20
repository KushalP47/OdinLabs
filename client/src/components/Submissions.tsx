import { useEffect, useState } from "react";
import { Submission } from "../types/submissions";
import SubmissionDetails from "./SubmissionDetails";

type SubmissionsProps = {
	submissions: Submission[];
	problemId?: string | null;
};
const Submissions = ({ submissions, problemId = null }: SubmissionsProps) => {
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [submissionDetails, setSubmissionDetails] = useState<Submission | null>(
		null,
	);
	useEffect(() => {
		console.log("submissions...", submissions);
	}, [submissions]);

	const handleClick = (submission: Submission) => {
		setIsModalVisible(true);
		setSubmissionDetails(submission);
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};
	return (
		<>
			{problemId && (
				<table className="w-full rounded-xl text-basecolor border-collapse">
					<thead>
						<tr>
							<th className="px-4 py-2 border rounded-tl-xl">Problem ID</th>
							<th className="px-4 py-2 border">Submission ID</th>
							<th className="px-4 py-2 border">Status</th>
							<th className="px-4 py-2 border rounded-tr-xl">Submitted At</th>
						</tr>
					</thead>
					<tbody>
						{submissions.map((submission) => (
							<tr
								key={submission.submissionId}
								className="cursor-pointer hover:bg-gray-100 p-2 rounded"
								onClick={() => handleClick(submission)}>
								<td className="px-4 py-2 border">
									{submission.submissionProblemId}
								</td>
								<td className="px-4 py-2 border">{submission.submissionId}</td>
								<td className="px-4 py-2 border">
									{submission.submissionStatus}
								</td>
								<td className="px-4 py-2 border">{submission.createdAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{isModalVisible && (
				<SubmissionDetails
					submissionDetails={submissionDetails}
					closeModal={closeModal}
				/>
			)}

			{!problemId && (
				<table className="w-full">
					<thead>
						<tr className="text-basecolor font-bold">
							<th className="px-4 py-2 border rounded-tl-xl">Submission ID</th>
							<th className="px-4 py-2 border">Problem ID</th>
							<th className="px-4 py-2 border">Status</th>
							<th className="px-4 py-2 border rounded-tr-xl">Submitted At</th>
						</tr>
					</thead>
					<tbody>
						{submissions.map((submission) => (
							<tr
								key={submission.submissionId}
								className="text-basecolor text-center cursor-pointer hover:bg-gray-100 p-2 rounded"
								onClick={() => handleClick(submission)}>
								<td className="px-4 py-2 border">{submission.submissionId}</td>
								<td className="px-4 py-2 border">
									{submission.submissionProblemId}
								</td>
								<td className="px-4 py-2 border">
									{submission.submissionStatus}
								</td>
								<td className="px-4 py-2 border">{submission.createdAt}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);
};

export default Submissions;
