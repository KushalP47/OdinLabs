interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
}

const SuccessModal = ({ isOpen, onClose, message }: SuccessModalProps) => {
	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
					<div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto text-center">
						<h2 className="text-xl font-semibold mb-4 text-success">Success</h2>
						<p className="mb-6 text-basecolor text-lg">{message}</p>
						<button
							className="btn btn-error text-white px-4 py-2 rounded text-lg hover:bg-red-600"
							onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default SuccessModal;
