// src/components/ConfirmationModal.tsx

import React from "react";

interface ConfirmationModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
}) => {
	return (
		<div className={`modal ${isOpen ? "modal-open" : ""} fixed inset-0 z-50`}>
			<div className="modal-box bg-white rounded-lg shadow-lg p-6 text-center relative">
				<h1 className="text-2xl font-semibold mb-4 text-secondary">
					Join Contest Confirmation
				</h1>
				<p className="text-basecolor mb-6">
					Once you join the contest, you won’t be allowed to enter again. This
					is a one-time entry only.
				</p>
				<div className="flex justify-center">
					<button
						className="btn btn-error text-white mr-4 text-lg"
						onClick={onClose}>
						Cancel
					</button>
					<button
						className="btn btn-success text-white text-lg"
						onClick={onConfirm}>
						Confirm Join
					</button>
				</div>
			</div>
			<div className="modal-backdrop"></div>
		</div>
	);
};

export default ConfirmationModal;
