import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Assignment } from "../../types/assignment";
import { assignmentService } from "../../api/assignmentService";
import ErrorModal from "../../components/Utils/ErrorModal";
import SuccessModal from "../../components/Utils/SuccessModal";
import Navbar from "../../components/Utils/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { addMinutes, format, formatISO, parseISO, toDate } from "date-fns";

const UpdateAssignment = () => {
	const { assignmentId } = useParams<{ assignmentId: string }>();
	const [assignment, setAssignment] = useState<Assignment | null>(null);
	const [message, setMessage] = useState("");
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);
	const { register, handleSubmit, control, setValue, reset } =
		useForm<Assignment>();
	const [problems, setProblems] = useState<number[]>([]);

	useEffect(() => {
		if (assignmentId) {
			const fetchAssignment = async () => {
				const response = await assignmentService.getAssignment(assignmentId);
				if (response.data.ok) {
					const assignmentData = response.data.assignment;
					setAssignment(assignmentData);

					// Set form data with current assignment details
					setValue("assignmentId", assignmentData.assignmentId);
					setValue("assignmentName", assignmentData.assignmentName);
					setValue("assignmentSection", assignmentData.assignmentSection);
					setValue(
						"assignmentStartTime",
						formatISO(parseISO(assignmentData.assignmentStartTime)),
					);
					setValue(
						"assignmentEndTime",
						formatISO(parseISO(assignmentData.assignmentEndTime)),
					);
					setValue(
						"assignmentDescription",
						assignmentData.assignmentDescription,
					);
					setProblems(assignmentData.assignmentProblems);
				} else {
					setMessage(response.message);
					setErrorModalOpen(true);
				}
			};
			fetchAssignment();
		} else {
			setMessage("No assignment ID provided.");
			setErrorModalOpen(true);
		}
	}, [assignmentId, setValue]);

	const updateAssignment = async (data: Assignment) => {
		// Convert IST time to UTC for consistent storage and retrieval
		const convertToIST = (date: Date) => {
			const dateInUTC = addMinutes(date, -330); // IST is UTC+5:30
			return format(dateInUTC, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // ISO string
		};
		const startTime =
			typeof data.assignmentStartTime === "string"
				? parseISO(data.assignmentStartTime)
				: data.assignmentStartTime;
		const endTime =
			typeof data.assignmentEndTime === "string"
				? parseISO(data.assignmentEndTime)
				: data.assignmentEndTime;

		const updatedAssignment = {
			...data,
			assignmentStartTime: convertToIST(startTime),
			assignmentEndTime: convertToIST(endTime),
			assignmentProblems: problems,
		};

		const response = await assignmentService.updateAssignment(
			assignmentId,
			updatedAssignment,
		);

		if (response.data.ok) {
			setMessage("Assignment updated successfully.");
			setSuccessModalOpen(true);
			reset();
			setProblems([]); // Reset problem list
		} else {
			setMessage(response.message || "Failed to update the assignment.");
			setErrorModalOpen(true);
		}
	};

	// Handle adding a new problem ID
	const handleAddProblem = () => {
		setProblems([...problems, 0]);
	};

	// Handle removing a problem ID
	const handleRemoveProblem = (index: number) => {
		const newProblems = [...problems];
		newProblems.splice(index, 1);
		setProblems(newProblems);
	};

	// Handle changing a problem ID
	const handleProblemChange = (index: number, value: number) => {
		const newProblems = [...problems];
		newProblems[index] = value;
		setProblems(newProblems);
	};

	return (
		<>
			<Navbar currentPage="Assignments" />
			<div className="flex flex-col min-h-screen">
				<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
					<h2 className="text-2xl text-basecolor font-bold mb-4 text-center">
						Update Assignment
					</h2>
					{assignment ? (
						<form onSubmit={handleSubmit(updateAssignment)}>
							<div className="mb-4">
								<label
									className="block text-gray-700 font-bold mb-2"
									htmlFor="assignmentId">
									Assignment ID
								</label>
								<input
									{...register("assignmentId", { required: true })}
									type="text"
									id="assignmentId"
									placeholder="Enter assignment ID"
									className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-md"
									defaultValue={assignment.assignmentId}
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-gray-700 font-bold mb-2"
									htmlFor="assignmentName">
									Assignment Name
								</label>
								<input
									{...register("assignmentName", { required: true })}
									type="text"
									id="assignmentName"
									placeholder="Enter assignment name"
									className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-md"
									defaultValue={assignment.assignmentName}
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-gray-700 font-bold mb-2"
									htmlFor="assignmentSection">
									Assignment Section
								</label>
								<input
									{...register("assignmentSection", { required: true })}
									type="text"
									id="assignmentSection"
									placeholder="Enter section"
									className="w-full px-3 py-2 border-2 bg-white border-gray-300 rounded-md"
									defaultValue={assignment.assignmentSection}
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-gray-700 font-bold mb-2"
									htmlFor="assignmentStartTime">
									Assignment Start Time
								</label>
								<Controller
									name="assignmentStartTime"
									control={control}
									defaultValue={String(
										new Date(assignment.assignmentStartTime),
									)}
									render={({ field }) => (
										<DatePicker
											selected={toDate(field.value)}
											onChange={(date) => field.onChange(date)}
											showTimeSelect
											dateFormat="Pp"
											className="w-full px-3 py-2 border-2 bg-white border-gray-300 rounded-md"
											timeFormat="HH:mm"
											timeIntervals={15}
											timeCaption="Time"
										/>
									)}
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-gray-700 font-bold mb-2"
									htmlFor="assignmentEndTime">
									Assignment End Time
								</label>
								<Controller
									name="assignmentEndTime"
									control={control}
									defaultValue={String(new Date(assignment.assignmentEndTime))}
									render={({ field }) => (
										<DatePicker
											selected={toDate(field.value)}
											onChange={(date) => field.onChange(date)}
											showTimeSelect
											dateFormat="Pp"
											className="w-full px-3 py-2 border-2 bg-white border-gray-300 rounded-md"
											timeFormat="HH:mm"
											timeIntervals={15}
											timeCaption="Time"
										/>
									)}
								/>
							</div>

							<div className="mb-4">
								<label
									className="block text-gray-700 font-bold mb-2"
									htmlFor="assignmentDescription">
									Assignment Description
								</label>
								<Controller
									control={control}
									name="assignmentDescription"
									defaultValue={assignment.assignmentDescription}
									render={({ field }) => (
										<ReactQuill
											theme="snow"
											value={field.value || ""}
											onChange={field.onChange}
											className="bg-white text-black border border-gray-300 rounded-md"
										/>
									)}
								/>
							</div>

							<div className="mb-4">
								<label className="block text-gray-700 font-bold mb-2">
									Assignment Problems
								</label>
								{problems.map((problem, index) => (
									<div key={index} className="flex items-center mb-2">
										<input
											type="number"
											value={problem}
											onChange={(e) =>
												handleProblemChange(index, parseInt(e.target.value, 10))
											}
											placeholder="Enter problem ID"
											className="w-full px-3 py-2 border border-gray-300 rounded-md"
										/>
										<button
											type="button"
											onClick={() => handleRemoveProblem(index)}
											className="ml-2 btn btn-xs btn-error">
											Remove
										</button>
									</div>
								))}
								<button
									type="button"
									onClick={handleAddProblem}
									className="btn btn-sm btn-secondary">
									Add Problem
								</button>
							</div>

							<button
								type="submit"
								className="btn btn-primary w-full text-white text-lg py-2">
								Update Assignment
							</button>
						</form>
					) : (
						<p className="text-center">Loading assignment details...</p>
					)}
				</div>
			</div>

			{errorModalOpen && (
				<ErrorModal
					message={message}
					onClose={() => setErrorModalOpen(false)}
					isOpen={errorModalOpen}
				/>
			)}

			{successModalOpen && (
				<SuccessModal
					message={message}
					onClose={() => setSuccessModalOpen(false)}
					isOpen={successModalOpen}
				/>
			)}
		</>
	);
};

export default UpdateAssignment;
