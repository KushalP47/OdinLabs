import React from "react";
import { Teams } from "../../types/assignment";

interface TeamLeaderboardProps {
	teams: Teams[];
}

const TeamLeaderboard: React.FC<TeamLeaderboardProps> = ({ teams }) => {
	const sortedTeams = [...teams].sort((a, b) => b.teamScore - a.teamScore);

	return (
		<div className="overflow-x-auto">
			<table className="table table-zebra w-full">
				<thead>
					<tr>
						<th>Team Name</th>
						<th>Score</th>
					</tr>
				</thead>
				<tbody>
					{sortedTeams.map((team) => (
						<tr key={team.teamName}>
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
