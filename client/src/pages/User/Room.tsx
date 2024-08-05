import Navbar from "../../components/Utils/Navbar";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import {
	startStream as startStreamAction,
	stopStream as stopStreamAction,
} from "../../store/streamSlice";
interface AdminConnectionParams {
	answer: RTCSessionDescriptionInit;
	emailId: string;
}
const Room = () => {
	const [status, setStatus] = useState<boolean>(
		useSelector((state: any) => state.stream.status),
	);
	const dispatch = useDispatch();
	const [myStream, setMyStream] = useState<MediaStream | null>(null);
	const socket = useMemo(() => io(import.meta.env.VITE_SOCKET_URL), []);
	let peer = useMemo(
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
	const roomId = userData.userRollNumber;
	const emailId = userData.userEmail;
	const userName = userData.userName;

	const startStream = useCallback(async () => {
		setStatus(true);
		if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
			try {
				const stream = await navigator.mediaDevices.getDisplayMedia({
					video: true,
					audio: false,
				});
				dispatch(
					startStreamAction({ streamData: stream.active, streamId: roomId }),
				);
				setMyStream(stream);
				console.log("Starting stream, joining room:", roomId);
				socket.emit("join-room", { roomId, emailId, userName });

				stream.getTracks().forEach((track) => peer.addTrack(track, stream));
				console.log("Stream added to peer connection");
			} catch (error) {
				console.error("Error accessing display media:", error);
				setStatus(false);
			}
		} else {
			console.error("getDisplayMedia is not supported in this browser.");
			setStatus(false);
		}
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
		dispatch(stopStreamAction());
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
		console.log(peer.localDescription);
		console.log(peer.currentLocalDescription);
		console.log(peer.remoteDescription);
		console.log(peer.currentRemoteDescription);
		socket.emit("disconnect-room", { emailId, roomId });
		createOffer();
	}, [socket, createOffer]);

	useEffect(() => {
		socket.on("answer-received", connectAdmin);

		return () => {
			socket.off("answer-received", connectAdmin);
		};
	}, [socket, connectAdmin]);
	useEffect(() => {
		socket.on("admin-disconnected", handleAdminDisconnected);
		return () => {
			socket.off("admin-disconnected", handleAdminDisconnected);
		};
	}, [socket, handleAdminDisconnected]);
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
		<div className="flex flex-col min-h-screen">
			<Navbar currentPage="Room" />
			<div className="bg-white w-full min-h-screen border-4 border-blue shadow-xl flex flex-col p-8">
				<div className="flex justify-start mb-8">
					<h1 className="text-4xl font-bold">Streaming</h1>
				</div>
				<div className="flex flex-col items-center justify-center">
					{!status && (
						<button
							className="btn btn-primary text-white text-lg"
							onClick={startStream}>
							Start Stream
						</button>
					)}
					{status && (
						<button
							className="btn btn-error text-white text-lg"
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
