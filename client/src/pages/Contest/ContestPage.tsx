import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import StudentContestPage from "../../components/Contest/StudentContestPage";
import AdminContestPage from "../../components/Contest/AdminContestPage";

const ContestPage: React.FC = () => {
	const user = useSelector((state: any) => state.auth.userData);
	const { contestId } = useParams<{ contestId: string }>();

	return (
		<div>{user?.isAdmin ? <AdminContestPage /> : <StudentContestPage />}</div>
	);
};

export default ContestPage;
