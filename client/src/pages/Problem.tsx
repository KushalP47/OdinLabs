import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Problem as IProblem } from "../types/problems";
import { problemService } from "../api/problemService";
import CodeEditor from "../components/CodeEditor";
import Submissions from "../components/Submissions";
import { codeExecutionService } from "../api/codeExecutionService";

const Problem = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const { problemId } = useParams();
	const [problem, setProblem] = useState<IProblem>();
	const [submissions, setSubmissions] = useState([]);

	useEffect(() => {
		setStatus(currentStatus);
	}, [currentStatus]);

	useEffect(() => {
		const fetchSubmissions = async () => {
			const data = await codeExecutionService.getSubmissions();
			if (!data.ok) {
				console.log("Error fetching submissions", data);
				return;
			}
			setSubmissions(data.data);
		};
		fetchSubmissions();
	}, []);

	useEffect(() => {
		async function getProblem() {
			if (problemId) {
				await problemService
					.getProblem(problemId)
					.then((data) => {
						setProblem(data.data.problem);
					})
					.catch((error) => {
						console.error(error);
					});
			}
		}
		getProblem();
	}, [problemId]);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Problem" />
			<div className="bg-white w-full min-h-screen shadow-xl flex">
				{status ? (
					<>
						{/* Left Section: Problem Details */}

						<div className="w-1/2 p-4 overflow-auto">
							<div role="tablist" className="tabs tabs-lifted mt-3">
								<input
									type="radio"
									name="my_tabs_1"
									role="tab"
									className="tab [--tab-bg:#767FFE] [--tab-border-color:#767FFE] [--tab-text:white] text-basecolor border-4 border-secondary text-xl"
									aria-label="Details"
									defaultChecked
								/>
								<div
									role="tabpanel"
									className="tab-content h-full bg-white border-4 border-secondary rounded-box p-6">
									<div className="flex flex-col">
										<h1 className="text-2xl text-secondary font-bold">
											{problem?.problemTitle}
										</h1>
										<p className="text-basecolor mt-4">
											{problem?.problemDescription}
										</p>
										<div className="mt-4">
											<h2 className="text-lg text-secondary font-semibold">
												Input Format
											</h2>
											<p className="text-basecolor">
												{problem?.problemInputFormat}
											</p>
										</div>
										<div className="mt-4">
											<h2 className="text-lg text-secondary font-semibold">
												Output Format
											</h2>
											<p className="text-basecolor">
												{problem?.problemOutputFormat}
											</p>
										</div>
										<div className="mt-4">
											<h2 className="text-lg text-secondary font-semibold">
												Sample Input
											</h2>
											<pre className="bg-gray-100 p-2 rounded">
												{problem?.problemSampleInput}
											</pre>
										</div>
										<div className="mt-4">
											<h2 className="text-lg text-secondary font-semibold">
												Sample Output
											</h2>
											<pre className="bg-gray-100 p-2 rounded">
												{problem?.problemSampleOutput}
											</pre>
										</div>
										<div className="mt-4">
											<h2 className="text-lg text-secondary font-semibold">
												Note
											</h2>
											<p className="text-basecolor">{problem?.problemNote}</p>
										</div>
										<div className="mt-4">
											<h2 className="text-lg text-secondary font-semibold">
												Constraints
											</h2>
											<p className="text-basecolor">
												{problem?.problemConstraints}
											</p>
										</div>
									</div>
								</div>

								<input
									type="radio"
									name="my_tabs_1"
									role="tab"
									className="tab [--tab-bg:#767FFE] [--tab-border-color:#767FFE] [--tab-text:white] text-basecolor border-4 border-secondary text-lg"
									aria-label="Editorial"
								/>
								<div
									role="tabpanel"
									className="tab-content bg-white border-secondary border-4 rounded-box p-6">
									<h1 className="text-2xl text-secondary font-bold">
										Editorial
									</h1>
									<p className="text-basecolor mt-4">
										{problem?.problemSolution}
									</p>
								</div>

								<input
									type="radio"
									name="my_tabs_1"
									role="tab"
									className="tab [--tab-bg:#767FFE] [--tab-border-color:#767FFE] [--tab-text:white] text-basecolor border-4 border-secondary text-lg"
									aria-label="Submissions"
								/>
								<div
									role="tabpanel"
									className="tab-content bg-white border-secondary border-4 rounded-box p-6">
									<h1 className="text-2xl text-secondary font-bold">
										Submissions
									</h1>
									<Submissions
										submissions={submissions}
										problemId={problemId}
									/>
								</div>
							</div>
						</div>
						{/* Right Section: Code Editor */}
						<div className="w-1/2 p-4 bg-gray-50">
							<CodeEditor problemId={Number(problemId)} />
						</div>
					</>
				) : (
					<h2 className="text-2xl text-basecolor">
						Please login to view this page
					</h2>
				)}
			</div>
		</div>
	);
};

export default Problem;
