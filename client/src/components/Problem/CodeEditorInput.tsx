// src/components/Problems/CodeEditorInput.tsx

import React, { useState } from "react";
import CodeEditorWindow from "../../components/Editor/CodeEditorWindow"; // Import the CodeEditorWindow component

interface CodeEditorInputProps {
	label: string;
	code: string;
	setCode: React.Dispatch<React.SetStateAction<string>>;
	language: string;
	isTemplate?: boolean;
}

const CodeEditorInput: React.FC<CodeEditorInputProps> = ({
	label,
	code,
	setCode,
	language,
	isTemplate = false,
}) => {
	const [isExpanded, setIsExpanded] = useState(!isTemplate);

	const handleEditorChange = (key: string, value: string) => {
		setCode(value);
	};

	return (
		<div className="flex flex-col space-y-2">
			<div className="flex justify-between items-center">
				<label className="font-semibold text-lg">{label}</label>
				{isTemplate && (
					<button
						type="button"
						className="text-blue-500 hover:underline"
						onClick={() => setIsExpanded(!isExpanded)}>
						{isExpanded ? "Hide" : "Show"} Template
					</button>
				)}
			</div>
			{isExpanded && (
				<CodeEditorWindow
					onChange={handleEditorChange}
					language={language}
					code={code}
					theme={
						"vs-dark" // Use the dark theme
					} // Handle theme dynamically
					readOnly={false} // Make read-only if it's a template
				/>
			)}
		</div>
	);
};

export default CodeEditorInput;
