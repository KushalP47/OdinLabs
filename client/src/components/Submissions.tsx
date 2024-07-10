import { useEffect } from "react";
import { Submission } from "../types/submissions";

type SubmissionsProps = {
	submissions: Submission[];
	problemId?: string | null;
};
const Submissions = ({ submissions, problemId = null }: SubmissionsProps) => {
	useEffect(() => {
		console.log("submissions...", submissions);
	}, [submissions]);

	return (
		<>
			{problemId && (
				<table>
					<thead>
						<tr>
							<th>Problem ID</th>
							<th>Submission ID</th>
							<th>Status</th>
							<th>Submitted At</th>
						</tr>
					</thead>
					<tbody>
						{submissions.map((submission) => (
							<tr key={submission.id}>
								<td>{problemId}</td>
								<td>{submission.id}</td>
								<td>{submission.status}</td>
								<td>{submission.created_at}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			{!problemId && (
				<table>
					<thead>
						<tr>
							<th>Submission ID</th>
							<th>Problem ID</th>
							<th>Status</th>
							<th>Submitted At</th>
						</tr>
					</thead>
					<tbody>
						{submissions.map((submission) => (
							<tr key={submission.id}>
								<td>{submission.id}</td>
								<td>{submission.problem_id}</td>
								<td>{submission.status}</td>
								<td>{submission.created_at}</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);
};

export default Submissions;
