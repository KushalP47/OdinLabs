import { useForm } from "react-hook-form";

const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const signin = (data: any) => {
		console.log(data);
	};
	return (
		<div className="flex min-h-screen justify-center items-center">
			<div className="bg-white border-4 border-blue px-20 rounded-lg shadow-lg flex flex-col justify-between">
				<h2 className="text-4xl font-bold mb-6 mt-5 text-center text-black">
					Login
				</h2>
				<form onSubmit={handleSubmit(signin)} className="space-y-6">
					<div>
						<label
							htmlFor="useremail"
							className="block text-sm font-medium text-black">
							Email
						</label>
						<input
							{...register("email", { required: true })}
							type="email"
							id="useremail"
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
						{errors.email && <p className="text-red">Email is required.</p>}
					</div>
					<div>
						<label
							htmlFor="userpassword"
							className="block text-sm font-medium text-black">
							Password
						</label>
						<input
							{...register("password", { required: true })}
							type="password"
							id="userpassword"
							className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
						/>
						{errors.password && (
							<p className="text-red">Password is required.</p>
						)}
					</div>
					<div>
						<button
							type="submit"
							className="w-full flex justify-center py-2 px-4 mb-4 border-4 border-transparent rounded-md shadow-sm text-sm font-medium bg-black text-blue hover:bg-blue hover:text-black">
							Login
						</button>
					</div>
				</form>
			</div>
			{/* <div className="flex justify-center border-4 border-black">
				<img
					src="./src/assets/react.svg"
					alt="Illustration"
					className="w-full h-full rounded-lg shadow-lg"
				/>
			</div> */}
		</div>
	);
};

export default Login;
