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
			await authService.logout();
			dispatch(logout());
			setLoading(false);
			console.log("Logged out");
			navigate("/dashboard");
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
