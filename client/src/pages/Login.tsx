import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { login } from "../store/authSlice";
import { authService } from "../api/authService";
import { useNavigate } from "react-router-dom";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const signin = async (data: any) => {
		console.log(data);
		const response = await authService.login(data);
		console.log(response);
		if (response.statusCode === 200) {
			const token = response.data.accessToken;
			localStorage.setItem("accessToken", token);
			localStorage.setItem("userData", JSON.stringify(response.data.user));
			dispatch(login({ userData: response.data.user, accessToken: token }));
			navigate("/dashboard");
		} else {
			alert(response.message);
		}
	};
	return (
		<div className="hero bg-white min-h-screen">
			<div className="hero-content w-1/2 flex-col lg:flex-row-reverse">
				<div className="text-center lg:text-left">
					<h1 className="text-5xl text-secondary font-bold">Login now!</h1>
					<p className="py-6 text-basecolor">
						Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
						excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
						a id nisi.
					</p>
				</div>
				<div className="card bg-white border-4 border-secondary w-full max-w-sm shrink-0 shadow-2xl">
					<form onSubmit={handleSubmit(signin)} className="card-body">
						<div className="form-control">
							<label htmlFor="useremail" className="label">
								<span className="label-text text-black text-lg">Email</span>
							</label>
							<input
								{...register("email", { required: true })}
								type="email"
								id="useremail"
								placeholder="email"
								className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
							/>
							{errors.email && <p className="text-error">Email is required.</p>}
						</div>
						<div className="form-control">
							<label htmlFor="userpassword" className="label">
								<span className="label-text text-black text-lg">Password</span>
							</label>
							<input
								{...register("password", { required: true })}
								type="password"
								id="userpassword"
								placeholder="password"
								className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
							/>
							{errors.password && (
								<p className="text-error">Password is required.</p>
							)}
							<label className="label">
								<a
									href="#"
									className="label-text-alt text-black link link-hover">
									Forgot password?
								</a>
							</label>
						</div>
						<div className="form-control mt-6">
							<button
								type="submit"
								className="btn btn-primary text-white text-lg">
								Login
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
