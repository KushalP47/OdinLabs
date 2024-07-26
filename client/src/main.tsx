import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
	Dashboard,
	Students,
	Assignments,
	Practice,
	Room,
	Login,
	Contest,
	ContestProblem,
	AssignmentProblem,
	Problem,
	SubmissionPage,
	AssignmentDetail,
	ContestPage,
	ForgotPassword,
} from "./pages/index.ts";
import Protected from "./components/Protected.tsx";
import Logout from "./components/Logout.tsx";
import App from "./App.tsx";
import "./index.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			// General routes
			{
				path: "/dashboard",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Dashboard />
					</Protected>
				),
			},
			{
				path: "/students",
				element: (
					<Protected
						onlyAdminAllowed={true}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Students />
					</Protected>
				),
			},
			{
				path: "/room",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Room />
					</Protected>
				),
			},
			{
				path: "/submissions",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<SubmissionPage />
					</Protected>
				),
			},
			// Assignment Routes
			{
				path: "/assignment",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Assignments />
					</Protected>
				),
			},
			{
				path: "/assignment/:assignmentId",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<AssignmentDetail />
					</Protected>
				),
				children: [
					{
						path: "/assignment/:assignmentId/problem/:problemId",
						element: (
							<Protected
								onlyAdminAllowed={false}
								allowDuringContest={false}
								isLoggedIn={true}>
								<AssignmentProblem />
							</Protected>
						),
					},
				],
			},
			// Practice Routes
			{
				path: "/practice",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Practice />
					</Protected>
				),
			},
			{
				path: "/practice/problem/:problemId",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Problem />
					</Protected>
				),
			},

			// Contest Routes
			{
				path: "/contest",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Contest />
					</Protected>
				),
			},
			{
				path: "/contest/:contestId",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={true}
						isLoggedIn={true}>
						<ContestPage />
					</Protected>
				),
			},
			{
				path: "/contest/:contestId/problem/:problemId",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={true}
						isLoggedIn={true}>
						<ContestProblem />
					</Protected>
				),
			},

			// Auth routes
			{
				path: "/auth/login",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={false}>
						<Login />
					</Protected>
				),
			},
			{
				path: "/auth/forgot-password",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={false}>
						<ForgotPassword />
					</Protected>
				),
			},
			{
				path: "/auth/logout",
				element: (
					<Protected
						onlyAdminAllowed={false}
						allowDuringContest={false}
						isLoggedIn={true}>
						<Logout />
					</Protected>
				),
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>,
);
