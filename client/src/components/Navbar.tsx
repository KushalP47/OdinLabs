import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
interface NavbarProps {
	currentPage: string;
}
import logo from "../assets/viking.png";

const Navbar: React.FC<NavbarProps> = ({ currentPage }) => {
	const user = useSelector((state: any) => state.auth.userData);
	const status = useSelector((state: any) => state.auth.status);
	const adminPages = [
		// { item: "Dashboard", url: "dashboard" },
		{ item: "Practice", url: "practice" },
		{ item: "Assignment", url: "assignment" },
		{ item: "Contest", url: "contest" },
		// { item: "Students", url: "students" },
	];
	const studentPages = [
		// { item: "Dashboard", url: "dashboard" },
		{ item: "Practice", url: "practice" },
		{ item: "Assignment", url: "assignment" },
		{ item: "Contest", url: "contest" },
		// { item: "Room", url: "room" },
	];
	const pages = user?.isAdmin === true ? adminPages : studentPages;
	const getNavItemClass = (path: string) => {
		return currentPage === path
			? "block py-2 px-4 text-xl rounded font-bold bg-secondary text-white transition duration-300"
			: "block py-2 px-4 text-xl font-bold text-white rounded hover:text-secondary transition duration-300";
	};
	return (
		<>
			<div className="navbar bg-base-100">
				<div className="navbar-start">
					<Link
						to="/dashboard"
						className="btn btn-ghost text-3xl font-bold text-secondary">
						<img src={logo} className="w-16px h-16px" />
						OdinLabs
					</Link>
				</div>
				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal px-4">
						{pages.map((page) => (
							<li key={page.url}>
								<Link
									to={`/${page.url}`}
									className={getNavItemClass(page.item)}>
									{page.item}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div className="navbar-end">
					{status ? (
						<div className="dropdown dropdown-end">
							<div
								tabIndex={0}
								role="button"
								className="btn btn-ghost btn-circle avatar">
								<div className="w-10 rounded-full">
									<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
										<path
											fill="#767ffe"
											d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
										/>
									</svg>
								</div>
							</div>
							<ul
								tabIndex={0}
								className="menu menu-lg text-primary dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-60 p-2 shadow">
								<li>
									<a className="justify-between">Profile</a>
								</li>
								{user?.isAdmin ? (
									<li>
										<Link to="/students">Watch</Link>
									</li>
								) : (
									<li>
										<Link to="/room">Stream</Link>
									</li>
								)}
								<li>
									<div className="flex flex-row justify-between">
										Dark Mode
										<input
											type="checkbox"
											value="synthwave"
											className="toggle theme-controller"
										/>
									</div>
								</li>
								<li>
									<a className="justify-between">Marks</a>
								</li>
								<li>
									<Link to="/submissions">Submissions</Link>
								</li>
								<li className="btn btn-primary text-white">
									<Link to="/auth/logout">Logout</Link>
								</li>
							</ul>
						</div>
					) : (
						<>
							<Link
								to="/auth/login"
								className="btn btn-primary text-white text-md">
								Login
							</Link>
							<div className="divider divider-horizontal">OR</div>
							<Link
								to="/auth/register"
								className="btn btn-primary text-white text-md">
								Register
							</Link>
						</>
					)}
					{/* <a className="btn btn-primary">Button</a> */}
				</div>
			</div>
		</>
	);
};

export default Navbar;
