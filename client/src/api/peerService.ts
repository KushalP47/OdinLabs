export class PeerService {
    url;
    constructor() {
        this.url = import.meta.env.VITE_SERVER_URL;
    }
    async createOffer(user: any) {
        const peerConnection = new RTCPeerConnection();

        // Capture the student's screen when they log in
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: 'screen' } as MediaTrackConstraints,
            });
            stream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, stream);
            });
        } catch (err) {
            console.error('Error accessing display media.', err);
            return;
        }

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        const studentId = user.email;
        const offerId = user.rollNumber;
        const response = await fetch(`http://localhost:8000/api/v1/peer/storeOffer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId, studentId, offer }),
        });

        // Periodically check if the teacher has answered the offer
        // Periodically check if the teacher has answered the offer
        setInterval(async () => {
            const resp = await fetch(`http://localhost:8000/api/v1/peer/getAnswer?offerId=${encodeURIComponent(offerId)}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (resp.status === 201) {
                const data = await resp.json();
                if (data.data.ok === false) return;
                await peerConnection.setRemoteDescription(new RTCSessionDescription(data.data.answer));
            }
        }, 500);

        return response.json();

    }

    async sendAnswer(offer: any, answer: any) {
        const response = await fetch('http://localhost:8000/api/v1/peer/storeAnswer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ offerId: offer.offerId, answer }),
        });
        return response.json();
    }

    async getOffers() {
        const response = await fetch('http://localhost:8000/api/v1/peer/getOffers', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.json();
    }

}

export const peerService = new PeerService();