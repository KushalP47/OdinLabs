import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMinutes, parseISO, format, formatISO, toDate } from "date-fns";
import { useParams } from "react-router-dom";
import { Contest } from "../../types/contest";
import { contestService } from "../../api/contestService"; // Assuming contestService is defined for API calls
import ErrorModal from "../../components/Utils/ErrorModal";
import SuccessModal from "../../components/Utils/SuccessModal";
import Navbar from "../../components/Utils/Navbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const UpdateContest = () => {
	const { contestId } = useParams<{ contestId: string }>();
	const { register, handleSubmit, control, setValue } = useForm<Contest>();
	const [contest, setContest] = useState<Contest | null>(null);
	const [problems, setProblems] = useState<number[]>([]);
	const [message, setMessage] = useState("");
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);

	useEffect(() => {
		if (contestId) {
			const fetchContest = async () => {
				const response = await contestService.getContest(contestId);
				if (response.data.ok) {
					const contestData = response.data.contest;
					setContest(contestData);

					// Set form data with current contest details
					setValue("contestId", contestData.contestId);
					setValue("contestName", contestData.contestName);
					setValue("contestDescription", contestData.contestDescription);
					setValue("contestSection", contestData.contestSection);
					setValue(
						"contestStartTime",
						formatISO(parseISO(contestData.contestStartTime)),
					);
					setValue(
						"contestEndTime",
						formatISO(parseISO(contestData.contestEndTime)),
					);
					setProblems(contestData.contestProblems);
				} else {
					setMessage(response.message);
					setErrorModalOpen(true);
				}
			};
			fetchContest();
		} else {
			setMessage("No contest ID provided.");
			setErrorModalOpen(true);
		}
	}, [contestId, setValue]);

	const onSubmit = async (data: Contest) => {
		// Convert IST time to UTC for consistent storage and retrieval
		const convertToIST = (date: Date) => {
			const dateInUTC = addMinutes(date, -330); // IST is UTC+5:30
			return format(dateInUTC, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"); // ISO string
		};

		const startTime =
			typeof data.contestStartTime === "string"
				? parseISO(data.contestStartTime)
				: data.contestStartTime;
		const endTime =
			typeof data.contestEndTime === "string"
				? parseISO(data.contestEndTime)
				: data.contestEndTime;

		const updatedContest = {
			...data,
			contestStartTime: convertToIST(startTime),
			contestEndTime: convertToIST(endTime),
			contestProblems: problems,
		};
		if (contestId !== undefined) {
			const response = await contestService.updateContest(
				contestId,
				updatedContest,
			);
			console.log(response);
			if (response.data.ok) {
				setMessage("Contest updated successfully.");
				setSuccessModalOpen(true);
			} else {
				setMessage(response.message || "Failed to update contest.");
				setErrorModalOpen(true);
			}
		} else {
			setMessage("Contest ID is undefined.");
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
						Update Contest
					</h2>
					{contest && (
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
									className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-md"
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
									className="w-full px-3 py-2 border-2 border-gray-300 bg-white rounded-md"
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
									className="w-full px-3 py-2 border-2 bg-white border-gray-300 rounded-md"
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
									defaultValue={String(new Date(contest.contestStartTime))}
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
									htmlFor="contestEndTime">
									Contest End Time
								</label>
								<Controller
									name="contestEndTime"
									control={control}
									defaultValue={String(new Date(contest.contestEndTime))}
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
									htmlFor="contestDescription">
									Contest Description
								</label>
								<Controller
									control={control}
									name="contestDescription"
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
								Update Contest
							</button>
						</form>
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

export default UpdateContest;
