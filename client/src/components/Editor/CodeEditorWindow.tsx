import React, { useState } from "react";

import Editor from "@monaco-editor/react";

type CodeEditorWindowProps = {
	onChange: (key: string, value: string) => void;
	language: string;
	code: string;
	theme: string;
};
const CodeEditorWindow = ({
	onChange,
	language,
	code,
	theme,
}: CodeEditorWindowProps) => {
	const [value, setValue] = useState(code || "");

	const handleEditorChange = (value: string | undefined) => {
		if (value === undefined) return;
		setValue(value);
		onChange("code", value);
	};

	return (
		<div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
			<Editor
				height="85vh"
				width={`100%`}
				language={language || "javascript"}
				value={value}
				theme={theme}
				defaultValue="// some comment"
				onChange={handleEditorChange}
			/>
		</div>
	);
};
export default CodeEditorWindow;
