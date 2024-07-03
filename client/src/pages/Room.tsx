import Navbar from "../components/Navbar";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
interface AdminConnectionParams {
	answer: RTCSessionDescriptionInit;
	emailId: string;
}
const Room = () => {
	const [status, setStatus] = useState(false);
	const [myStream, setMyStream] = useState<MediaStream | null>(null);
	const socket = useMemo(() => io("http://localhost:8001"), []);
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
	const roomId = userData.rollNumber;
	const emailId = userData.email;

	const startStream = useCallback(async () => {
		setStatus(true);
		const stream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: false,
		});
		setMyStream(stream);
		console.log("Starting stream, joining room:", roomId);
		socket.emit("join-room", { roomId, emailId });

		stream.getTracks().forEach((track) => peer.addTrack(track, stream));
		console.log("Stream added to peer connection");
	}, [socket, roomId, emailId, peer]);

	const createOffer = useCallback(async () => {
		console.log("Creating offer");
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);
		console.log("Offer created, sending to server");
		socket.emit("send-offer", { roomId, emailId, offer });
	}, [peer, socket, roomId, emailId]);

	const connectAdmin = useCallback(
		async ({ answer, emailId }: AdminConnectionParams) => {
			console.log(
				"Admin connected, setting remote description",
				answer,
				emailId,
			);
			await peer.setRemoteDescription(answer);
		},
		[peer],
	);

	const endStream = useCallback(() => {
		setStatus(false);
		console.log("Ending stream, disconnecting room:", roomId);
		if (myStream) {
			myStream.getTracks().forEach((track) => track.stop());
		}
		socket.emit("disconnect-room", { emailId, roomId });
		// socket.disconnect();
		// peer.close();
	}, [socket, emailId, roomId, myStream]);

	const handleAdminDisconnected = useCallback(() => {
		console.log("Admin disconnected");
		socket.emit("disconnect-room", { emailId, roomId });
		createOffer();
	}, [createOffer]);

	useEffect(() => {
		socket.on("answer-received", connectAdmin);
		socket.on("admin-disconnected", handleAdminDisconnected);

		return () => {
			socket.off("answer-received");
			socket.off("admin-disconnected");
		};
	}, [socket, connectAdmin, handleAdminDisconnected]);

	useEffect(() => {
		socket.on("user-connected", createOffer);
		return () => {
			socket.off("user-connected");
		};
	}, [socket, createOffer]);

	useEffect(() => {
		peer.addEventListener("negotiationneeded", () => {
			console.log("Negotiation needed");
		});

		return () => {
			peer.removeEventListener("negotiationneeded", () => {
				console.log("Negotiation needed");
			});
		};
	}, []);
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		if (videoRef.current && myStream) {
			videoRef.current.srcObject = myStream;
		}
	}, [myStream]);

	return (
		<div className="flex min-h-screen">
			<Navbar currentPage="Dashboard" />
			<div className="bg-white w-10/12 m-auto flex flex-col items-center justify-center">
				<h1 className="text-3xl font-bold mb-4">Room</h1>
				<div className="flex flex-col items-center justify-center">
					{!status && (
						<button
							className="px-4 py-2 bg-blue text-white rounded hover:bg-black focus:outline-none focus:bg-blue-600 mb-4"
							onClick={startStream}>
							Start Stream
						</button>
					)}
					{status && (
						<button
							className="px-4 py-2 bg-blue text-white rounded hover:bg-black focus:outline-none focus:bg-red-600 mb-4"
							onClick={endStream}>
							End Stream
						</button>
					)}
					{myStream && (
						<video
							className="w-800px h-450px border-4 border-blue"
							autoPlay
							playsInline
							muted
							ref={videoRef}></video>
					)}
				</div>
			</div>
		</div>
	);
};

export default Room;
