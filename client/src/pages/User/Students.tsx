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
	const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false); // New state to track data loading

	// Fetch Students
	const getStudents = useCallback(async () => {
		try {
			const response = await userService.getUsersFromSection(sectionTab);
			if (response.data.ok) {
				console.log("Total users:", response.data.data);
				setTotalUsers((prev) => (prev = response.data.data));
				// put a 1 secont delay to show the loading spinner
				setTimeout(() => {
					setIsDataLoaded(true);
				}, 1500);
				// setIsDataLoaded(true); // Set data loaded to true once users are fetched
			} else {
				setErrorMessage(response.data.message);
				setErrorModalOpen(true);
			}
		} catch (error) {
			console.error("Error fetching students:", error);
			setErrorMessage("Failed to fetch student data.");
			setErrorModalOpen(true);
		}
	}, [sectionTab]); // sectionTab as a dependency

	// Create Peer Connection
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

	// Handle Connected Students Event
	const handleConnectedStudents = useCallback(
		({ connectedUsers }: ConnectedStudentsEvent) => {
			console.log("Connected Students Event Triggered:", connectedUsers);

			// Ensure totalUsers is populated before proceeding
			if (!isDataLoaded) {
				console.log("Data not loaded, skipping connected students handling.");
				return;
			}

			// Set the online status for users
			setStudents(connectedUsers);
			console.log("Connected Students:", connectedUsers);

			const updatedUsers = totalUsers.map((studentUser) => {
				const student = connectedUsers.find(
					(user) => user.emailId === studentUser.userEmail,
				);
				return {
					...studentUser,
					userStatus: student ? "online" : "offline",
				};
			});

			setTotalUsers(updatedUsers);
			console.log("Total Users with Status:", updatedUsers);
		},
		[totalUsers, isDataLoaded], // Include totalUsers and isDataLoaded as dependencies
	);

	// Handle Student Click
	const handleStudentClick = useCallback(
		(name: string, email: string) => {
			console.log("Student clicked:", name, email);

			// Check if the student is connected
			const student = students.find((user) => user.emailId === email);
			if (student) {
				setSelectedStudents([student]);
				console.log("Selected student:", student);
			}
		},
		[students], // Add students as a dependency
	);

	// Connect Student
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

	// Handle Track Event
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

	// Disconnect Student
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

	// Handle Admin Disconnected
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

	// UseEffect Hook for Data Fetching
	useEffect(() => {
		// Fetch students on mount and when sectionTab changes
		getStudents();
	}, [getStudents, sectionTab]); // Add sectionTab to dependencies

	// UseEffect Hook for Socket Connections
	useEffect(() => {
		console.log("Setting up socket event listeners.");

		// Listen for socket events related to students
		socket.on("student-offers", handleConnectedStudents);
		socket.on("admin-disconnected", handleAdminDisconnected);

		// Cleanup function to run when the component unmounts
		return () => {
			console.log("Cleaning up socket event listeners.");
			socket.off("student-offers", handleConnectedStudents);
			socket.off("admin-disconnected", handleAdminDisconnected);
		};
	}, [handleConnectedStudents, handleAdminDisconnected, socket]); // Dependencies array

	// UseEffect Hook to emit "get-student-offers" only on sectionTab change
	useEffect(() => {
		if (isDataLoaded) {
			socket.emit("get-student-offers");
			console.log("Emitted get-student-offers due to sectionTab change.");
			console.log("Total Users:", totalUsers);
		}
	}, [sectionTab, isDataLoaded, socket]); // Emit when sectionTab or isDataLoaded changes

	return (
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Students" />
			<div className="bg-white w-full min-h-screen border-4 border-blue shadow-xl flex flex-col p-8">
				<div className="tabs tabs-boxed mb-4 bg-gray-100 font-bold text-lg">
					<a
						className={`tab ${
							sectionTab === "1" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => {
							setIsDataLoaded(false);
							setSectionTab("1");
						}}>
						Section 1
					</a>
					<a
						className={`tab ${
							sectionTab === "2" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => {
							setIsDataLoaded(false);
							setSectionTab("2");
						}}>
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
