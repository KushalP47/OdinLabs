import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import { setContestData } from "./store/contestSlice";
import { getCookie } from "./lib/cookieUtility";

function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isStorePopulated, setIsStorePopulated] = useState(false);

	useEffect(() => {
		const token = getCookie("accessToken");
		if (!token) {
			navigate("/auth/login"); // Redirect to login if there's no token
		} else {
			const userData = localStorage.getItem("userData");
			if (userData) {
				const user = JSON.parse(userData);
				dispatch(login({ userData: user, accessToken: token }));
			}
			const customContestCookie = getCookie("customContestCookie");
			if (customContestCookie) {
				dispatch(setContestData({ customContestCookie }));
			}
			setIsStorePopulated(true); // Set store populated after dispatching
		}
	}, [dispatch, navigate]);

	if (!isStorePopulated) {
		// Render a loading screen until the Redux store is populated
		return <div>Loading...</div>;
	}

	return <Outlet />;
}

export default App;
