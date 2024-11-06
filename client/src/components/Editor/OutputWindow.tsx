type OutputWindowProps = {
	outputDetails: any;
	language_id: number;
};
const OutputWindow = ({ outputDetails, language_id }: OutputWindowProps) => {
	const getOutput = () => {
		let statusId = outputDetails?.status?.id;

		if (statusId === 6) {
			// compilation error
			return (
				<pre className="px-2 py-1 font-normal text-lg text-red-500">
					{language_id === 54 && outputDetails.compile_output !== null
						? `${atob(outputDetails.compile_output)}`
						: null}

					{language_id === 62 && outputDetails.compile_output !== null
						? `${atob(outputDetails.compile_output)}`
						: null}

					{language_id === 71 && outputDetails.compile_output !== null
						? `${atob(outputDetails.compile_output)}`
						: null}
					{language_id === 63 && outputDetails.compile_output !== null
						? `${atob(outputDetails.compile_output)}`
						: null}
					{language_id === 50 && outputDetails.compile_output !== null
						? `${atob(outputDetails.compile_output)}`
						: null}
				</pre>
			);
		} else if (statusId === 3) {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-basecolor">
					{language_id === 54 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}

					{language_id === 62 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}

					{language_id === 71 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}
					{language_id === 63 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}
					{language_id === 50 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}
				</pre>
			);
		} else if (statusId === 4) {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-basecolor">
					{language_id === 54 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}

					{language_id === 62 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}

					{language_id === 71 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}
					{language_id === 63 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}
					{language_id === 50 && outputDetails.stdout !== null
						? `${atob(outputDetails.stdout)}`
						: null}
				</pre>
			);
		} else if (statusId === 5) {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-red-500">
					{`Time Limit Exceeded`}
				</pre>
			);
		} else {
			return (
				<pre className="px-2 py-1 font-normal text-lg text-red-500">
					{language_id === 54 && outputDetails.stderr !== null
						? `${atob(outputDetails.stderr)}`
						: null}{" "}
					// C++
					{language_id === 62 && outputDetails.stderr !== null
						? `${atob(outputDetails.stderr)}`
						: null}{" "}
					// Java
					{language_id === 71 && outputDetails.stderr !== null
						? `${atob(outputDetails.stderr)}`
						: null}{" "}
					// Python
					{language_id === 63 && outputDetails.stderr !== null
						? `${atob(outputDetails.stderr)}`
						: null}{" "}
					// JavaScript
					{language_id === 50 && outputDetails.stderr !== null
						? `${atob(outputDetails.stderr)}`
						: null}{" "}
					// C
				</pre>
			);
		}
	};
	return (
		<>
			<div className="max-w-xl min-h-32 rounded-md text-white font-normal text-sm overflow-y-auto">
				{outputDetails ? <>{getOutput()}</> : null}
				{!outputDetails && <p>Output Window</p>}
			</div>
		</>
	);
};

export default OutputWindow;
