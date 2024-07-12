interface AssignmentPageProps {
	assignmentId: string;
}
const AssignmentPage = ({ assignmentId }: AssignmentPageProps) => {
	return <div>{assignmentId}</div>;
};

export default AssignmentPage;
