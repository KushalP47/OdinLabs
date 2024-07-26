import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
	const userIsAdmin = user?.userIsAdmin;
	const [loader, setLoader] = useState(true);
	const isOngoingContest = useSelector(
		(state: any) => state.contest.isOngoingContest,
	);

	useEffect(() => {
		if (isLoggedIn) {
			if (status === false) {
				// toast of react-toastify is used to show a custom message to the user
				navigate("/login");
			} else {
				if (onlyAdminAllowed) {
					if (!userIsAdmin) {
						// toast of react-toastify is used to show a custom message to the user
						navigate(-1);
					}
				} else {
					if (!userIsAdmin) {
						if (!allowDuringContest) {
							if (isOngoingContest) {
								// toast of react-toastify is used to show a custom message to the user
								navigate(-1);
							}
						} else {
							if (!isOngoingContest) {
								// toast of react-toastify is used to show a custom message to the user
								navigate(-1);
							}
						}
					}
				}
			}
		} else {
			// toast of react-toastify is used to show a custom message to the user
			navigate("/login");
		}
		setLoader(false);
	}, [status, user]);

	return loader ? <>Loading...</> : <>{children}</>;
};

export default Protected;
