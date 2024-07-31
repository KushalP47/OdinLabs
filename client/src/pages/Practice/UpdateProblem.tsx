import Navbar from "../../components/Utils/Navbar";
import UpdateProblemForm from "../../components/Problem/UpdateProblemForm";

const UpdateProblem = () => {
	return (
		<div>
			<Navbar currentPage="Practice" />
			<div className="flex flex-col min-h-screen">
				<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
					<h1 className="text-3xl font-bold mb-6 text-center text-secondary w-full">
						Update Problem
					</h1>
					<UpdateProblemForm />
				</div>
			</div>
		</div>
	);
};

export default UpdateProblem;
