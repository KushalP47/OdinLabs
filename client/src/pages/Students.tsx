import { useEffect, useState, useCallback, useMemo } from "react";
import { io } from "socket.io-client";
import ReactPlayer from "react-player";

interface studentSocket {
	emailId: string;
	socketId: string;
	roomId: string;
	offer: RTCSessionDescriptionInit;
}
interface ConnectedStudentsEvent {
	connectedUsers: Array<studentSocket>;
}

const Students = () => {
	const socket = useMemo(() => io("http://localhost:8001"), []); // Ensuring single socket connection
	const peer = useMemo(
		() =>
			new RTCPeerConnection({
				iceServers: [
					{
						urls: "stun:stun.l.google.com:19302",
					},
				],
			}),
		[],
	);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [students, setStudents] = useState<Array<studentSocket>>([]); // Array of studentSocket

	// Updates the students list
	const handleConnectedStudents = useCallback(
		({ connectedUsers }: ConnectedStudentsEvent) => {
			setStudents(connectedUsers);
		},
		[],
	);

	// Function which connects to the student
	const connectStudent = useCallback(
		async (
			emailId: string,
			socketId: string,
			roomId: string,
			offer: RTCSessionDescriptionInit,
		) => {
			await peer.setRemoteDescription(offer);
			const answer = await peer.createAnswer();
			await peer.setLocalDescription(answer);
			socket.emit("send-answer", { emailId, roomId, answer });
		},
		[peer, socket],
	);

	// Function which starts the stream
	const handleTrackEvent = useCallback((event: RTCTrackEvent) => {
		setRemoteStream(event.streams[0]);
	}, []);

	// Function which disconnects the student
	const handleRoomDisconnected = useCallback(() => {
		setRemoteStream(null);
	}, []);

	const disconnectStudent = useCallback(
		(emailId: string) => {
			socket.emit("disconnect-student", { emailId });
		},
		[socket],
	);

	// useEffect(() => {
	// 	socket.emit("get-student-offers");
	// 	return () => {
	// 		socket.disconnect(); // Ensure cleanup on component unmount
	// 	};
	// }, []);

	useEffect(() => {
		peer.ontrack = handleTrackEvent;
		return () => {
			peer.ontrack = null;
		};
	}, [peer]);

	useEffect(() => {
		socket.on("student-offers", handleConnectedStudents);
		return () => {
			socket.off("student-offers", handleConnectedStudents);
		};
	}, [socket]);

	useEffect(() => {
		socket.on("room-disconnected", handleRoomDisconnected);
		return () => {
			socket.off("room-disconnected", handleRoomDisconnected);
		};
	}, []);

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
											connectStudent(
												student.emailId,
												student.socketId,
												student.roomId,
												student.offer,
											)
										}>
										Connect
									</button>
								</td>
								<td className="px-6 py-4">
									<button
										className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded"
										onClick={() => disconnectStudent(student.emailId)}>
										Disconnect
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{remoteStream && <ReactPlayer url={remoteStream} playing controls />}
			</div>
		</div>
	);
};

export default Students;
