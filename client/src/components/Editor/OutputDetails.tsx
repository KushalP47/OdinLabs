type OutputDetailsProps = {
	outputDetails: any;
};

const OutputDetails = ({ outputDetails }: OutputDetailsProps) => {
	return (
		<div className="w-full flex flex-row justify-between text-basecolor items-center p-3">
			<p className="text-md flex flex-row">
				Status:{" "}
				<span
					className={`font-semibold px-4  rounded-md bg-gray-100 ${
						outputDetails?.status?.description === "Accepted"
							? "text-success"
							: "text-error"
					}`}>
					{outputDetails?.status?.description}
				</span>
			</p>
			<p className="text-md flex flex-row">
				Memory:{" "}
				<span className="font-semibold px-4  rounded-md bg-gray-100">
					{outputDetails?.memory}
				</span>
			</p>
			<p className="text-md flex flex-row">
				Time:{" "}
				<span className="font-semibold px-4 rounded-md bg-gray-100">
					{outputDetails?.time}
				</span>
			</p>
		</div>
	);
};

export default OutputDetails;
