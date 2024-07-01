import Navbar from "../components/Navbar";
import { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const Room = () => {
	const [status, setStatus] = useState(false);
	const [myStream, setMyStream] = useState<MediaStream | null>(null);
	const socket = io("http://localhost:8001");

	const userData = useSelector((state: any) => state.auth.userData);
	const roomId = userData.rollNumber,
		emailId = userData.email;

	// connects to the socket server
	const startStream = useCallback(async () => {
		setStatus(true);
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true,
		});
		setMyStream(stream);
		socket.emit("join-room", { roomId, emailId });
	}, [socket, roomId, emailId]);

	// creates a offer and sends it to the server
	const createOffer = useCallback(() => {
		socket.emit("create-offer", { roomId, emailId });
	}, [socket, roomId, emailId]);

	// disconnects the admin from the room
	const disconnectAdmin = useCallback(() => {}, [socket]);

	const endStream = () => {
		setStatus(false);
	};

	// connects the admin to the room
	const connectAdmin = useCallback(({}) => {}, [socket]);

	useEffect(() => {
		socket.on("user-connected", createOffer);
		socket.on("connect-admin", connectAdmin);
		socket.on("disconnect-admin", disconnectAdmin);
		return () => {
			socket.off("user-connected");
			socket.off("connect-admin");
		};
	}, [socket]);

	return (
		<div className="flex min-h-screen">
			{/* Navbar */}
			<Navbar currentPage="Dashboard" />

			{/* Right Section */}
			<div className="bg-white w-5/6 border-4 border-blue shadow-xl flex flex-col p-8">
				{/* Title Section */}
				<div className="flex justify-start mb-8">
					<h1 className="text-4xl font-bold">Room</h1>
				</div>

				{/* Content Section */}

				<div>
					<h2 className="text-2xl">Room Id: {roomId} </h2>
					<div className="flex flex-row justify-center items-center p-4">
						{!status && (
							<button
								className="py-2 px-4 m-2 hover:bg-black hover:text-blue border-4 hover:border-blue rounded bg-blue text-black border-black transition duration-300"
								onClick={() => startStream}>
								Start Streaming
							</button>
						)}
						{status && (
							<button
								className="py-2 px-4 m-2 hover:bg-black hover:text-blue border-4 hover:border-blue rounded bg-blue text-black border-black transition duration-300"
								onClick={() => endStream}>
								Stop Streaming
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Room;
