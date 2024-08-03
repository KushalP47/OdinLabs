// src/components/Problems/CodeEditorInput.tsx

import React, { useState } from "react";
import CodeEditorWindow from "../../components/Editor/CodeEditorWindow"; // Import the CodeEditorWindow component

interface CodeEditorInputProps {
	label: string;
	code: string;
	onChange: (key: string, value: string) => void;
	language: string;
	isTemplate?: boolean;
}

const CodeEditorInput: React.FC<CodeEditorInputProps> = ({
	label,
	code,
	onChange,
	language,
	isTemplate = false,
}) => {
	const [isExpanded, setIsExpanded] = useState(!isTemplate);

	// const handleEditorChange = (value: string | undefined) => {
	// 	if (value === undefined) return;
	// 	onChange("code", value);
	// };

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
					onChange={onChange}
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
