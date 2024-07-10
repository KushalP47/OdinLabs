import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Submission } from "../types/submissions";
interface SubmissionDetailsProps {
	submissionDetails: Submission | null;
	closeModal: () => void;
}
const SubmissionDetails = ({
	submissionDetails,
	closeModal,
}: SubmissionDetailsProps) => {
	return (
		<div className="modal modal-open" role="dialog" id="verdict">
			<div className="modal-box bg-white rounded-lg shadow-lg mx-auto min-w-[50vw]">
				<div className="modal-header w-full border-b border-gray-200 pb-2 mb-4 flex justify-between items-center">
					<h2 className="text-2xl text-center text-secondary font-bold flex-grow">
						Submission
					</h2>
					<button
						onClick={closeModal}
						className="text-gray-400 hover:text-gray-600">
						<FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
					</button>
				</div>
				{submissionDetails && (
					<div className="flex flex-col min-w-max space-y-6">
						<div className="w-full">
							<h2 className="text-secondary font-bold text-left w-full text-lg">
								Code
							</h2>
							<pre className="bg-gray-900 text-white p-4 rounded-lg min-w-max overflow-auto h-96">
								<code>{submissionDetails?.source_code}</code>
							</pre>
						</div>
						<div className="flex flex-col w-full justify-start items-center space-y-4">
							<table className="table-auto w-full bg-gray-50 rounded-lg overflow-hidden">
								<thead className="bg-secondary text-white">
									<tr>
										<th className="px-4 py-2 text-left">Submission ID</th>
										<th className="px-4 py-2 text-left">Language</th>
										<th className="px-4 py-2 text-left">Problem ID</th>
										<th className="px-4 py-2 text-left">Status</th>
									</tr>
								</thead>
								<tbody className="text-basecolor">
									<tr className="bg-white border-b border-gray-200">
										<td className="px-4 py-2">{submissionDetails?.id}</td>
										<td className="px-4 py-2">
											{submissionDetails?.language_id}
										</td>
										<td className="px-4 py-2">
											{submissionDetails?.problem_id}
										</td>
										<td className="px-4 py-2">{submissionDetails?.status}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="mt-4 w-full">
							<h2 className="text-lg text-secondary font-semibold">
								Testcases Verdict
							</h2>
							<table className="table-auto w-full bg-gray-50 rounded-lg overflow-hidden">
								<thead className="bg-secondary text-white">
									<tr>
										<th className="px-4 py-2 text-left">Testcase</th>
										<th className="px-4 py-2 text-left">Status</th>
										<th className="px-4 py-2 text-left">Time</th>
										<th className="px-4 py-2 text-left">Memory</th>
									</tr>
								</thead>
								<tbody className="text-basecolor">
									{submissionDetails?.testcasesVerdict.map(
										(testcase, index) => (
											<tr
												key={index}
												className="bg-white border-b border-gray-200">
												<td className="px-4 py-2">{index + 1}</td>
												<td
													className={`px-4 py-2 font-bold ${
														testcase.status === "Accepted"
															? "text-success"
															: "text-error"
													}`}>
													{testcase.status}
												</td>
												<td className="px-4 py-2">{testcase.time}</td>
												<td className="px-4 py-2">{testcase.memory}</td>
											</tr>
										),
									)}
								</tbody>
							</table>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default SubmissionDetails;
