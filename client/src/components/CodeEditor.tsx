type CodeEditorProps = {
	code: string;
	onChange: (newCode: string) => void;
};

const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange }) => {
	const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChange(event.target.value);
	};
	return (
		<div>
			return{" "}
			<Editor
				height="90vh"
				defaultLanguage="javascript"
				defaultValue="// some comment"
			/>
			;
		</div>
	);
};

export default CodeEditor;
