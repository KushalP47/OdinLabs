// src/components/Problems/TestcaseInput.tsx

import React, { useState } from "react";
import { Testcase } from "../../types/problems";

interface TestcaseInputProps {
	testcases: Testcase[];
	setTestcases: React.Dispatch<React.SetStateAction<Testcase[]>>;
}

const TestcaseInput: React.FC<TestcaseInputProps> = ({
	testcases,
	setTestcases,
}) => {
	const [input, setInput] = useState("");
	const [expectedOutput, setExpectedOutput] = useState("");

	const handleAddTestcase = () => {
		if (input && expectedOutput) {
			setTestcases([...testcases, { input, expectedOutput }]);
			setInput("");
			setExpectedOutput("");
		}
	};

	const handleDeleteTestcase = (index: number) => {
		setTestcases(testcases.filter((_, idx) => idx !== index));
	};

	const handleFileUpload = async (
		e: React.ChangeEvent<HTMLInputElement>,
		isInput: boolean,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (event) => {
				const content = event.target?.result as string;
				if (isInput) {
					setInput(content);
				} else {
					setExpectedOutput(content);
				}
			};
			reader.readAsText(file);
		}
	};

	return (
		<div className="flex flex-col space-y-4">
			<label className="font-semibold text-lg mb-2">Problem Testcases</label>
			<div className="flex flex-wrap gap-4 mb-4">
				{testcases &&
					testcases.length > 0 &&
					testcases.map((testcase, index) => (
						<div
							key={index}
							className="border rounded-md shadow-sm flex flex-col justofy-center items-center space-y-2 w-full">
							<div className="flex flex-row justify-evenly items-center w-full">
								<div className="flex flex-col space-y-2 w-1/2 p-4">
									<strong>Input:</strong>
									<pre className="bg-gray-100 dark:bg-editorbg p-2 rounded-md whitespace-pre-wrap overflow-auto w-full">
										{testcase.input}
									</pre>
								</div>
								<div className="flex flex-col space-y-2 w-1/2 p-4">
									<strong>Expected Output:</strong>
									<pre className="bg-gray-100 dark:bg-editorbg p-2 rounded-md whitespace-pre-wrap overflow-auto w-full">
										{testcase.expectedOutput}
									</pre>
								</div>
							</div>
							<button
								type="button"
								className="btn btn-error btn-sm text-white w-fit mb-2"
								onClick={() => handleDeleteTestcase(index)}>
								Remove Testcase
							</button>
						</div>
					))}
			</div>
			<div className="flex flex-row justify-center items-center w-full">
				<div className="flex flex-col justify-center items-center w-1/2 p-4">
					<textarea
						value={input}
						onChange={(e) => setInput(e.target.value)}
						className="border rounded-md p-2 bg-gray-50 min-h-[150px] dark:bg-editorbg w-full mb-2"
						placeholder="Enter testcase input"
					/>
					<input
						type="file"
						accept=".txt"
						onChange={(e) => handleFileUpload(e, true)}
						className="file-input file-input-bordered bg-white text-basecolor"
					/>
				</div>
				<div className="flex flex-col justify-center items-center w-1/2 p-4">
					<textarea
						value={expectedOutput}
						onChange={(e) => setExpectedOutput(e.target.value)}
						className="border rounded-md p-2 bg-gray-50 min-h-[150px] dark:bg-editorbg w-full mb-2"
						placeholder="Enter expected output"
					/>
					<input
						type="file"
						accept=".txt"
						onChange={(e) => handleFileUpload(e, false)}
						className="file-input file-input-bordered bg-white text-basecolor"
					/>
				</div>
			</div>
			<button
				type="button"
				onClick={handleAddTestcase}
				className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md">
				Add Testcase
			</button>
		</div>
	);
};

export default TestcaseInput;
