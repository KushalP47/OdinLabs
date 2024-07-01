import { useEffect, useState, useCallback } from "react";
import { io } from "socket.io-client";
interface studentSocket {
	emailId: string;
	socketId: string;
}
interface ConnectedStudentsEvent {
	connectedUsers: Array<studentSocket>;
}

const Students = () => {
	const socket = io("http://localhost:8001");
	const [students, setStudents] = useState<Array<studentSocket>>([]); // Array of studentSocket
	const handleConnectedStudents = useCallback(
		({ connectedUsers }: ConnectedStudentsEvent) => {
			setStudents(connectedUsers);
		},
		[students],
	);

	const connectStudent = useCallback((emailId: string, socketId: string) => {
		socket.emit("connect-student", { emailId, socketId });
	}, []);
	const disconnectStudent = useCallback((emailId: string, socketId: string) => {
		socket.emit("disconnect-student", { emailId, socketId });
	}, []);

	useEffect(() => {
		socket.on("connected-students", handleConnectedStudents);

		return () => {
			socket.off("connected-students");
		};
	}, [socket]);

	useEffect(() => {
		socket.emit("get-connected-students");
	}, [socket]);

	return (
		<div className="p-4">
			<h1 className="text-2xl font-bold text-black mb-4">Students</h1>
			<div className="overflow-x-auto">
				<table className="w-full text-sm text-left text-gray-500">
					<thead className="text-xs text-gray-700 uppercase bg-gray-50">
						<tr>
							<th scope="col" className="px-6 py-3">
								Sr. No.
							</th>
							<th scope="col" className="px-6 py-3">
								Student Email
							</th>
							<th scope="col" className="px-6 py-3">
								Student Socket ID
							</th>
							<th scope="col" className="px-6 py-3">
								Connect
							</th>
							<th scope="col" className="px-6 py-3">
								Disconnect
							</th>
						</tr>
					</thead>
					<tbody>
						{students.map((student, index) => (
							<tr key={student.emailId} className="bg-white border-b">
								<td className="px-6 py-4">{index + 1}</td>
								<td className="px-6 py-4">{student.emailId}</td>
								<td className="px-6 py-4">{student.socketId}</td>
								<td className="px-6 py-4">
									<button
										className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded"
										onClick={() =>
											connectStudent(student.emailId, student.socketId)
										}>
										Connect
									</button>
								</td>
								<td className="px-6 py-4">
									<button
										className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
										onClick={() =>
											disconnectStudent(student.emailId, student.socketId)
										}>
										Disconnect
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Students;
