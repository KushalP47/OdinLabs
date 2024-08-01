import React from "react";
import { useSelector } from "react-redux";
import StudentContestPage from "../../components/Contest/StudentContestPage";
import AdminContestPage from "../../components/Contest/AdminContestPage";

const ContestPage: React.FC = () => {
	const user = useSelector((state: any) => state.auth.userData);

	return (
		<div>
			{user?.userIsAdmin ? <AdminContestPage /> : <StudentContestPage />}
		</div>
	);
};

export default ContestPage;
