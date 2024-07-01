import Navbar from "../components/Navbar";
import { useState, useCallback, useEffect, useMemo } from "react";
import { io } from "socket.io-client";

const Room = () => {
	const [status, setStatus] = useState(false);
	const [myStream, setMyStream] = useState<MediaStream | null>(null);
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
	const userData = JSON.parse(localStorage.getItem("userData") || "{}");
	const roomId: string = userData.rollNumber;
	const emailId: string = userData.email;

	// connects to the socket server
	const startStream = useCallback(async () => {
		setStatus(true);
		const stream = await navigator.mediaDevices.getDisplayMedia({
			video: true,
			audio: false,
		});
		setMyStream(stream);
		console.log("Calling socket");
		socket.emit("join-room", { roomId, emailId });
		console.log("room joined");
	}, [socket, roomId, emailId]);

	// on joining the room succesfully, creates a offer and sends it to the server
	const createOffer = useCallback(async () => {
		console.log("User connected");
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);
		console.log("Offer created");
		socket.emit("send-offer", { roomId, emailId, offer }); // Added missing offer
	}, [socket, roomId, emailId]);

	// on receiving an answer, sets the remote description
	// connects the admin to the room
	const connectAdmin = useCallback(
		async (answer: RTCSessionDescriptionInit, emailId: string) => {
			console.log("Admin connected", emailId);
			await peer.setRemoteDescription(answer);
			if (!myStream) {
				socket.emit("no-stream-available");
				return;
			}
			// sending stream to the admin
			const tracks = myStream.getTracks();
			for (const track of tracks) {
				peer.addTrack(track, myStream);
			}
			socket.emit("send-stream", { emailId });
		},
		[socket, peer, myStream],
	);

	const endStream = useCallback(() => {
		setStatus(false);
		socket.emit("disconnect-room", { emailId, roomId });
		socket.disconnect(); // Properly disconnecting socket
	}, [socket, emailId, roomId]);

	useEffect(() => {
		socket.on("answer-received", connectAdmin);

		return () => {
			socket.off("answer-received", connectAdmin);
			// socket.disconnect(); // Ensure cleanup on component unmount
		};
	}, []);

	useEffect(() => {
		socket.on("user-connected", createOffer);
		return () => {
			socket.off("user-connected");
		};
	}, []);

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
								onClick={() => startStream()}>
								Start Streaming
							</button>
						)}
						{status && (
							<button
								className="py-2 px-4 m-2 hover:bg-black hover:text-blue border-4 hover:border-blue rounded bg-blue text-black border-black transition duration-300"
								onClick={() => endStream()}>
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
