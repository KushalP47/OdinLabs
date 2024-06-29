import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

interface Student {
	rollNumber: number;
	name: string;
	email: string;
}
const Students = () => {
	const [students, setStudents] = useState<Student[]>([]);
	useEffect(() => {
		// fetch("/api/students")
		// 	.then((res) => res.json())
		// 	.then((data) => setStudents(data.students));
		setStudents([
			{
				rollNumber: 1,
				name: "John Doe",
				email: "john.d@ahduni.edu.in",
			},
			{
				rollNumber: 2,
				name: "Jane Doe",
				email: "jane.d@ahduni.edu.in",
			},
		]);
	}, []);
	const connectStudent = (student: Student) => {
		console.log(student);
	};
	// student = {
	//     rollNumber: 1,
	//     name: "John Doe",
	//     email: "",
	// }
	return (
		<div className="flex min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Students" />

			{/* Right Section */}
			<div className="bg-white w-5/6 border-4 border-blue shadow-xl flex flex-col p-8">
				{/* Title Section */}
				<div className="flex justify-start mb-8">
					<h1 className="text-4xl font-bold">Students</h1>
				</div>

				{/* Content Section */}
				<div className="flex-1 overflow-auto">
					<table className="min-w-full divide-y divide-black">
						<thead className="bg-gray-50">
							<tr>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
									Roll Number
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
									Name
								</th>
								<th
									scope="col"
									className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
									Email
								</th>
								<th scope="col" className="relative px-6 py-3">
									<span className="sr-only">Connect</span>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-black">
							{students.map((student) => (
								<tr key={student.rollNumber}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium black">
										{student.rollNumber}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-black">
										{student.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-black">
										{student.email}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											className="text-black bg-blue hover:bg-black hover:text-blue py-2 px-4 rounded-lg"
											onClick={() => connectStudent(student)}>
											Connect
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default Students;
