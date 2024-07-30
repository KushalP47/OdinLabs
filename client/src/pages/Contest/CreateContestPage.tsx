import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, format, toDate } from "date-fns";
import { contestService } from "../../api/contestService"; // Assuming contestService is defined for API calls
import ErrorModal from "../../components/Utils/ErrorModal";
import SuccessModal from "../../components/Utils/SuccessModal";
import Navbar from "../../components/Utils/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export interface Contest {
	contestId: number;
	contestName: string;
	contestDescription: string;
	contestProblems: number[];
	contestStartTime: string;
	contestEndTime: string;
	contestSection: string;
}

const CreateContestPage: React.FC = () => {
	const { register, handleSubmit, control, reset } = useForm<Contest>();
	const [problems, setProblems] = useState<number[]>([]);
	const [message, setMessage] = useState("");
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	// Convert local date to UTC
	const convertToUTC = (date: Date) => {
		const dateInUTC = addMinutes(date, -330); // Adjusting IST to UTC
		return format(dateInUTC, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // ISO string
	};

	const onSubmit = async (data: Contest) => {
		const newContest = {
			...data,
			contestStartTime: convertToUTC(toDate(data.contestStartTime)),
			contestEndTime: convertToUTC(toDate(data.contestEndTime)),
			contestProblems: problems,
		};

		const response = await contestService.createContest(newContest); // API call to create contest

		if (response.data.ok) {
			setMessage("Contest created successfully.");
			setSuccessModalOpen(true);
			reset();
			setProblems([]);
		} else {
			setMessage(response.message || "Failed to create contest.");
			setErrorModalOpen(true);
		}
	};

	const handleAddProblem = () => {
		setProblems([...problems, 0]);
	};

	const handleRemoveProblem = (index: number) => {
		const newProblems = [...problems];
		newProblems.splice(index, 1);
		setProblems(newProblems);
	};

	const handleProblemChange = (index: number, value: number) => {
		const newProblems = [...problems];
		newProblems[index] = value;
		setProblems(newProblems);
	};

	return (
		<>
			<Navbar currentPage="Contests" />
			<div className="flex flex-col min-h-screen">
				<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
					<h2 className="text-2xl text-basecolor font-bold mb-4 text-center">
						Create Contest
					</h2>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="mb-4">
							<label
								className="block text-gray-700 font-bold mb-2"
								htmlFor="contestId">
								Contest ID
							</label>
							<input
								{...register("contestId", { required: true })}
								type="number"
								id="contestId"
								placeholder="Enter contest ID"
								className="w-full px-3 py-2 border-2 text-basecolor border-gray-300 bg-white rounded-md"
							/>
						</div>

						<div className="mb-4">
							<label
								className="block text-gray-700 font-bold mb-2"
								htmlFor="contestName">
								Contest Name
							</label>
							<input
								{...register("contestName", { required: true })}
								type="text"
								id="contestName"
								placeholder="Enter contest name"
								className="w-full px-3 py-2 border-2 text-basecolor border-gray-300 bg-white rounded-md"
							/>
						</div>

						<div className="mb-4">
							<label
								className="block text-gray-700 font-bold mb-2"
								htmlFor="contestSection">
								Contest Section
							</label>
							<input
								{...register("contestSection", { required: true })}
								type="text"
								id="contestSection"
								placeholder="Enter section"
								className="w-full px-3 py-2 border-2 text-basecolor bg-white border-gray-300 rounded-md"
							/>
						</div>

						<div className="mb-4">
							<label
								className="block text-gray-700 font-bold mb-2"
								htmlFor="contestStartTime">
								Contest Start Time
							</label>
							<Controller
								name="contestStartTime"
								control={control}
								defaultValue={String(new Date())}
								render={({ field }) => (
									<DatePicker
										selected={toDate(field.value)}
										onChange={(date) => field.onChange(date)}
										showTimeSelect
										dateFormat="Pp"
										className="w-full px-3 py-2 border-2 text-basecolor bg-white border-gray-300 rounded-md"
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
								htmlFor="contestEndTime">
								Contest End Time
							</label>
							<Controller
								name="contestEndTime"
								control={control}
								defaultValue={String(new Date())}
								render={({ field }) => (
									<DatePicker
										selected={toDate(field.value)}
										onChange={(date) => field.onChange(date)}
										showTimeSelect
										dateFormat="Pp"
										className="w-full px-3 py-2 border-2 text-basecolor bg-white border-gray-300 rounded-md"
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
								htmlFor="contestDescription">
								Contest Description
							</label>
							<Controller
								control={control}
								name="contestDescription"
								defaultValue=""
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
								Contest Problems
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
										className="w-full px-3 py-2 border-2 bg-white text-basecolor border-gray-300 rounded-md"
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
							Create Contest
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

export default CreateContestPage;
