import { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Dashboard = () => {
	const status = useSelector((state: any) => state.auth.status);
	
	const [counter, setCounter] = useState(0);
	return (
		<div className="flex min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Dashboard" />

			{/* Right Section */}
			<div className="bg-white w-5/6 border-4 border-blue shadow-xl flex flex-col p-8">
				{/* Title Section */}
				<div className="flex justify-start mb-8">
					<h1 className="text-4xl font-bold">Dashboard</h1>
				</div>

				{/* Content Section */}

				<div>
					{status && (
						<div className="flex-1 flex shadow-lg border-4 border-black rounded-lg justify-center items-center flex-col">
							{/* Counter Display */}
							<div className="mb-4 text-2xl font-semibold border-4 border-black px-8">
								{counter}
							</div>

							{/* Counter Controls */}
							<div className="flex space-x-4">
								<button
									className="bg-blue text-white px-4 py-2 rounded shadow"
									onClick={() => setCounter(counter - 1)}>
									-
								</button>
								<button
									className="bg-blue text-white px-4 py-2 rounded shadow"
									onClick={() => setCounter(counter + 1)}>
									+
								</button>
							</div>
						</div>
					)}
					{!status && (
						<>
							<h2 className="text-2xl">Please login to view this page</h2>
							<div className="flex flex-row justify-center items-center p-4">
								<button className="py-2 px-4 m-2 hover:bg-black hover:text-blue border-4 hover:border-blue rounded bg-blue text-black border-black transition duration-300">
									<Link to="/auth/login">Login</Link>
								</button>
								<button className="py-2 px-4 m-2 hover:bg-black hover:text-blue border-4 hover:border-blue rounded bg-blue text-black border-black transition duration-300">
									<Link to="/auth/register">Register</Link>
								</button>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
