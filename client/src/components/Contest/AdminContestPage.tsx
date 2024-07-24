import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { contestService } from "../../api/contestService";
import { Contest } from "../../types/contest";

const AdminContestPage = () => {
	const { contestId } = useParams<{ contestId: string }>();
	if (!contestId) return <>ContestId not found</>;
	const [contest, setContest] = useState<Contest | null>(null);

	useEffect(() => {
		async function fetchContest() {
			try {
				if (!contestId) return;
				const { data } = await contestService.getContest(contestId);
				setContest(data.contest);
			} catch (error) {
				console.error("Failed to fetch contest", error);
			}
		}

		fetchContest();
	}, [contestId]);

	return (
		<div className="min-h-screen">
			{contest && (
				<>
					<Navbar
						currentPage="Contest"
						deadline={contest.contestEndTime}
						contestId={contestId.toString()}
					/>
					<div className="container mx-auto p-8">
						{/* Display contest details */}
						<h1 className="text-3xl font-bold">{contest.contestName}</h1>
						<p>{contest.contestDescription}</p>
						<div className="mt-4">
							<h2 className="text-2xl font-semibold">Problems:</h2>
							{/* Render problems here */}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

export default AdminContestPage;
