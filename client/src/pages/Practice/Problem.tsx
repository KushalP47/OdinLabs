import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { Problem as IProblem } from "../../types/problems";
import { problemService } from "../../api/problemService";
import CodeEditor from "../../components/CodeEditor";
import Submissions from "../../components/Submissions";
import { codeExecutionService } from "../../api/codeExecutionService";
import { Submission } from "../../types/submissions";
import { assignmentService } from "../../api/assignmentService";
import { contestService } from "../../api/contestService";

const Problem = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const { problemId } = useParams();
	const [problem, setProblem] = useState<IProblem>();
	const [submissions, setSubmissions] = useState<Array<Submission>>([]);
	const assignmentId = useParams<{ assignmentId: string }>().assignmentId;
	const contestId = useParams<{ contestId: string }>().contestId;
	const [assignmentDeadline, setAssignmentDeadline] = useState<string>("");
	const [contestDeadline, setContestDeadline] = useState<string>("");
	useEffect(() => {
		setStatus(currentStatus);
	}, [currentStatus]);

	const getAssignmentDeadline = async (assignmentId: string) => {
		if (assignmentId) {
			console.log("getting: assignmentId");
			await assignmentService
				.getAssignmentDeadline(assignmentId)
				.then((data) => {
					console.log(data);
					if (data.data.ok) {
						console.log(data.data.assignmentEndTime);
						setAssignmentDeadline(data.data.assignmentEndTime);
					} else {
						console.error("Error fetching assignment deadline");
					}
				});
		} else {
			console.error("Error fetching assignment deadline");
		}
	};

	const getContestDeadline = async (contestId: string) => {
		if (contestId) {
			console.log("getting: contestId");
			await contestService.getContestDeadline(contestId).then((data) => {
				if (data.data.ok) {
					setContestDeadline(data.data.contestEndTime);
				} else {
					console.error("Error fetching contest deadline", data);
				}
			});
		} else {
			console.error("Error fetching contest deadline");
		}
	};

	const fetchSubmissions = async () => {
		const data = await codeExecutionService.getSubmissions();
		if (data.statusCode !== 200) {
			console.error("Error fetching submissions");
		}
		const problemSubmissions: Array<Submission> = data.data.filter(
			(submission: Submission) =>
				submission.submissionProblemId === Number(problemId),
		);
		setSubmissions(problemSubmissions);
	};
	useEffect(() => {
		fetchSubmissions();
		console.log(assignmentId);
		if (assignmentId) {
			getAssignmentDeadline(assignmentId);
		}
		if (contestId) {
			getContestDeadline(contestId);
		}
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
			} else {
				console.error("Error fetching problem");
			}
		}
		getProblem();
	}, [problemId]);

	return (
		<div className="flex flex-col min-h-screen">
			{assignmentId && (
				<Navbar
					currentPage=""
					deadline={assignmentDeadline}
					assignmentId={String(assignmentId)}
				/>
			)}
			{contestId && (
				<Navbar
					currentPage=""
					deadline={contestDeadline}
					contestId={String(contestId)}
				/>
			)}
			{!assignmentId && !contestId && <Navbar currentPage="Problem" />}
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
									onClick={fetchSubmissions}
								/>
								<div
									role="tabpanel"
									className="tab-content bg-white border-secondary border-4 rounded-box p-6">
									<h1 className="text-2xl text-secondary font-bold mb-4">
										Submissions
									</h1>

									<div className="w-full text-basecolor">
										<Submissions
											submissions={submissions}
											problemId={problemId}
										/>
									</div>
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
