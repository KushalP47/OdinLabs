import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { authService } from "../api/authService";
import { getCookie } from "../lib/cookieUtility";
import { useNavigate } from "react-router-dom";
import { login } from "../store/authSlice";

const Register = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const registerUser = async (data: any) => {
		console.log(data);
		const response = await authService.register(data);
		console.log(response);
		if (response.statusCode === 200) {
			const token = getCookie("accessToken");
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
				<h1 className="text-5xl text-secondary font-bold">Register now!</h1>
				<p className="py-6 text-basecolor">
					Register yourself
				</p>
			</div>
			<div className="card bg-white border-4 border-secondary w-full max-w-sm shrink-0 shadow-2xl">
				<form onSubmit={handleSubmit(registerUser)} className="card-body">
					<div className="form-control">
						<label htmlFor="username" className="label">
							<span className="label-text text-black text-lg">Name</span>
						</label>
						<input
							{...register("name", { required: true })}
							type="string"
							id="username"
							placeholder="name"
							className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
						/>
						{errors.name && <p className="text-error">Name is required.</p>}
					</div>
					<div>
						<label htmlFor="userrollNumber" className="label">
							<span className="label-text text-black text-lg">Roll No.</span>
						</label>
						<input
							{...register("rollNumber", { required: true })}
							type="string"
							id="rollNumber"
							placeholder="Roll No (AU..)"
							className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
						/>
						{errors.rollNumber && <p className="text-error">Roll No. is required.</p>}
					</div>
					<div className="form-control mt-2">
						<label htmlFor="sectionSelect" className="label">
							<span className="label-text text-black text-lg">Choose Section</span>
						</label>
						<select
							{...register("section", { required: true })}
							id="sectionSelect"
							className="mt-1 block w-full px-3 py-2 border border-secondary bg-white text-basecolor rounded-md shadow-sm sm:text-sm"
						>
							<option value="">Select Section</option>
							<option value="1">1</option>
							<option value="2">2</option>
						</select>
						{errors.section && <p className="text-error">Section is required.</p>}
					</div>
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
					</div>
					<div className="form-control mt-6">
						<button
							type="submit"
							className="btn btn-primary text-white text-lg">
							Register
						</button>
					</div>
				</form>
			</div>
		</div>
	</div>
	);
};

export default Register;
