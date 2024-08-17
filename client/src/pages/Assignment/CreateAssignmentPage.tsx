import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../components/Utils/Navbar";
import ErrorModal from "../../components/Utils/ErrorModal";
import SuccessModal from "../../components/Utils/SuccessModal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, format, toDate } from "date-fns";
import { Assignment } from "../../types/assignment";
import { assignmentService } from "../../api/assignmentService";

const CreateAssignmentPage = () => {
	const { register, handleSubmit, control, reset } = useForm<Assignment>();
	const [message, setMessage] = useState<string>("");
	const [errorModalOpen, setErrorModalOpen] = useState<boolean>(false);
	const [successModalOpen, setSuccessModalOpen] = useState<boolean>(false);
	const [problems, setProblems] = useState<number[]>([]);

	// Handle the creation of an assignment
	const handleCreateAssignmentClick = async (data: any) => {
		try {
			// Convert IST time to UTC for consistent storage and retrieval
			const convertToIST = (date: Date) => {
				const dateInUTC = addMinutes(date, -330); // IST is UTC+5:30
				return format(dateInUTC, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // ISO string
			};

			const formattedData = {
				...data,
				assignmentStartTime: convertToIST(data.assignmentStartTime),
				assignmentEndTime: convertToIST(data.assignmentEndTime),
				assignmentProblems: problems,
			};

			console.log(formattedData);

			const response = await assignmentService.createAssignment(formattedData);

			if (response.data.ok) {
				setMessage("Assignment created successfully!");
				setSuccessModalOpen(true);
				reset();
				setProblems([]); // Reset problem list
			} else {
				setMessage(response.data.message || "Failed to create assignment.");
				setErrorModalOpen(true);
			}
		} catch (error) {
			setMessage("An unexpected error occurred.");
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
						Create Assignment
					</h2>
					<form onSubmit={handleSubmit(handleCreateAssignmentClick)}>
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
								className="w-full px-3 py-2 border-2 border-gray-300 text-basecolor bg-white rounded-md"
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
								className="w-full px-3 py-2 border-2 border-gray-300 bg-white text-basecolor rounded-md"
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
								className="w-full px-3 py-2 border-2 bg-white text-basecolor border-gray-300 rounded-md"
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
								defaultValue={String(new Date())} // Default to current date
								render={({ field }) => (
									<DatePicker
										selected={toDate(field.value)}
										onChange={(date) => field.onChange(date)}
										showTimeSelect
										dateFormat="Pp"
										className="w-full px-3 py-2 border-2 bg-white border-gray-300 rounded-md text-basecolor"
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
								defaultValue={String(new Date())} // Default to current date
								render={({ field }) => (
									<DatePicker
										selected={toDate(field.value)}
										onChange={(date) => field.onChange(date)}
										showTimeSelect
										dateFormat="Pp"
										className="w-full px-3 py-2 border-2 bg-white border-gray-300 rounded-md text-basecolor"
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
								render={({ field }) => (
									<ReactQuill
										theme="snow"
										value={field.value || ""}
										onChange={field.onChange}
										className="bg-white text-basecolor border border-gray-300 rounded-md"
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
										className="w-full px-3 py-2 border text-basecolor bg-white border-gray-300 rounded-md"
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
								className="btn btn-sm btn-primary">
								Add Problem
							</button>
						</div>

						<button
							type="submit"
							className="btn btn-primary w-full text-white text-lg py-2">
							Create Assignment
						</button>
					</form>
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

export default CreateAssignmentPage;
