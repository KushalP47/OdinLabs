import React from "react";

interface FullscreenModalProps {
	onConfirm: () => void;
}

const FullscreenModal = ({ onConfirm }: FullscreenModalProps) => {
	return (
		<div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-700 bg-opacity-50 z-50">
			<div className="bg-white p-8 rounded shadow-md text-center">
				<p className="mb-4">
					Please return to fullscreen mode to continue the contest.
				</p>
				<button
					className="bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
					onClick={onConfirm}>
					Go to Fullscreen
				</button>
			</div>
		</div>
	);
};

export default FullscreenModal;
