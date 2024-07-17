import { useParams } from "react-router-dom";
const ContestPage = () => {
	const { contestId } = useParams();
	return <div>{contestId}</div>;
};

export default ContestPage;
