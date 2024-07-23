import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminContestPage from "../../components/Contest/AdminContestPage";
import StudentContestPage from "../../components/Contest/StudentContestPage";
const ContestPage = () => {
	const { contestId } = useParams();
	if (!contestId) return <div>Contest ID not provided</div>;
	const isAdmin = useSelector((state: any) => state.auth.userIsAdmin);

	return (
		<div>
			{isAdmin ? (
				<AdminContestPage contestId={contestId} />
			) : (
				<StudentContestPage contestId={contestId} />
			)}
		</div>
	);
};

export default ContestPage;
