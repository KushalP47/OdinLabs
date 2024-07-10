import Navbar from "../components/Navbar";
import Submissions from "../components/Submissions";
import { useState, useEffect } from "react";
import { codeExecutionService } from "../api/codeExecutionService";
const SubmissionPage = () => {
	const [submissions, setSubmissions] = useState([]);

	useEffect(() => {
		const fetchSubmissions = async () => {
			const data = await codeExecutionService.getSubmissions();
			console.log("data", data);
			if (!data.ok) {
				console.log("Error fetching submissions", data);
				return;
			}
			setSubmissions(data.data);
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
				{submissions.length === 0 && (
					<p className="text-xl text-basecolor">No submissions yet.</p>
				)}
				{/* Submissions component */}
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
