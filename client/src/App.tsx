import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import { getCookie } from "./lib/cookieUtility";
function App() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		const token = getCookie("accessToken");
		if (!token) {
			navigate("/dashboard");
		} else {
			// Redirect to dashboard
			const userData = localStorage.getItem("userData");
			if (userData) {
				const user = JSON.parse(userData);
				dispatch(login({ userData: user, accessToken: token }));
			}
			// navigate("/dashboard");
		}
	}, []);
	return <Outlet />;
}

export default App;
