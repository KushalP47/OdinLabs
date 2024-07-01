import { useEffect, useState } from "react";
import { authService } from "../api/authService";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const signout = async () => {
			setLoading(true);
			const res = await authService.logout();
			if (res.statusCode === 200) {
				dispatch(logout());
				localStorage.removeItem("accessToken");
				localStorage.removeItem("userData");
				setLoading(false);
				console.log("Logged out");
				navigate("/dashboard");
			} else {
				console.log("Error logging out", res);
			}
		};
		signout();
	}, []);

	return !loading ? (
		<>
			<h1>Logout</h1>
		</>
	) : null;
}

export default Logout;
