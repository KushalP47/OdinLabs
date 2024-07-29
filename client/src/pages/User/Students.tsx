import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import Navbar from "../../components/Navbar";
import { userService } from "../../api/userService";
import { UserInfo } from "../../types/user";
import ErrorModal from "../../components/ErrorModal";
interface studentSocket {
	emailId: string;
	socketId: string;
	roomId: string;
	userName: string;
	offer: RTCSessionDescriptionInit;
}

interface ConnectedStudentsEvent {
	connectedUsers: Array<studentSocket>;
}

const Students = () => {
	const socket = useMemo(() => io("http://localhost:8001"), []);
	const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [students, setStudents] = useState<Array<studentSocket>>([]);
	const [selectedStudents, setSelectedStudents] = useState<
		Array<studentSocket>
	>([]);
	const [errorMessage, setErrorMessage] = useState<string>("");
	const [errorModalOpen, setErrorModalOpen] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const peerRef = useRef<RTCPeerConnection | null>(null);
	const [totalUsers, setTotalUsers] = useState<UserInfo[]>([]);
	const [sectionTab, setSectionTab] = useState<string>("1");

	const getStudents = useCallback(async () => {
		const response = await userService.getUsersFromSection(sectionTab);
		if (response.data.ok) {
			console.log("Total users:", response.data.usersInfo);
			setTotalUsers(response.data.usersInfo);
		} else {
			setErrorMessage(response.data.message);
			setErrorModalOpen(true);
		}
	}, [setSectionTab]);

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
			console.log("Connected Students:", connectedUsers);
			for (let i = 0; i < totalUsers.length; i++) {
				const student = connectedUsers.find(
					(user) => user.emailId === totalUsers[i].userEmail,
				);
				if (student) {
					totalUsers[i].userStatus = "online";
				} else {
					totalUsers[i].userStatus = "offline";
				}
			}
			setTotalUsers([...totalUsers]);
			console.log("Connected Users:", connectedUsers);
		},
		[],
	);

	const handleStudentClick = useCallback(
		(name: string, email: string) => {
			console.log("Student clicked");
			const student = students.find((user) => user.emailId === email);
			if (student) {
				setSelectedStudents([student]);
				console.log("Selected student:", student);
			}
			console.log("Name:", name, "Email:", email);
		},
		[selectedStudents, students],
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
			setIsConnected(true);
			if (peerRef.current) {
				peerRef.current.close();
			}

			const peer = createPeerConnection();
			peerRef.current = peer;
			console.log(offer);
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
			setIsConnected(false);
			console.log("Disconnecting from student:", emailId);
			if (peerRef.current) {
				peerRef.current.close();
			}
			setRemoteStream(null);
			if (videoRef.current) {
				videoRef.current.srcObject = null;
			}
			socket.emit("leave-student-room", { roomId, emailId });
			console.log("Disconnected and left room:", roomId);
		},
		[socket],
	);

	const handleAdminDisconnected = useCallback(() => {
		console.log("Admin disconnected");
		setIsConnected(false);
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
		getStudents();
	}, [socket]);

	useEffect(() => {
		socket.on("student-offers", handleConnectedStudents);
		socket.on("admin-disconnected", handleAdminDisconnected);
		return () => {
			socket.off("student-offers", handleConnectedStudents);
			socket.off("admin-disconnected", handleAdminDisconnected);
		};
	}, [socket, handleConnectedStudents]);

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Students" />
			<div className="bg-white w-full min-h-screen border-4 border-blue shadow-xl flex flex-col p-8">
				<div className="tabs tabs-boxed mb-4 bg-gray-100 font-bold text-lg">
					<a
						className={`tab ${
							sectionTab === "1" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setSectionTab("1")}>
						Section 1
					</a>
					<a
						className={`tab ${
							sectionTab === "2" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setSectionTab("2")}>
						Section 2
					</a>
				</div>
				<div className="overflow-x-auto">
					<div className="flex flex-row">
						<div className="flex flex-col">
							<div className="text-basecolor text-2xl font-bold">
								Online Students
							</div>
							<table className="scroll-smooth">
								<thead className="text-xs text-secondary uppercase bg-gray-50">
									<tr>
										<th scope="col" className="px-6 py-3">
											Sr. No.
										</th>
										<th scope="col" className="px-6 py-3">
											Student Name
										</th>
										<th scope="col" className="px-6 py-3">
											Email
										</th>
										<th scope="col" className="px-6 py-3">
											Roll Number
										</th>
									</tr>
								</thead>
								<tbody>
									{totalUsers.map((student, index) => (
										<tr
											key={student.userEmail}
											className="bg-white text-basecolor hover:bg-gray-50 text-md border-b"
											onClick={() =>
												handleStudentClick(student.userName, student.userEmail)
											}>
											{student.userStatus === "online" && (
												<>
													<td className="px-6 py-4">{index + 1}</td>
													<td className="px-6 py-4">{student.userName}</td>
													<td className="px-6 py-4">{student.userEmail}</td>
													<td className="px-6 py-4">
														{student.userRollNumber}
													</td>
												</>
											)}
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="divider divider-horizontal"></div>
						<div>
							<div className="flex flex-col">
								<div className="text-basecolor text-2xl font-bold">
									Offline Students
								</div>
								<table className="scroll-smooth">
									<thead className="text-xs sticky top-0 text-secondary uppercase bg-gray-50">
										<tr>
											<th scope="col" className="px-6 py-3">
												Sr. No.
											</th>
											<th scope="col" className="px-6 py-3">
												Student Name
											</th>
											<th scope="col" className="px-6 py-3">
												Email
											</th>
											<th scope="col" className="px-6 py-3">
												Roll Number
											</th>
										</tr>
									</thead>
									<tbody>
										{totalUsers.map((student, index) => (
											<tr
												key={student.userEmail}
												className="bg-gray-100 select-none text-basecolor text-md border-b">
												{student.userStatus === "offline" && (
													<>
														<td className="px-6 py-4">{index + 1}</td>
														<td className="px-6 py-4">{student.userName}</td>
														<td className="px-6 py-4">{student.userEmail}</td>
														<td className="px-6 py-4">
															{student.userRollNumber}
														</td>
													</>
												)}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
					<div className="divider"></div>

					<div>
						<div className="text-basecolor text-2xl font-bold">
							Selected Student
						</div>
						<table className="w-full text-sm text-left text-gray-500">
							<thead className="text-xs text-secondary uppercase bg-gray-50">
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
								{students.map((student, index) =>
									student.emailId === selectedStudents[0]?.emailId ? (
										<tr
											key={student.emailId}
											className="bg-white text-basecolor text-md border-b">
											<td className="px-6 py-4">{index + 1}</td>
											<td className="px-6 py-4">{student.emailId}</td>
											<td className="px-6 py-4">{student.socketId}</td>
											<td className="px-6 py-4">
												<button
													className={`btn btn-outline btn-primary text-white ${
														isConnected ? "cursor-not-allowed" : ""
													}`}
													{...(isConnected ? { disabled: true } : {})}
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
													className={`btn btn-outline btn-error text-white ${
														!isConnected ? "cursor-not-allowed" : ""
													}`}
													{...(!isConnected ? { disabled: true } : {})}
													onClick={() =>
														disconnectStudent(student.emailId, student.roomId)
													}>
													Disconnect
												</button>
											</td>
										</tr>
									) : null,
								)}
							</tbody>
						</table>
					</div>
					<div className="w-800px h-450px border-4 border-secondary mt-4">
						<video
							autoPlay
							playsInline
							muted
							ref={videoRef}
							className="w-full h-full"></video>
					</div>
				</div>
				<ErrorModal
					message={errorMessage}
					isOpen={errorModalOpen}
					onClose={() => setErrorModalOpen(false)}
				/>
			</div>
		</div>
	);
};

export default Students;
