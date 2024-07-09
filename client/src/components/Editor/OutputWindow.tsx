type OutputWindowProps = {
	outputDetails: any;
};
const OutputWindow = ({ outputDetails }: OutputWindowProps) => {
	const getOutput = () => {
		let statusId = outputDetails?.status?.id;

		if (statusId === 6) {
			// compilation error
			return (
				<pre className="px-2 py-1 font-normal text-xs text-red-500">
					{atob(outputDetails?.compile_output)}
				</pre>
			);
		} else if (statusId === 3) {
			return (
				<pre className="px-2 py-1 font-normal text-xs text-green-500">
					{atob(outputDetails.stdout) !== null
						? `${atob(outputDetails.stdout)}`
						: null}
				</pre>
			);
		} else if (statusId === 5) {
			return (
				<pre className="px-2 py-1 font-normal text-xs text-red-500">
					{`Time Limit Exceeded`}
				</pre>
			);
		} else {
			return (
				<pre className="px-2 py-1 font-normal text-xs text-red-500">
					{atob(outputDetails?.stderr)}
				</pre>
			);
		}
	};
	return (
		<>
			<div className="w-full h-full rounded-md text-white font-normal text-sm overflow-y-auto">
				{outputDetails ? <>{getOutput()}</> : null}
			</div>
		</>
	);
};

export default OutputWindow;
