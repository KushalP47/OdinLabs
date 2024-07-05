import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
const Problems = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	useEffect(() => {
		setStatus(currentStatus);
	}, []);
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Practice" />

			{/* Right Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{status && <div></div>}
					{!status && (
						<h2 className="text-2xl text-basecolor">
							Please login to view this page
						</h2>
					)}
				</div>
			</div>
		</div>
	);
};

export default Problems;
