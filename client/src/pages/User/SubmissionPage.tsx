import Navbar from "../../components/Utils/Navbar";
import Submissions from "../../components/Submission/Submissions";
import { useState, useEffect } from "react";
import { codeExecutionService } from "../../api/codeExecutionService";
import { Submission } from "../../types/submissions";
const SubmissionPage = () => {
	const [submissions, setSubmissions] = useState<Submission[]>([]);

	useEffect(() => {
		const fetchSubmissions = async () => {
			const data = await codeExecutionService.getSubmissions();
			console.log("data", data);
			if (data.statusCode !== 200) {
				console.log("Error fetching submissions", data);
				return;
			}
			setSubmissions(data.data.data);
		};
		fetchSubmissions();
	}, []);
	return (
		<>
			<Navbar currentPage="Submissions" />
			<div className="felx flex-col w-full min-h-screen bg-white justify-center items-center p-4">
				<h1 className="flex flex-row justify-center items-center w-full text-3xl text-secondary font-bold p-4">
					Submissions
				</h1>

				{submissions.length > 0 && (
					<div className="border-4 border-secondary">
						<Submissions submissions={submissions} />
					</div>
				)}
			</div>
		</>
	);
};

export default SubmissionPage;
