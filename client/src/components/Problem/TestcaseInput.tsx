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
	const [fileInput, setFileInput] = useState<File | null>(null);
	const [fileExpectedOutput, setFileExpectedOutput] = useState<File | null>(
		null,
	);

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
				{testcases.map((testcase, index) => (
					<div
						key={index}
						className="border p-2 rounded-md shadow-sm flex flex-col space-y-2 w-full lg:w-1/2">
						<div>
							<strong>Input:</strong>
							<pre className="bg-gray-100 dark:bg-editorbg p-2 rounded-md whitespace-pre-wrap overflow-auto">
								{testcase.input}
							</pre>
						</div>
						<div>
							<strong>Expected Output:</strong>
							<pre className="bg-gray-100 dark:bg-editorbg p-2 rounded-md whitespace-pre-wrap overflow-auto">
								{testcase.expectedOutput}
							</pre>
						</div>
						<button
							type="button"
							className="text-red-500 hover:underline self-end"
							onClick={() => handleDeleteTestcase(index)}>
							Remove Testcase
						</button>
					</div>
				))}
			</div>
			<div className="flex flex-col space-y-2">
				<textarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="border rounded-md p-2 bg-gray-50 dark:bg-editorbg"
					placeholder="Enter testcase input"
				/>
				<input
					type="file"
					accept=".txt"
					onChange={(e) => handleFileUpload(e, true)}
					className="file-input file-input-bordered w-full"
				/>
				<textarea
					value={expectedOutput}
					onChange={(e) => setExpectedOutput(e.target.value)}
					className="border rounded-md p-2 bg-gray-50 dark:bg-editorbg"
					placeholder="Enter expected output"
				/>
				<input
					type="file"
					accept=".txt"
					onChange={(e) => handleFileUpload(e, false)}
					className="file-input file-input-bordered w-full"
				/>
				<button
					type="button"
					onClick={handleAddTestcase}
					className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-4 rounded-md">
					Add Testcase
				</button>
			</div>
		</div>
	);
};

export default TestcaseInput;
