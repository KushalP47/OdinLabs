import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Utils/Navbar";
import { Problem as IProblem } from "../../types/problems";
import { problemService } from "../../api/problemService";
import CodeEditor from "../../components/Problem/CodeEditor";
import Submissions from "../../components/Submission/Submissions";
import { codeExecutionService } from "../../api/codeExecutionService";
import { Submission } from "../../types/submissions";
import { contestService } from "../../api/contestService";
import { assignmentService } from "../../api/assignmentService";
import ErrorModal from "../../components/Utils/ErrorModal";
import { useNavigate } from "react-router-dom";

const Problem = () => {
	// State management
	const [status, setStatus] = useState(false);
	const navigate = useNavigate();
	const currentStatus = useSelector((state: any) => state.auth.status);
	const { problemId } = useParams<{ problemId: string }>(); // Add generic for useParams
	const [problem, setProblem] = useState<IProblem | null>(null);
	const [submissions, setSubmissions] = useState<Submission[]>([]); // Simplified type
	const [tab, setTab] = useState<"Details" | "Submissions" | "Editorial">(
		"Details",
	);
	const [problemEditorial, setProblemEditorial] = useState<string>(
		"Editorial is not available currently",
	);
	const assignmentId = useParams().assignmentId;
	const contestId = useParams().contestId;
	const [deadline, setDeadline] = useState<string | undefined>(undefined);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [errorModalVisible, setErrorModalVisible] = useState(false);
	// Update status based on currentStatus from Redux
	useEffect(() => {
		async function getDeadline() {
			if (contestId) {
				const response = await contestService.getContestDeadline(contestId);
				console.log(response);
				if (response.data.ok === false) {
					setErrorMessage(response.data.message);
					setErrorModalVisible(true);
				}
				setDeadline(response.data.contestEndTime);
			} else if (assignmentId) {
				const response = await assignmentService.getAssignmentDeadline(
					assignmentId,
				);
				if (response.data.ok === false) {
					setErrorMessage(response.data.message);
					setErrorModalVisible(true);
				}
				setDeadline(response.data.assignmentEndTime);
			}
		}
		getDeadline();
		setStatus(currentStatus);
	}, []);

	// Fetch problem data
	const fetchProblem = async (id: string) => {
		try {
			if (contestId === undefined && assignmentId === undefined) {
				const response = await problemService.getPracticeProblem(id);
				if (response.data.ok) {
					setProblem(response.data.problem);
					if (response.data.problem.problemEditorialIsHidden === false) {
						const editorialResponse = await problemService.getEditorialById(id);
						if (editorialResponse.data.ok) {
							setProblemEditorial(
								editorialResponse.data.editorial.editorialContent,
							);
						} else {
							setErrorMessage(editorialResponse.message);
							setErrorModalVisible(true);
						}
					}
				} else {
					navigate(`/practice`);
				}
			} else {
				const response = await problemService.getProblem(id);
				if (response.data.ok) {
					setProblem(response.data.problem);
					if (response.data.problem.problemEditorialIsHidden === false) {
						const editorialResponse = await problemService.getEditorialById(id);
						if (editorialResponse.data.ok) {
							setProblemEditorial(
								editorialResponse.data.editorial.editorialContent,
							);
						} else {
							setErrorMessage(editorialResponse.message);
							setErrorModalVisible(true);
						}
					}
				} else {
					setErrorMessage(response.message);
					setErrorModalVisible(true);
				}
			}
		} catch (error) {
			setErrorMessage("Error fetching problem: No data received.");
			setErrorModalVisible(true);
		}
	};

	// Fetch submissions data
	const fetchSubmissions = async (id: string) => {
		try {
			const response = await codeExecutionService.getSubmissions();
			if (response.data.ok) {
				const problemSubmissions = response.data.data.filter(
					(submission: Submission) =>
						submission.submissionProblemId === Number(id),
				);
				setSubmissions(problemSubmissions);
			} else {
				setErrorMessage(response.message);
				setErrorModalVisible(true);
			}
		} catch (error) {
			// setErrorMessage("Error fetching submissions: No data received.");
			// setErrorModalVisible(true);
		}
	};

	// Fetch data when component mounts or problemId changes
	useEffect(() => {
		if (problemId) {
			console.log(tab);
			fetchProblem(problemId);
			fetchSubmissions(problemId);
		} else {
			setErrorMessage("Problem ID not found.");
			setErrorModalVisible(true);
		}
	}, [problemId]);

	// If no problem is loaded, display a loading message
	if (!problem) {
		return <div>Loading problem...</div>;
	}

	return (
		<div className="flex flex-col min-h-screen">
			{contestId && (
				<Navbar
					currentPage="Contest"
					deadline={deadline}
					contestId={contestId}
				/>
			)}
			{assignmentId && (
				<Navbar
					currentPage="Assignment"
					deadline={deadline}
					assignmentId={assignmentId}
				/>
			)}
			{!contestId && !assignmentId && <Navbar currentPage="Practice" />}
			<div className="bg-white w-full min-h-screen shadow-xl flex">
				{status ? (
					<>
						{/* Left Section: Problem Details */}
						<div className="w-1/2 p-4 overflow-auto">
							<div className="tabs tabs-boxed mb-4 bg-gray-100 font-bold text-lg">
								<a
									className={`tab ${
										tab === "Details"
											? "bg-white text-secondary text-xl"
											: "text-xl"
									}`}
									onClick={() => setTab("Details")}>
									Details
								</a>
								<a
									className={`tab ${
										tab === "Editorial"
											? "bg-white text-secondary text-xl"
											: "text-xl"
									}`}
									onClick={() => setTab("Editorial")}>
									Editorial
								</a>
								<a
									className={`tab ${
										tab === "Submissions"
											? "bg-white text-secondary text-xl"
											: "text-xl"
									}`}
									onClick={() => setTab("Submissions")}>
									Submissions
								</a>
							</div>

							<div className="flex w-full bg-white border-4 border-secondary rounded-box">
								{tab === "Details" && (
									<div className="h-full p-6">
										<div className="flex flex-col">
											<h1 className="text-2xl text-secondary font-bold">
												{problem?.problemTitle || "Problem Title"}
											</h1>
											<p className="text-basecolor mt-4">
												{problem?.problemDescription ||
													"No description available"}
											</p>
											<div className="mt-4">
												<h2 className="text-lg text-secondary font-semibold">
													Input Format
												</h2>
												<p className="text-basecolor">
													{problem?.problemInputFormat ||
														"No input format specified"}
												</p>
											</div>
											<div className="mt-4">
												<h2 className="text-lg text-secondary font-semibold">
													Output Format
												</h2>
												<p className="text-basecolor">
													{problem?.problemOutputFormat ||
														"No output format specified"}
												</p>
											</div>
											<div className="mt-4">
												<h2 className="text-lg text-secondary font-semibold">
													Sample Input
												</h2>
												<pre className="bg-gray-100 p-2 rounded">
													{problem?.problemSampleInput ||
														"No sample input provided"}
												</pre>
											</div>
											<div className="mt-4">
												<h2 className="text-lg text-secondary font-semibold">
													Sample Output
												</h2>
												<pre className="bg-gray-100 p-2 rounded">
													{problem?.problemSampleOutput ||
														"No sample output provided"}
												</pre>
											</div>
											<div className="mt-4">
												<h2 className="text-lg text-secondary font-semibold">
													Note
												</h2>
												<p className="text-basecolor">
													{problem?.problemNote || "No additional notes"}
												</p>
											</div>
											<div className="mt-4">
												<h2 className="text-lg text-secondary font-semibold">
													Constraints
												</h2>
												<p className="text-basecolor">
													{problem?.problemConstraints ||
														"No constraints specified"}
												</p>
											</div>
										</div>
									</div>
								)}

								{tab === "Editorial" && (
									<div className="p-6">
										<h1 className="text-2xl text-secondary font-bold">
											Editorial
										</h1>
										<p className="text-basecolor mt-4">
											{problemEditorial || "Editorial not available"}
										</p>
									</div>
								)}

								{tab === "Submissions" && (
									<div className=" p-6">
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
								)}
							</div>
						</div>
						{/* Right Section: Code Editor */}
						<div className="w-1/2 p-4 bg-gray-50">
							<CodeEditor
								problemId={Number(problemId)}
								problemDifficulty={problem.problemDifficulty}
								problemCppTemplate={problem.problemCppTemplate}
								problemJavaTemplate={problem.problemJavaTemplate}
								problemPythonTemplate={problem.problemPythonTemplate}
							/>
						</div>
					</>
				) : (
					<h2 className="text-2xl text-basecolor">
						Please login to view this page
					</h2>
				)}
				{errorModalVisible && (
					<ErrorModal
						message={errorMessage}
						onClose={() => setErrorModalVisible(false)}
						isOpen={errorModalVisible}
					/>
				)}
			</div>
		</div>
	);
};

export default Problem;
