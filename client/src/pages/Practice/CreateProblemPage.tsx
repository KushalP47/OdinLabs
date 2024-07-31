import { useState } from "react";
import CreateProblemForm from "../../components/Problem/CreateProblemForm";
import Navbar from "../../components/Utils/Navbar";

const CreateProblemPage = () => {
	return (
		<>
			<Navbar currentPage="Practice" />
			<div className="flex flex-col min-h-screen">
				<div className="bg-white w-full min-h-screen border-4 border-secondary shadow-xl flex flex-col p-8">
					<h1 className="text-3xl font-bold text-secondary mb-6 text-center w-full">
						Create Problem
					</h1>
					<CreateProblemForm />
				</div>
			</div>
		</>
	);
};

export default CreateProblemPage;
