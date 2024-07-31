import Navbar from "../components/Utils/Navbar";
import { useSelector } from "react-redux";
import { useState } from "react";
import ProfileCard from "../components/User/ProfileCard";
import PastContestsTable from "../components/Contest/PastContestsTable";
import PastAssignmentsTable from "../components/Assignment/PastAssignmentsTable";
import UserTable from "../components/User/UserTable";
const Dashboard = () => {
	const status = useSelector((state: any) => state.auth.status);
	const user = useSelector((state: any) => state.auth.userData);
	const [tab, setTab] = useState<"Contests" | "Assignments" | "Users">(
		"Contests",
	);
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Dashboard" />
			{!status && (
				<>
					<h2 className="text-2xl text-basecolor">
						Please login to view this page
					</h2>
				</>
			)}
			{/* Right Section */}
			{status && (
				<div className="bg-white min-w-screen min-h-screen border-4 border-secondary shadow-xl p-8 rounded-xl">
					{/* Content Section */}
					<div className="flex flex-col justify-center items-center">
						<div className="w-full">
							{status && <ProfileCard user={user} />}
						</div>
					</div>
					<div className="tabs tabs-boxed mt-8 mb-4 bg-gray-100 font-bold text-xl">
						<a
							className={`tab ${
								tab === "Assignments"
									? "bg-white text-secondary text-xl"
									: "text-xl"
							}`}
							onClick={() => setTab("Assignments")}>
							Past Assignments
						</a>
						<a
							className={`tab ${
								tab === "Contests"
									? "bg-white text-secondary text-xl"
									: "text-xl"
							}`}
							onClick={() => setTab("Contests")}>
							Past Contests
						</a>
						{user.userIsAdmin === true && (
							<a
								className={`tab ${
									tab === "Users"
										? "bg-white text-secondary text-xl"
										: "text-xl"
								}`}
								onClick={() => setTab("Users")}>
								Users
							</a>
						)}
					</div>
					<div className="flex">
						{tab === "Assignments" && <PastAssignmentsTable />}
						{tab === "Contests" && <PastContestsTable />}
						{user.userIsAdmin === true && tab === "Users" && <UserTable />}
					</div>
				</div>
			)}
		</div>
	);
};

export default Dashboard;
