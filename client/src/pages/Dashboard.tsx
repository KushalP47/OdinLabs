import { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Dashboard = () => {
	const status = useSelector((state: any) => state.auth.status);

	const [counter, setCounter] = useState(0);
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Dashboard" />

			{/* Right Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				{/* Title Section */}
				<div className="flex justify-start mb-8">
					<h1 className="text-4xl text-basecolor font-bold">Dashboard</h1>
				</div>

				{/* Content Section */}

				<div>
					{status && (
						<div className="flex-1 flex shadow-lg border-4 border-basecolor rounded-lg justify-center items-center flex-col">
							{/* Counter Display */}
							<div className="mb-4 text-2xl font-semibold border-4 border-basecolor px-8">
								{counter}
							</div>

							{/* Counter Controls */}
							<div className="flex space-x-4">
								<button
									className="bg-secondary text-primary px-4 py-2 rounded shadow"
									onClick={() => setCounter(counter - 1)}>
									-
								</button>
								<button
									className="bg-secondary text-primary px-4 py-2 rounded shadow"
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
								<button className="py-2 px-4 m-2 hover:bg-basecolor hover:text-secondary border-4 hover:border-secondary rounded bg-secondary text-basecolor border-basecolor transition duration-300">
									<Link to="/auth/login">Login</Link>
								</button>
								<button className="py-2 px-4 m-2 hover:bg-basecolor hover:text-secondary border-4 hover:border-secondary rounded bg-secondary text-basecolor border-basecolor transition duration-300">
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
