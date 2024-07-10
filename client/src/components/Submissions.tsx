import { useEffect } from "react";
import { Submission } from "../types/submissions";
import { Link } from "react-router-dom";

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
				<table className="w-full rounded-xl text-basecolor text-lg border-collapse">
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
							<tr key={submission.id}>
								<td className="px-4 py-2 border">{problemId}</td>
								<td className="px-4 py-2 border">
									<Link
										to={`/submissions/${submission.id}`}
										className="text-secondary font-semibold text-center">
										{submission.id}
									</Link>
								</td>
								<td className="px-4 py-2 border">{submission.status}</td>
								<td className="px-4 py-2 border">{submission.created_at}</td>
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
