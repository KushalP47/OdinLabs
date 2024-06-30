import Navbar from "../components/Navbar";
import { useEffect } from "react";

const Contest = () => {

	useEffect(() => {
		
	}, []);

	
	return (
		<div className="flex min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Contest" />

			{/* Right Section */}
			<div className="bg-white w-5/6 border-4 border-blue shadow-xl flex flex-col p-8">
				{/* Title Section */}
				<div className="flex justify-start mb-8">
					<h1 className="text-4xl font-bold">Contest</h1>
				</div>

				{/* Content Section */}
				<div className="flex-1 overflow-auto">
					
				</div>
			</div>
		</div>
	);
};

export default Contest;
