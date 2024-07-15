import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { Problem } from "../../types/problems";
import { problemService } from "../../api/problemService";

const PAGE_SIZE = 10; // Adjust this value based on how many problems you want to display per page

const Practice = () => {
	const [status, setStatus] = useState(false);
	const [problems, setProblems] = useState<Array<Problem>>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const currentStatus = useSelector((state: any) => state.auth.status);
	const isAdmin = useSelector((state: any) => state.auth.userData?.isAdmin);

	useEffect(() => {
		setStatus(currentStatus);
	}, [currentStatus]);

	useEffect(() => {
		async function getProblems() {
			await problemService
				.getProblems()
				.then((data) => {
					const currProblems: Array<Problem> = data.data.problems;
					setProblems(currProblems);
				})
				.catch((error) => {
					console.error(error);
				});
		}
		getProblems();
	}, []);

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
		setCurrentPage(1); // Reset to first page when search term changes
	};

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
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
		problem.problemTitle.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const paginatedProblems = filteredProblems.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	const totalPages = Math.ceil(filteredProblems.length / PAGE_SIZE);

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
								{/* Search Bar */}
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
									{paginatedProblems.map((problem, index) => (
										<tr key={problem.problemId}>
											<td
												className={`px-4 py-2 border text-center ${
													index === paginatedProblems.length - 1
														? "rounded-bl-xl"
														: ""
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
													index === paginatedProblems.length - 1
														? "rounded-br-xl"
														: ""
												}`}>
												{problem.problemDifficulty}
											</td>
										</tr>
									))}
								</tbody>
							</table>

							{/* Pagination */}
							<div className="flex justify-center mt-4">
								{Array.from({ length: totalPages }, (_, index) => (
									<button
										key={index}
										className={`mx-1 px-3 py-1 border rounded ${
											currentPage === index + 1
												? "bg-secondary text-white"
												: "bg-white"
										}`}
										onClick={() => handlePageChange(index + 1)}>
										{index + 1}
									</button>
								))}
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

export default Practice;
