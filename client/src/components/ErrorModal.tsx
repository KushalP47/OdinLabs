// ErrorModal.tsx
interface ErrorModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
}

const ErrorModal = ({ isOpen, onClose, message }: ErrorModalProps) => {
	return (
		<>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
					<div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto text-center">
						<h2 className="text-xl font-semibold mb-4 text-secondary">Error</h2>
						<p className="mb-6 text-basecolor">{message}</p>
						<button
							className="btn btn-error text-white px-4 py-2 rounded hover:bg-red-600"
							onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default ErrorModal;
