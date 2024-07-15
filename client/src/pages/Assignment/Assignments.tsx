import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
const Assignments = () => {
	const [status, setStatus] = useState(false);
	const currentStatus = useSelector((state: any) => state.auth.status);
	useEffect(() => {
		setStatus(currentStatus);
	}, []);
	const user = useSelector((state: any) => state.auth.userData);
	const isAdmin = user?.isAdmin;
	const assignments = [
		{
			id: 1,
			title: "Assignment 1",
			status: "Completed",
			marks: 100,
			deadline: "2021-10-10",
		},
		{
			id: 2,
			title: "Assignment 2",
			status: "Completed",
			marks: 100,
			deadline: "2021-10-15",
		},
		{
			id: 3,
			title: "Assignment 3",
			status: "Ongoing",
			marks: 100,
			deadline: "2021-10-20",
		},
		{
			id: 4,
			title: "Assignment 4",
			status: "Upcoming",
			marks: 100,
			deadline: "2021-10-25",
		},
	];
	return (
		<div className="flex flex-col min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Assignment" />

			{/* Right Section */}
			<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
				<div>
					<div className="flex flex-row justify-end items-center m-4">
						{isAdmin && (
							<button className="btn btn-primary btn-md text-lg mb-4 text-white">
								Add Assignment
							</button>
						)}
					</div>
					{status && (
						<div className="flex flex-col">
							<div className="collapse collapse-arrow bg-gray-100 mb-4">
								<input type="checkbox" defaultChecked />
								<div className="collapse-title text-2xl font-bold text-secondary">
									Ongoing Assignments
								</div>
								<div className="collapse-content">
									<div className="flex flex-col">
										{assignments.map((assignment) =>
											assignment.status === "Ongoing" ? (
												<div key={assignment.id} className="mb-4">
													<div className="card bg-white w-full shadow-xl flex flex-row px-4">
														<div className="card-body px-2 w-3/4">
															<h2 className="card-title text-basecolor text-xl font-semibold">
																{assignment.title}
															</h2>
															<div className="flex flex-row text-basecolor">
																Marks: {assignment.marks}
																<div className="divider divider-horizontal"></div>
																Deadline: {assignment.deadline}
															</div>
														</div>
														<div className="divider divider-horizontal py-4"></div>
														<div className="flex w-1/4 justify-center items-center">
															<button className="btn btn-primary w-1/2 text-white px-2">
																Solve
															</button>
														</div>
													</div>
												</div>
											) : null,
										)}
									</div>
								</div>
							</div>
							<div className="collapse collapse-arrow bg-gray-100 mb-4">
								<input type="checkbox" />
								<div className="collapse-title text-2xl font-bold text-secondary">
									Upcoming Assignments
								</div>
								<div className="collapse-content">
									<div className="flex flex-col">
										{assignments.map((assignment) =>
											assignment.status === "Upcoming" ? (
												<div key={assignment.id} className="mb-4">
													<div className="card bg-white w-full shadow-xl flex flex-row px-4">
														<div className="card-body px-2 w-3/4">
															<h2 className="card-title text-basecolor text-xl font-semibold">
																{assignment.title}
															</h2>
															<div className="flex flex-row text-basecolor">
																Marks: {assignment.marks}
																<div className="divider divider-horizontal"></div>
																Deadline: {assignment.deadline}
															</div>
														</div>
														<div className="divider divider-horizontal py-4"></div>
														<div className="flex w-1/4 justify-center items-center">
															<button
																disabled
																className="btn btn-primary w-1/2 text-white px-2">
																Solve
															</button>
														</div>
													</div>
												</div>
											) : null,
										)}
									</div>
								</div>
							</div>
							<div className="collapse collapse-arrow bg-gray-100 mb-4">
								<input type="checkbox" />
								<div className="collapse-title text-2xl font-bold text-secondary">
									Completed Assignments
								</div>
								<div className="collapse-content">
									<div className="flex flex-col">
										{assignments.map((assignment) =>
											assignment.status === "Completed" ? (
												<div key={assignment.id} className="mb-4">
													<div className="card bg-white w-full shadow-xl flex flex-row px-4">
														<div className="card-body px-2 w-3/4">
															<h2 className="card-title text-basecolor text-xl font-semibold">
																{assignment.title}
															</h2>
															<div className="flex flex-row text-basecolor">
																Marks: {assignment.marks}
																<div className="divider divider-horizontal"></div>
																Deadline: {assignment.deadline}
															</div>
														</div>
														<div className="divider divider-horizontal py-4"></div>
														<div className="flex w-1/4 justify-center items-center">
															<button className="btn btn-primary w-1/2 text-white px-2">
																Visit
															</button>
														</div>
													</div>
												</div>
											) : null,
										)}
									</div>
								</div>
							</div>
						</div>
					)}
					{!status && (
						<h2 className="text-2xl text-basecolor">
							Please login to view this page
						</h2>
					)}
				</div>
			</div>
		</div>
	);
};

export default Assignments;
