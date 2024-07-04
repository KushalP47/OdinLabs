import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { io } from "socket.io-client";

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
	const socket = useMemo(() => io("http://localhost:8001"), []);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [students, setStudents] = useState<Array<studentSocket>>([]);
	const videoRef = useRef<HTMLVideoElement>(null);
	const peerRef = useRef<RTCPeerConnection | null>(null);

	const createPeerConnection = useCallback(() => {
		const peer = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		});

		peer.addEventListener("track", handleTrackEvent);

		peer.addEventListener("icecandidate", (event) => {
			if (event.candidate) {
				console.log("ICE candidate:", event.candidate);
			}
		});

		return peer;
	}, []);

	const handleConnectedStudents = useCallback(
		({ connectedUsers }: ConnectedStudentsEvent) => {
			setStudents(connectedUsers);
			console.log("Connected Users:", connectedUsers);
		},
		[],
	);

	const connectStudent = useCallback(
		async (
			emailId: string,
			socketId: string,
			roomId: string,
			offer: RTCSessionDescriptionInit,
		) => {
			console.log(
				"Connecting to student:",
				emailId,
				"Room:",
				roomId,
				"Offer:",
				offer,
				"Socket ID:",
				socketId,
			);

			if (peerRef.current) {
				peerRef.current.close();
			}

			const peer = createPeerConnection();
			peerRef.current = peer;

			await peer.setRemoteDescription(offer);
			const answer = await peer.createAnswer();
			await peer.setLocalDescription(answer);
			socket.emit("send-answer", { emailId, roomId, answer });
			socket.emit("join-student-room", { roomId });
			console.log("Connected and joined room:", roomId);
		},
		[createPeerConnection, socket],
	);

	const handleTrackEvent = useCallback((event: RTCTrackEvent) => {
		console.log("Track event:", event);
		const incomingStream = event.streams[0];
		console.log("Incoming stream:", incomingStream);

		setRemoteStream(incomingStream);
		if (videoRef.current) {
			videoRef.current.srcObject = incomingStream;
			console.log("Video ref:", videoRef.current.srcObject);
		}
	}, []);

	const disconnectStudent = useCallback(
		(emailId: string, roomId: string) => {
			console.log("Disconnecting from student:", emailId);
			if (peerRef.current) {
				peerRef.current.close();
			}
			setRemoteStream(null);
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
			socket.emit("leave-student-room", { roomId });
			console.log("Disconnected and left room:", roomId);
		},
		[socket],
	);

	const handleAdminDisconnected = useCallback(() => {
		console.log("Admin disconnected");
		if (peerRef.current) {
			peerRef.current.close();
		}
		setRemoteStream(null);
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
	}, []);

	useEffect(() => {
		socket.emit("get-student-offers");
	}, [socket]);

	useEffect(() => {
		socket.on("student-offers", handleConnectedStudents);
		return () => {
			socket.off("student-offers", handleConnectedStudents);
		};
	}, [socket, handleConnectedStudents]);

	useEffect(() => {
		socket.on("admin-disconnected", handleAdminDisconnected);
		return () => {
			socket.off("admin-disconnected", handleAdminDisconnected);
		};
	}, [socket, handleAdminDisconnected]);

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
										className="px-4 py-2 text-white bg-blue hover:bg-black rounded"
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
										className="px-4 py-2 text-white bg-blue hover:bg-black rounded"
										onClick={() =>
											disconnectStudent(student.emailId, student.roomId)
										}>
										Disconnect
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>

				<div className="w-800px h-450px border-4 border-blue mt-4">
					<video
						autoPlay
						playsInline
						muted
						ref={videoRef}
						className="w-full h-full"></video>
				</div>
			</div>
		</div>
	);
};

export default Students;
