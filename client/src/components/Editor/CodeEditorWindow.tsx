import { loader } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
loader.config({ monaco });
import Editor from "@monaco-editor/react";

type CodeEditorWindowProps = {
	onChange: (key: string, value: string) => void;
	language: string;
	code: string;
	theme: string;
	readOnly: boolean; // Add this prop
};

const CodeEditorWindow = ({
	onChange,
	language,
	code,
	theme,
	readOnly,
}: CodeEditorWindowProps) => {
	// const Editor = monaco.editor;
	const handleEditorChange = (value: string | undefined) => {
		if (value === undefined) return;
		onChange("code", value);
	};

	return (
		<div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
			<Editor
				height="65vh"
				width={`100%`}
				language={language || "C++"}
				value={code}
				theme={theme}
				onChange={handleEditorChange}
				options={{
					fontSize: 16,
					readOnly: readOnly, // Set readOnly option
				}}
			/>
		</div>
	);
};

export default CodeEditorWindow;
