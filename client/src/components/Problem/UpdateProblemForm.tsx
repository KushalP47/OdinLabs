// src/components/Problems/UpdateProblemForm.tsx

import { useState, useEffect } from "react";
import ReactQuill from "react-quill"; // Import react-quill
import "react-quill/dist/quill.snow.css"; // Import react-quill styles
import { Testcase } from "../../types/problems";
import TagsInput from "./TagsInput";
import DifficultySelector from "./DifficultySelector";
import TestcaseInput from "./TestcaseInput";
import CodeEditorInput from "./CodeEditorInput";
import ErrorModal from "../../components/Utils/ErrorModal";
import SuccessModal from "../../components/Utils/SuccessModal";
import { problemService } from "../../api/problemService";
import { useParams } from "react-router-dom";

const UpdateProblemForm = () => {
	const { problemId } = useParams<{ problemId?: string }>();
	if (!problemId) {
		return <div>Problem ID not provided</div>;
	}
	const [problemTitle, setProblemTitle] = useState("");
	const [problemDescription, setProblemDescription] = useState("");
	const [problemTags, setProblemTags] = useState<string[]>([]);
	const [problemDifficulty, setProblemDifficulty] = useState("");
	const [problemInputFormat, setProblemInputFormat] = useState("");
	const [problemOutputFormat, setProblemOutputFormat] = useState("");
	const [problemSampleInput, setProblemSampleInput] = useState("");
	const [problemSampleOutput, setProblemSampleOutput] = useState("");
	const [problemNote, setProblemNote] = useState("");
	const [problemConstraints, setProblemConstraints] = useState("");
	const [problemTestcases, setProblemTestcases] = useState<Testcase[]>([]);
	const [problemCppTemplate, setProblemCppTemplate] = useState("");
	const [problemCppDriverCode, setProblemCppDriverCode] = useState("");
	const [problemJavaTemplate, setProblemJavaTemplate] = useState("");
	const [problemJavaDriverCode, setProblemJavaDriverCode] = useState("");
	const [problemPythonTemplate, setProblemPythonTemplate] = useState("");
	const [problemPythonDriverCode, setProblemPythonDriverCode] = useState("");
	const [problemEditorial, setProblemEditorial] = useState("");
	const [message, setMessage] = useState("");
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	useEffect(() => {
		if (problemId) {
			// Fetch the problem data by ID
			const fetchProblemData = async () => {
				const response = await problemService.getProblem(problemId as string);
				if (response.data.ok) {
					const data = response.data.problem;
					setProblemTitle(data.problemTitle);
					setProblemDescription(data.problemDescription);
					setProblemTags(data.problemTags);
					setProblemDifficulty(data.problemDifficulty);
					setProblemInputFormat(data.problemInputFormat);
					setProblemOutputFormat(data.problemOutputFormat);
					setProblemSampleInput(data.problemSampleInput);
					setProblemSampleOutput(data.problemSampleOutput);
					setProblemNote(data.problemNote);
					setProblemConstraints(data.problemConstraints);
					setProblemTestcases(data.problemTestcases);
					setProblemCppTemplate(data.problemCppTemplate);
					setProblemCppDriverCode(data.problemCppDriverCode);
					setProblemJavaTemplate(data.problemJavaTemplate);
					setProblemJavaDriverCode(data.problemJavaDriverCode);
					setProblemPythonTemplate(data.problemPythonTemplate);
					setProblemPythonDriverCode(data.problemPythonDriverCode);
					const editorialResponse = await problemService.getEditorialById(
						problemId,
					);
					console.log(editorialResponse);
					if (editorialResponse.data.ok) {
						setProblemEditorial(
							editorialResponse.data.editorial.editorialContent,
						);
					} else {
						setMessage("An error occurred while fetching the editorial data.");
						setErrorModalOpen(true);
					}
				} else {
					setMessage("An error occurred while fetching the problem data.");
					setErrorModalOpen(true);
				}
			};
			fetchProblemData();
		}
	}, [problemId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validation
		if (!problemTitle || !problemDescription || !problemDifficulty) {
			setMessage("Please fill in all the required fields.");
			setErrorModalOpen(true);
			return;
		}

		// Create the problem data
		const updatedProblem = {
			problemTitle,
			problemDescription,
			problemTags,
			problemDifficulty,
			problemInputFormat,
			problemOutputFormat,
			problemSampleInput,
			problemSampleOutput,
			problemNote,
			problemConstraints,
			problemTestcases,
			problemCppTemplate,
			problemCppDriverCode,
			problemJavaTemplate,
			problemJavaDriverCode,
			problemPythonTemplate,
			problemPythonDriverCode,
			problemEditorial,
		};

		// Call the API to update the problem
		const response = await problemService.updateProblem(updatedProblem);
		if (response.data.ok) {
			setMessage("Problem updated successfully!");
			setSuccessModalOpen(true);
		} else {
			setMessage("An error occurred while updating the problem.");
			setErrorModalOpen(true);
		}
	};

	return (
		<>
			<form
				onSubmit={handleSubmit}
				className="bg-white dark:bg-editorbg text-basecolor p-6 rounded-lg shadow-md space-y-4 mx-auto w-full mt-10">
				{/* Problem ID */}
				<div className="flex flex-col">
					<label className="font-semibold text-lg mb-2" htmlFor="problemId">
						Problem Id <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={problemId}
						className="border bg-white rounded-md p-2 text-lg"
						readOnly
					/>
				</div>
				{/* Problem Title */}
				<div className="flex flex-col">
					<label className="font-semibold text-lg mb-2" htmlFor="problemTitle">
						Problem Title <span className="text-red-500">*</span>
					</label>
					<input
						type="text"
						value={problemTitle}
						onChange={(e) => setProblemTitle(e.target.value)}
						className="border bg-white rounded-md p-2 text-lg"
						placeholder="Enter the problem title here..."
					/>
				</div>

				{/* Problem Description */}
				<div className="flex flex-col">
					<label
						className="font-semibold text-lg mb-2"
						htmlFor="problemDescription">
						Problem Description <span className="text-red-500">*</span>
					</label>
					<ReactQuill
						value={problemDescription}
						onChange={(value) => setProblemDescription(value)}
						className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
						placeholder="Enter the problem description here..."
					/>
				</div>

				{/* Problem Tags */}
				<TagsInput tags={problemTags} setTags={setProblemTags} />

				{/* Problem Difficulty */}
				<DifficultySelector
					selectedDifficulty={problemDifficulty}
					setSelectedDifficulty={setProblemDifficulty}
				/>

				{/* Problem Input Format */}
				<div className="flex flex-col">
					<label
						className="font-semibold text-lg mb-2"
						htmlFor="problemInputFormat">
						Input Format <span className="text-red-500">*</span>
					</label>
					<ReactQuill
						value={problemInputFormat}
						onChange={(value) => setProblemInputFormat(value)}
						className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
						placeholder="Enter the input format here..."
					/>
				</div>

				{/* Problem Output Format */}
				<div className="flex flex-col">
					<label
						className="font-semibold text-lg mb-2"
						htmlFor="problemOutputFormat">
						Output Format <span className="text-red-500">*</span>
					</label>
					<ReactQuill
						value={problemOutputFormat}
						onChange={(value) => setProblemOutputFormat(value)}
						className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
						placeholder="Enter the output format here..."
					/>
				</div>

				<div className="flex flex-row justify-center items-center">
					{/* Problem Sample Input */}
					<div className="flex flex-col w-full p-4">
						<label
							className="font-semibold text-lg mb-2"
							htmlFor="problemSampleInput">
							Sample Input
						</label>
						<textarea
							value={problemSampleInput}
							onChange={(e) => setProblemSampleInput(e.target.value)}
							className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
							placeholder="Enter the sample input here..."
						/>
					</div>
					<div className="divider divider-horizontal p-4"></div>
					{/* Problem Sample Output */}
					<div className="flex flex-col w-full p-4">
						<label
							className="font-semibold text-lg mb-2"
							htmlFor="problemSampleOutput">
							Sample Output
						</label>
						<textarea
							value={problemSampleOutput}
							onChange={(e) => setProblemSampleOutput(e.target.value)}
							className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
							placeholder="Enter the sample output here..."
						/>
					</div>
				</div>

				{/* Problem Constraints */}
				<div className="flex flex-col">
					<label
						className="font-semibold text-lg mb-2"
						htmlFor="problemConstraints">
						Constraints
					</label>

					<ReactQuill
						value={problemConstraints}
						onChange={(value) => setProblemConstraints(value)}
						className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
						placeholder="Enter the constraints here..."
					/>
				</div>

				{/* Problem Note */}
				<div className="flex flex-col">
					<label className="font-semibold text-lg mb-2" htmlFor="problemNote">
						Note
					</label>
					<ReactQuill
						value={problemNote}
						onChange={(value) => setProblemNote(value)}
						className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
						placeholder="Enter any additional notes here..."
					/>
				</div>

				{/* Testcases */}
				<TestcaseInput
					testcases={problemTestcases}
					setTestcases={setProblemTestcases}
				/>

				{/* Code Editor for Templates */}
				<div className="flex flex-row justify-center items-center">
					<div className="flex flex-col w-full p-4">
						<CodeEditorInput
							language="cpp"
							code={problemCppTemplate}
							label={"C++ Template"}
							setCode={(code) => setProblemCppTemplate(code)}
							isTemplate={false}
						/>
					</div>
					<div className="flex flex-col w-full p-4">
						<CodeEditorInput
							language="cpp"
							code={problemCppDriverCode}
							label={"C++ Driver Code"}
							setCode={(code) => setProblemCppDriverCode(code)}
							isTemplate={false}
						/>
					</div>
				</div>

				<div className="flex flex-row justify-center items-center">
					<div className="flex flex-col w-full p-4">
						<CodeEditorInput
							language="java"
							code={problemJavaTemplate}
							setCode={(code) => setProblemJavaTemplate(code)}
							isTemplate={false}
							label="Java Template"
						/>
					</div>

					<div className="flex flex-col w-full p-4">
						<CodeEditorInput
							language="java"
							code={problemJavaDriverCode}
							setCode={(code) => setProblemJavaDriverCode(code)}
							isTemplate={false}
							label={"Java Driver Code"}
						/>
					</div>
				</div>

				<div className="flex flex-row justify-center items-center">
					<div className="flex flex-col w-full p-4">
						<CodeEditorInput
							language="python"
							code={problemPythonTemplate}
							setCode={(code) => setProblemPythonTemplate(code)}
							isTemplate={false}
							label={"Python Template"}
						/>
					</div>

					<div className="flex flex-col w-full p-4">
						<CodeEditorInput
							language="python"
							code={problemPythonDriverCode}
							setCode={(code) => setProblemPythonDriverCode(code)}
							isTemplate={false}
							label={"Python Driver Code"}
						/>
					</div>
				</div>

				{/* Editorial */}
				<div className="flex flex-col">
					<label
						className="font-semibold text-lg mb-2"
						htmlFor="problemEditorial">
						Editorial
					</label>
					<ReactQuill
						value={problemEditorial}
						onChange={(value) => setProblemEditorial(value)}
						className="border rounded-md p-2 min-h-[100px] bg-gray-50 dark:bg-editorbg text-lg"
						placeholder="Enter the editorial here..."
					/>
				</div>

				<button
					type="submit"
					className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
					Update Problem
				</button>
			</form>

			{/* Error Modal */}
			{errorModalOpen && (
				<ErrorModal
					message={message}
					onClose={() => setErrorModalOpen(false)}
					isOpen={errorModalOpen}
				/>
			)}

			{/* Success Modal */}
			{successModalOpen && (
				<SuccessModal
					message={message}
					onClose={() => setSuccessModalOpen(false)}
					isOpen={successModalOpen}
				/>
			)}
		</>
	);
};

export default UpdateProblemForm;
