import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

function Logout() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		if (localStorage.getItem("accessToken") === null) {
			setLoading(false);
			navigate("/dashboard");
			return;
		}
		dispatch(logout());
		localStorage.removeItem("accessToken");
		localStorage.removeItem("userData");
		setLoading(false);
		console.log("Logged out");
		navigate("/dashboard");
	}, []);

	return !loading ? (
		<>
			<h1>Logout</h1>
		</>
	) : (
		<span className="loading loading-spinner loading-4xl text-secondary"></span>
	);
}

export default Logout;
