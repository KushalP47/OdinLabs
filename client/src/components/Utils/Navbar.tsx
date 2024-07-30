import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { delete_cookie } from "../lib/cookieUtility";
import { useDispatch } from "react-redux";
import { setContestData } from "../store/contestSlice";
interface NavbarProps {
	currentPage: string;
	deadline?: string;
	assignmentId?: string;
	contestId?: string;
}
import logo from "../assets/viking.png";

const Navbar: React.FC<NavbarProps> = ({
	currentPage,
	deadline,
	contestId,
	assignmentId,
}) => {
	const user = useSelector((state: any) => state.auth.userData);
	const status = useSelector((state: any) => state.auth.status);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const pages = [
		{ item: "Practice", url: "practice" },
		{ item: "Assignment", url: "assignment" },
		{ item: "Contest", url: "contest" },
	];
	// console.log(currentPage, deadline, assignmentId);
	const getNavItemClass = (path: string) => {
		return currentPage === path
			? "block py-2 px-4 text-xl rounded font-bold bg-secondary text-white transition duration-300"
			: "block py-2 px-4 text-xl font-bold text-white rounded hover:text-secondary transition duration-300";
	};

	// Countdown logic
	const calculateTimeLeft = () => {
		const difference = +new Date(deadline || "") - +new Date();
		let timeLeft: any = {};

		if (difference > 0) {
			timeLeft = {
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			};
		}
		return timeLeft;
	};

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(calculateTimeLeft());
		}, 1000);

		const handleFullscreenChange = () => {
			if (!document.fullscreenElement) {
				handleEndContest();
			}
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);

		return () => {
			clearTimeout(timer);
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	});

	const toFullscreen = () => {
		document.documentElement.requestFullscreen().catch((err) => {
			console.error("Error attempting to enable fullscreen:", err.message);
		});
	};

	const renderCountdown = () => {
		if (contestId && user.isUserAdmin === false) toFullscreen();
		return (
			<span className="countdown font-mono text-2xl">
				<span
					style={{ "--value": timeLeft.hours } as React.CSSProperties}></span>
				:
				<span
					style={{ "--value": timeLeft.minutes } as React.CSSProperties}></span>
				:
				<span
					style={{ "--value": timeLeft.seconds } as React.CSSProperties}></span>
			</span>
		);
	};

	const handleEndContest = () => {
		console.log("Ending contest...");
		delete_cookie("customContestCookie");
		document.exitFullscreen();
		dispatch(setContestData({ customContestCookie: null, contestId: null }));
		navigate("/dashboard");
	};

	return (
		<>
			{/* Normal Navbar */}
			{!deadline && !contestId && !assignmentId && (
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512">
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
									{user?.userIsAdmin ? (
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
									className="btn btn-primary text-white text-lg">
									Login
								</Link>
							</>
						)}
					</div>
				</div>
			)}

			{/* Navbar for Assignments */}
			{deadline && assignmentId && (
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
							<li>
								<Link
									to={`/assignment/${assignmentId}`}
									className="btn btn-primary text-lg text-white">
									Back to Assignment
								</Link>
							</li>
							<li>{renderCountdown()}</li>
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
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512">
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
									{user?.userIsAdmin ? (
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
									className="btn btn-primary text-white text-lg">
									Login
								</Link>
							</>
						)}
					</div>
				</div>
			)}

			{/* Navbar for Contests */}
			{deadline && contestId && (
				<div className="navbar bg-base-100">
					<div className="navbar-start">
						<div className="btn btn-ghost text-3xl font-bold text-secondary">
							<img src={logo} className="w-16px h-16px" />
							OdinLabs
						</div>
					</div>
					<div className="navbar-center hidden lg:flex">
						<ul className="menu menu-horizontal px-4">
							<li>
								<Link
									to={`/contest/${contestId}`}
									className="btn btn-secondary">
									Back to Contest
								</Link>
							</li>
							<li>{renderCountdown()}</li>
						</ul>
					</div>
					<div className="navbar-end">
						{!status && (
							<>
								<Link
									to="/auth/login"
									className="btn btn-primary text-white text-lg">
									Login
								</Link>
							</>
						)}
						{status && (
							<>
								<button className="btn btn-error" onClick={handleEndContest}>
									End Contest
								</button>
							</>
						)}
					</div>
				</div>
			)}
		</>
	);
};

export default Navbar;
