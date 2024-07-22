import React from "react";
import { Teams, AssignmentUser } from "../../types/assignment";

interface TeamLeaderboardProps {
	assignmentUsers: AssignmentUser[];
}

const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({
	assignmentUsers,
}) => {
	const teams: Teams[] = assignmentUsers.reduce((acc: Teams[], curr) => {
		const teamIndex = acc.findIndex(
			(team) => team.teamName === curr.assignmentUserTeamName,
		);
		if (teamIndex === -1) {
			acc.push({
				teamName: curr.assignmentUserTeamName,
				teamMembers: [],
				teamScore: curr.assignmentUserCurrentMarks,
			});
		} else {
			acc[teamIndex].teamScore += curr.assignmentUserCurrentMarks;
		}
		return acc;
	}, []);
	const sortedTeams = [...teams].sort((a, b) => b.teamScore - a.teamScore);

	return (
		<div className="overflow-x-auto">
			<table className="table table-border w-full">
				<thead>
					<tr className="border font-bold text-2xl text-secondary">
						<th>Team Name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{sortedTeams.map((team) => (
						<tr
							className="border text-basecolor font-semibold text-lg"
							key={team.teamName}>
							<td>{team.teamName}</td>
							<td>{team.teamScore}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default TeamLeaderboard;
