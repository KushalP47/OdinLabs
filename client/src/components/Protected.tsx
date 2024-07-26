import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ErrorModal from "./ErrorModal"; // Import the ErrorModal component

interface ProtectedProps {
	children: React.ReactNode;
	onlyAdminAllowed: boolean;
	allowDuringContest: boolean;
	isLoggedIn: boolean;
}

const Protected = ({
	children,
	onlyAdminAllowed,
	allowDuringContest,
	isLoggedIn,
}: ProtectedProps) => {
	const navigate = useNavigate();
	const user = useSelector((state: any) => state.auth.userData);
	const status = useSelector((state: any) => state.auth.status);
	const isOngoingContest = useSelector(
		(state: any) => state.contest.isOngoingContest,
	);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const showErrorModal = (message: string) => {
		setErrorMessage(message);
		setIsErrorModalOpen(true);
	};

	// Check if the user state and status are defined
	const isStorePopulated = user !== undefined && status !== undefined;

	useEffect(() => {
		if (isStorePopulated) {
			if (isLoggedIn) {
				if (status === false) {
					showErrorModal("You need to be logged in to access this page.");
					navigate("/auth/login");
				} else {
					if (onlyAdminAllowed) {
						if (user && user.userIsAdmin === false) {
							showErrorModal("You do not have permission to access this page.");
							navigate(-1);
						}
					} else {
						if (user && user.userIsAdmin === false) {
							if (allowDuringContest) {
								if (!isOngoingContest) {
									showErrorModal(
										"This page can be accessed during an ongoing contest only.",
									);
									navigate(-1);
								}
							}
						}
					}
				}
			}
		}
	}, [
		isStorePopulated, // Add the new condition to the dependencies array
		user,
		status,
		isLoggedIn,
		onlyAdminAllowed,
		allowDuringContest,
		isOngoingContest,
		navigate,
	]);

	const handleCloseErrorModal = () => {
		setIsErrorModalOpen(false);
	};

	// Render a loading message until the Redux store is populated
	return !isStorePopulated ? (
		<>Loading......</>
	) : (
		<>
			{children}
			<ErrorModal
				isOpen={isErrorModalOpen}
				onClose={handleCloseErrorModal}
				message={errorMessage}
			/>
		</>
	);
};

export default Protected;
