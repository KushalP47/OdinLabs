interface ContestPageProps {
	contestId: string;
}
const ContestPage = ({ contestId }: ContestPageProps) => {
	return <div>{contestId}</div>;
};

export default ContestPage;
