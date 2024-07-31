import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import ErrorModal from "../Utils/ErrorModal";
import SuccessModal from "../Utils/SuccessModal";
import { userService } from "../../api/userService";
import Navbar from "../Utils/Navbar";

// Define types for form inputs
interface UserFormInputs {
	userEmail: string;
	userName: string;
	userRollNumber: string;
	userSection: string;
	userTeamName: string;
}

const EditUserForm = () => {
	const { userRollNumber } = useParams<{ userRollNumber: string }>();
	const [message, setMessage] = useState<string>("");
	const [errorModal, setErrorModal] = useState<boolean>(false);
	const [successModal, setSuccessModal] = useState<boolean>(false);

	// Initialize react-hook-form
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<UserFormInputs>();

	useEffect(() => {
		// Fetch user data and populate the form fields
		async function fetchUser() {
			try {
				if (!userRollNumber) {
					return;
				}
				const resp = await userService.getUser(userRollNumber);
				if (resp.data.ok) {
					const userData = resp.data.data;
					setValue("userEmail", userData.userEmail);
					setValue("userName", userData.userName);
					setValue("userRollNumber", userData.userRollNumber);
					setValue("userSection", userData.userSection);
					setValue("userTeamName", userData.userTeamName);
				} else {
					setMessage(resp.message);
					setErrorModal(true);
				}
			} catch (error) {
				setMessage("Error fetching user");
				setErrorModal(true);
			}
		}
		fetchUser();
	}, [userRollNumber, setValue]);

	const onSubmit: SubmitHandler<UserFormInputs> = async (data) => {
		try {
			const response = await userService.editUser(
				data.userEmail,
				data.userName,
				data.userRollNumber,
				data.userSection,
				data.userTeamName,
			);
			if (response.data.ok) {
				setMessage(response.data.message);
				setSuccessModal(true);
			} else {
				setMessage(response.data.message);
				setErrorModal(true);
			}
		} catch (error) {
			setMessage("Error updating user");
			setErrorModal(true);
		}
	};

	return (
		<>
			<div>
				<Navbar currentPage="Practice" />
				<div className="flex bg-white flex-col min-h-screen items-center justify-center">
					<div className="bg-white mt-4 rounded-xl w-full max-w-3xl border-4 border-secondary shadow-xl flex flex-col text-basecolor p-8">
						<h1 className="text-3xl font-bold mb-6 text-center text-secondary w-full">
							Update User
						</h1>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className="space-y-6"
							noValidate>
							{/* User Email */}
							<div className="flex flex-col">
								<label className="font-semibold mb-2" htmlFor="userEmail">
									Email
								</label>
								<input
									id="userEmail"
									type="email"
									readOnly
									className={`border p-2 bg-white rounded-lg ${
										errors.userEmail ? "border-red-500" : "border-gray-300"
									}`}
									{...register("userEmail", {
										required: "Email is required",
										pattern: {
											value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
											message: "Invalid email format",
										},
									})}
								/>
								{errors.userEmail && (
									<span className="text-red-500 text-sm">
										{errors.userEmail.message}
									</span>
								)}
							</div>

							{/* User Name */}
							<div className="flex flex-col">
								<label className="font-semibold mb-2" htmlFor="userName">
									Name
								</label>
								<input
									id="userName"
									type="text"
									className={`border p-2 bg-white rounded-lg ${
										errors.userName ? "border-red-500" : "border-gray-300"
									}`}
									{...register("userName", {
										required: "Name is required",
										minLength: {
											value: 3,
											message: "Name must be at least 3 characters long",
										},
									})}
								/>
								{errors.userName && (
									<span className="text-red-500 text-sm">
										{errors.userName.message}
									</span>
								)}
							</div>

							{/* User Roll Number */}
							<div className="flex flex-col">
								<label className="font-semibold mb-2" htmlFor="userRollNumber">
									Roll Number
								</label>
								<input
									id="userRollNumber"
									type="text"
									readOnly
									className={`border p-2 bg-white rounded-lg ${
										errors.userRollNumber ? "border-red-500" : "border-gray-300"
									}`}
									{...register("userRollNumber", {
										required: "Roll Number is required",
										pattern: {
											value: /^[A-Z0-9-]+$/,
											message: "Invalid Roll Number format",
										},
									})}
								/>
								{errors.userRollNumber && (
									<span className="text-red-500 text-sm">
										{errors.userRollNumber.message}
									</span>
								)}
							</div>

							{/* User Section */}
							<div className="flex flex-col">
								<label className="font-semibold mb-2" htmlFor="userSection">
									Section
								</label>
								<input
									id="userSection"
									type="text"
									className={`border p-2 bg-white text-basecolor first:rounded-lg ${
										errors.userSection ? "border-red-500" : "border-gray-300"
									}`}
									{...register("userSection", {
										required: "Section is required",
										minLength: {
											value: 1,
											message: "Section must be at least 1 character long",
										},
									})}
								/>
								{errors.userSection && (
									<span className="text-red-500 text-sm">
										{errors.userSection.message}
									</span>
								)}
							</div>

							{/* User Team Name */}
							<div className="flex flex-col">
								<label className="font-semibold mb-2" htmlFor="userTeamName">
									Team Name
								</label>
								<input
									id="userTeamName"
									type="text"
									className={`border p-2 bg-white text-basecolor rounded-lg ${
										errors.userTeamName ? "border-red-500" : "border-gray-300"
									}`}
									{...register("userTeamName", {
										required: "Team Name is required",
										minLength: {
											value: 1,
											message: "Team Name must be at least 1 character long",
										},
									})}
								/>
								{errors.userTeamName && (
									<span className="text-red-500 text-sm">
										{errors.userTeamName.message}
									</span>
								)}
							</div>

							{/* Submit Button */}
							<button
								type="submit"
								className="btn btn-primary text-lg text-white">
								Update User
							</button>
						</form>
					</div>

					{/* Error Modal */}
					{errorModal && (
						<ErrorModal
							message={message}
							onClose={() => setErrorModal(false)}
							isOpen={errorModal}
						/>
					)}

					{/* Success Modal */}
					{successModal && (
						<SuccessModal
							message={message}
							onClose={() => setSuccessModal(false)}
							isOpen={successModal}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default EditUserForm;
