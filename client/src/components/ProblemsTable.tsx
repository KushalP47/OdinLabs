import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface ProblemsTableProps {
	problems: {
		problemId: number;
		problemTitle: string;
		problemTags: string[];
		problemDifficulty: string;
	}[];
	deadline: string | undefined;
}

const PAGE_SIZE = 10;

const ProblemsTable = ({
	problems,
	deadline = "2024-07-20T12:00:00Z",
}: ProblemsTableProps) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [timeRemaining, setTimeRemaining] = useState({
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		if (deadline) {
			const deadlineDate = new Date(deadline);

			const updateTimer = () => {
				const now = new Date();
				const timeDiff = deadlineDate.getTime() - now.getTime();

				if (timeDiff <= 0) {
					setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
					return;
				}

				const hours = Math.floor(timeDiff / (1000 * 60 * 60));
				const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

				setTimeRemaining({ hours, minutes, seconds });
			};

			const timerId = setInterval(updateTimer, 1000);

			return () => clearInterval(timerId);
		}
	}, [deadline]);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1); // Reset to first page when search term changes
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
	};

	const filteredProblems = problems.filter((problem) =>
		problem.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const paginatedProblems = filteredProblems.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const totalPages = Math.ceil(filteredProblems.length / PAGE_SIZE);
	const getDifficultyClassName = (difficulty: string | undefined) => {
		switch (difficulty) {
			case "Easy":
				return "text-success";
			case "Medium":
				return "text-warning";
			case "Hard":
				return "text-error";
			default:
				return ""; // Default class if needed
		}
	};

	return (
		<div>
			{deadline && (
				<div className="flex flex-row justify-between items-center m-2">
					{/* Deadline */}
					<div className="text-lg text-basecolor">
						<div className="countdown font-mono text-2xl">
							<span style={{ "--value": timeRemaining.hours } as any}></span>:{" "}
							<span style={{ "--value": timeRemaining.minutes } as any}></span>:{" "}
							<span style={{ "--value": timeRemaining.seconds } as any}></span>
						</div>
					</div>
					{/* Search Bar */}
					<input
						type="text"
						placeholder="Search problems"
						value={searchTerm}
						onChange={handleSearch}
						className="input input-primary bg-gray-50 w-full max-w-md"
					/>
				</div>
			)}
			{!deadline && (
				<div className="flex flex-row justify-end items-center m-2">
					{/* Search Bar */}
					<input
						type="text"
						placeholder="Search problems"
						value={searchTerm}
						onChange={handleSearch}
						className="input input-primary bg-gray-50 w-full max-w-md"
					/>
				</div>
			)}

			<table className="w-full rounded-xl text-basecolor text-lg border-collapse">
				<thead>
					<tr>
						<th className="px-4 py-2 border rounded-tl-xl">ID</th>
						<th className="px-4 py-2 border">Title</th>
						<th className="px-4 py-2 border">Tags</th>
						<th className="px-4 py-2 border rounded-tr-xl">Difficulty</th>
					</tr>
				</thead>
				<tbody>
					{paginatedProblems.map((problem, index) => (
						<tr key={problem.problemId}>
							<td
								className={`px-4 py-2 border text-center ${
									index === paginatedProblems.length - 1 ? "rounded-bl-xl" : ""
								}`}>
								{problem.problemId}
							</td>
							<td className="px-4 py-2 border hover:bg-slate-100 hover:link hover:link-primary">
								<Link
									to={`/problem/${problem.problemId}`}
									className="text-secondary font-semibold text-center">
									{problem.problemTitle}
								</Link>
							</td>
							<td className="px-4 py-2 border">
								{problem.problemTags.join(", ")}
							</td>
							<td
								className={`px-4 py-2 border font-bold text-center ${getDifficultyClassName(
									problem.problemDifficulty,
								)} ${
									index === paginatedProblems.length - 1 ? "rounded-br-xl" : ""
								}`}>
								{problem.problemDifficulty}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className="flex justify-center mt-4">
				{Array.from({ length: totalPages }, (_, index) => (
					<button
						key={index}
						className={`mx-1 px-3 py-1 border rounded ${
							currentPage === index + 1 ? "bg-secondary text-white" : "bg-white"
						}`}
						onClick={() => handlePageChange(index + 1)}>
						{index + 1}
					</button>
				))}
			</div>
		</div>
	);
};

export default ProblemsTable;
