import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
interface NavbarProps {
	currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
	const user = useSelector((state: any) => state.auth.userData);
	const status = useSelector((state: any) => state.auth.status);
	const adminPages = [
		{ item: "Dashboard", url: "dashboard" },
		{ item: "Assignment", url: "assignment" },
		{ item: "Contest", url: "contest" },
		{ item: "Practice", url: "practice" },
		{ item: "Students", url: "students" },
	];
	const studentPages = [
		{ item: "Dashboard", url: "dashboard" },
		{ item: "Assignment", url: "assignment" },
		{ item: "Contest", url: "contest" },
		{ item: "Practice", url: "practice" },
	];
	const pages = user?.isAdmin === true ? adminPages : studentPages;
	const getNavItemClass = (path: string) => {
		return currentPage === path
			? "block py-2 px-4 rounded bg-blue text-black transition duration-300"
			: "block py-2 px-4 rounded hover:text-blue transition duration-300";
	};
	return (
		<>
			<nav className="bg-black text-white w-1/6 flex flex-col justify-between p-4">
				{/* Logo Section */}
				<div className="mb-8">
					<img src="./src/assets/react.svg" alt="Logo" className="h-12" />
					{/* Adjust height as needed */}
				</div>

				{/* Nav Items Section */}
				<ul className="flex-1 space-y-4 text-xl">
					{pages.map((page) => (
						<li key={page.url}>
							<Link to={`/${page.url}`} className={getNavItemClass(page.item)}>
								{page.item}
							</Link>
						</li>
					))}
				</ul>
				{/* Logout Section */}
				{status && (
					<div className="mt-8">
						<button className="w-full py-2 px-4 bg-black text-blue border-4 border-blue rounded hover:bg-blue hover:text-black hover:border-black transition duration-300">
							<Link to="/auth/logout">Logout</Link>
						</button>
					</div>
				)}
			</nav>
		</>
	);
};

export default Navbar;
