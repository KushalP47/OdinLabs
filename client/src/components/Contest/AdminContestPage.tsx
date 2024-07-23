import React from "react";
import Navbar from "../Navbar";

interface AdminContestPageProps {
	contestId: string;
}
const AdminContestPage = ({ contestId }: AdminContestPageProps) => {
	return (
		<>
			<Navbar currentPage="Contest" contestId={contestId} />
			<div className="container mx-auto">
				<div className="flex justify-center items-center h-screen">
					<div className="text-3xl text-center">
						<div className="mb-4">Admin Contest Page</div>
						<div className="mb-4">Contest ID: {contestId}</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminContestPage;
