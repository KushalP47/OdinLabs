import { ContestUser } from "../../types/contest";

interface LeaderboardTabProps {
	contestUsers: ContestUser[];
}
const LeaderboardTab = ({ contestUsers }: LeaderboardTabProps) => {
	return (
		<div>
			<h2 className="text-xl font-semibold">Leaderboard</h2>
			<ul>
				{contestUsers
					.sort((a, b) => b.contestUserCurrentMarks - a.contestUserCurrentMarks)
					.map((user) => (
						<li
							key={user.contestUserRollNumber}
							className="flex justify-between">
							<span>{user.contestUserName}</span>
							<span>{user.contestUserCurrentMarks} Marks</span>
						</li>
					))}
			</ul>
		</div>
	);
};

export default LeaderboardTab;
