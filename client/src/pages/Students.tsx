import Navbar from "../components/Navbar";
import { useState, useEffect, useRef } from "react";
import { Offer } from "../types/offers";
import { peerService } from "../api/peerService";

const Students = () => {
	const [students, setStudents] = useState<Offer[]>([]);
	const [currentStream, setCurrentStream] = useState<MediaStream | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const [peerConnections, setPeerConnections] = useState<{
		[key: string]: RTCPeerConnection;
	}>({});

	useEffect(() => {
		async function getOffers(): Promise<Offer[]> {
			const offers = await peerService.getOffers();
			if (offers.statusCode === 200) {
				return offers.data.offers;
			}
			return [];
		}
		getOffers().then((offers) => setStudents(offers));
	}, []);

	const connectStudent = async (offer: Offer) => {
		console.log(offer);
		// Create answer
		const peerConnection = new RTCPeerConnection();
		setPeerConnections((prev) => ({
			...prev,
			[offer.offerId]: peerConnection,
		}));

		peerConnection.ontrack = (event) => {
			if (event.streams && event.streams[0]) {
				setCurrentStream(event.streams[0]);
				if (videoRef.current) {
					videoRef.current.srcObject = event.streams[0];
				}
			}
		};

		await peerConnection.setRemoteDescription(
			new RTCSessionDescription(offer.offer),
		);
		const answer = await peerConnection.createAnswer();
		await peerConnection.setLocalDescription(answer);

		// Send answer
		const response = await peerService.sendAnswer(offer, answer);
		console.log(response);
		if (response.statusCode === 201) {
			alert("Connected successfully");
		}
	};

	const disconnectStudent = (offerId: string) => {
		const peerConnection = peerConnections[offerId];
		if (peerConnection) {
			peerConnection.close();
			setPeerConnections((prev) => {
				const { [offerId]: _, ...rest } = prev;
				return rest;
			});
			setCurrentStream(null);
		}
	};

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
					{/* Students Details */}
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
									Email
								</th>
								<th scope="col" className="relative px-6 py-3">
									<span className="sr-only">Connect</span>
								</th>
								<th scope="col" className="relative px-6 py-3">
									<span className="sr-only">Disconnect</span>
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-black">
							{students.map((student) => (
								<tr key={student.offerId}>
									<td className="px-6 py-4 whitespace-nowrap text-sm font-medium black">
										{student.offerId}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-black">
										{student.studentId}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											className="text-black bg-blue hover:bg-black hover:text-blue py-2 px-4 rounded-lg"
											onClick={() => connectStudent(student)}>
											Connect
										</button>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
										<button
											className="text-black bg-red hover:bg-black hover:text-red py-2 px-4 rounded-lg"
											onClick={() => disconnectStudent(student.offerId)}>
											Disconnect
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					{/* Students stream */}
					<div>
						{currentStream && (
							<video
								ref={videoRef}
								autoPlay
								controls
								className="w-full mt-8"></video>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Students;
