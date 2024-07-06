import { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";

const Dashboard = () => {
	const status = useSelector((state: any) => state.auth.status);

	const [counter, setCounter] = useState(0);
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Dashboard" />

			{/* Right Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				{/* Content Section */}

				<div>
					{status && (
						<div className="flex-1 flex shadow-lg rounded-lg justify-center items-center flex-col py-4">
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
							<h2 className="text-2xl text-basecolor">
								Please login to view this page
							</h2>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
