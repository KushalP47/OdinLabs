import { useState, useEffect } from "react";
import { userService } from "../../api/userService";
import { useNavigate } from "react-router-dom";
import { User } from "../../types/user";
import ErrorModal from "../Utils/ErrorModal";
import SuccessModal from "../Utils/SuccessModal";

const UserTable = () => {
	const [users, setUsers] = useState([]);
	const [selectedSection, setSelectedSection] = useState<"1" | "2" | "3">("1");
	const navigate = useNavigate();
	const [errorModal, setErrorModal] = useState(false);
	const [message, setMessage] = useState("");
	const [successModal, setSuccessModal] = useState(false);
	const handleEditUser = async (userRollNumber: string) => {
		navigate(`/edit/${userRollNumber}`);
	};
	const handleRegenerateSecretUser = async (userEmail: string) => {
		const response = await userService.changeUserSecret(userEmail);
		if (response.data.ok) {
			setMessage(response.data.message);
			setSuccessModal(true);
		} else {
			setMessage(response.data.message);
			setErrorModal(true);
		}
	};

	useEffect(() => {
		const getUsers = async () => {
			const response = await userService.getUsersFromSection(selectedSection);
			if (response.data.ok) {
				setUsers(response.data.data);
			} else {
				setMessage(response.data.message);
				setErrorModal(true);
			}
		};
		getUsers();
	}, [selectedSection]);

	return (
		<>
			<div className="w-full flex flex-col justify-center items-center">
				{errorModal && (
					<ErrorModal
						message={message}
						isOpen={errorModal}
						onClose={() => setErrorModal(false)}
					/>
				)}
				{successModal && (
					<SuccessModal
						message={message}
						isOpen={successModal}
						onClose={() => setSuccessModal(false)}
					/>
				)}
				<div className="w-full tabs tabs-boxed mt-8 mb-4 bg-gray-100 font-bold text-xl">
					<a
						className={`tab ${
							selectedSection === "1"
								? "bg-white text-secondary text-xl"
								: "text-xl"
						}`}
						onClick={() => setSelectedSection("1")}>
						Section 1
					</a>
					<a
						className={`tab ${
							selectedSection === "2"
								? "bg-white text-secondary text-xl"
								: "text-xl"
						}`}
						onClick={() => setSelectedSection("2")}>
						Section 2
					</a>
					<a
						className={`tab ${
							selectedSection === "3"
								? "bg-white text-secondary text-xl"
								: "text-xl"
						}`}
						onClick={() => setSelectedSection("3")}>
						Section 3
					</a>
				</div>
				<div className="mt-10 w-full px-6 lg:px-10">
					<div className="shadow overflow-hidden border-b border-secondary rounded-lg">
						<table className="min-w-full bg-white divide-y divide-secondary">
							<thead className="bg-basecolor">
								<tr>
									<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
										Roll Number
									</th>
									<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
										Name
									</th>
									<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
										Email
									</th>
									<th className="px-6 py-3 text-left text-md font-medium text-white uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{users.length > 0 &&
									users.map((user: User, index: number) => (
										<tr
											className={`hover:bg-gray-100 cursor-pointer ${
												index % 2 === 0 ? "bg-gray-50" : "bg-white"
											}`}
											key={user.userRollNumber}>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-basecolor">
												{user.userRollNumber}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-basecolor">
												{user.userName}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-basecolor">
												{user.userEmail}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex flex-row m-2">
												<button
													onClick={() => handleEditUser(user.userRollNumber)}
													className="btn btn-primary text-white text-lg">
													Edit
												</button>
												<div className="divider divider-horizontal"></div>
												<button
													onClick={() =>
														handleRegenerateSecretUser(user.userEmail)
													}
													className="btn btn-success bg-green-500 text-white text-lg">
													Regenerate Secret
												</button>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
};

export default UserTable;
