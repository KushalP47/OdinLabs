import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
const Problems = () => {
	const [status, setStatus] = useState(false);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [problemsPerPage] = useState(10);

	const currentStatus = useSelector((state: any) => state.auth.status);
	const isAdmin = useSelector((state: any) => state.auth.userData?.isAdmin);
	const problems = [
		{
			id: 1,
			title: "Two Sum",
			tags: ["Array", "Hash Table"],
			difficulty: "Easy",
			status: "Solved",
		},
		{
			id: 2,
			title: "Add Two Numbers",
			tags: ["Linked List", "Math"],
			difficulty: "Medium",
			status: "Unsolved",
		},
		{
			id: 3,
			title: "Longest Substring Without Repeating Characters",
			tags: ["Hash Table", "Two Pointers", "String"],
			difficulty: "Medium",
			status: "Solved",
		},
		{
			id: 4,
			title: "Median of Two Sorted Arrays",
			tags: ["Array", "Binary Search", "Divide and Conquer"],
			difficulty: "Hard",
			status: "Unsolved",
		},
		{
			id: 5,
			title: "Longest Palindromic Substring",
			tags: ["String", "Dynamic Programming"],
			difficulty: "Medium",
			status: "Solved",
		},
		{
			id: 6,
			title: "ZigZag Conversion",
			tags: ["String"],
			difficulty: "Medium",
			status: "Unsolved",
		},
		{
			id: 7,
			title: "Reverse Integer",
			tags: ["Math"],
			difficulty: "Easy",
			status: "Solved",
		},
		{
			id: 8,
			title: "String to Integer (atoi)",
			tags: ["Math", "String"],
			difficulty: "Medium",
			status: "Unsolved",
		},
		{
			id: 9,
			title: "Palindrome Number",
			tags: ["Math"],
			difficulty: "Easy",
			status: "Solved",
		},
		{
			id: 10,
			title: "Regular Expression Matching",
			tags: ["String", "Dynamic Programming", "Backtracking"],
			difficulty: "Hard",
			status: "Unsolved",
		},
		{
			id: 11,
			title: "Container With Most Water",
			tags: ["Array", "Two Pointers"],
		},
	];

	useEffect(() => {
		setStatus(currentStatus);
	}, []);
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1);
	};
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
	const filteredProblems = problems.filter((problem) =>
		problem.title.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const indexOfLastProblem = currentPage * problemsPerPage;
	const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
	const currentProblems = filteredProblems.slice(
		indexOfFirstProblem,
		indexOfLastProblem,
	);

	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Practice" />

			{/* Content Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					{status ? (
						<div className="flex flex-col justify-center overflow-x-auto">
							<div className="flex flex-row justify-between items-center m-4">
								{isAdmin && (
									<button className="btn btn-primary btn-md text-lg text-white">
										Add Problem
									</button>
								)}
								<input
									type="text"
									placeholder="Search problems"
									value={searchTerm}
									onChange={handleSearch}
									className="input input-primary bg-gray-50 w-full max-w-md"
								/>
							</div>

							{/* Problems Table */}
							<table className="w-full rounded-xl text-basecolor text-lg border-collapse">
								<thead>
									<tr>
										<th className="px-4 py-2 border rounded-tl-xl">ID</th>
										<th className="px-4 py-2 border">Title</th>
										<th className="px-4 py-2 border">Tags</th>
										<th className="px-4 py-2 border rounded-tr-xl">
											Difficulty
										</th>
									</tr>
								</thead>
								<tbody>
									{currentProblems.map((problem, index) => (
										<tr key={problem.id}>
											<td
												className={`px-4 py-2 border text-center ${
													index === currentProblems.length - 1
														? "rounded-bl-xl"
														: ""
												}`}>
												{problem.id}
											</td>
											<td className="px-4 py-2 border hover:bg-slate-100">
												<Link
													to="/practice"
													className="text-secondary font-semibold text-center">
													{problem.title}
												</Link>
											</td>
											<td className="px-4 py-2 border">
												{problem.tags.join(", ")}
											</td>
											<td
												className={`px-4 py-2 border ${
													problem.status === "Solved" ? "bg-green-100" : ""
												} text-center ${getDifficultyClassName(
													problem.difficulty,
												)} ${
													index === currentProblems.length - 1
														? "rounded-br-xl"
														: ""
												}`}>
												{problem.difficulty}
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{/* Pagination */}
							<div className="flex justify-center mt-4">
								{Array.from(
									{
										length: Math.ceil(
											filteredProblems.length / problemsPerPage,
										),
									},
									(_, i) => (
										<button
											key={i}
											onClick={() => paginate(i + 1)}
											className={`btn btn-sm mx-1 ${
												currentPage === i + 1
													? "btn-primary"
													: "btn bg-white border border-secondary text-secondary hover:bg-secondary hover:text-white hover:border-secondary"
											}`}>
											{i + 1}
										</button>
									),
								)}
							</div>
						</div>
					) : (
						<h2 className="text-2xl text-basecolor">
							Please login to view this page
						</h2>
					)}
				</div>
			</div>
		</div>
	);
};

export default Problems;
