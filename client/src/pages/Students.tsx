import Navbar from "../components/Navbar";

const Students = () => {
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
				<div className="flex-1 flex shadow-lg border-4 border-black rounded-lg justify-center items-center">
					<img
						src="./src/assets/react.svg"
						alt="Illustration"
						className="w-full h-auto max-w-md"
					/>
				</div>
			</div>
		</div>
	);
};

export default Students;
