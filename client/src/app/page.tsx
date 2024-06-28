import Link from "next/link";

export default function Home() {
	return (
		<div className="flex flex-row w-screen min-h-screen items-center justify-center border-4 border-red-600">
			<div className="flex flex-col justify-equal items-center border-2 text-xl font-bold  border-blue-600 rounded-lg">
				Home Page
				<div className="flex flex-row w-full items-center justify-center p-4 space-x-2">
					<button className="bg-green-700 text-white text-lg p-2 px-4 rounded-lg">
						<Link href="/auth/login">Login</Link>
					</button>
					<button className="bg-blue-700 text-white text-lg p-2 px-4 rounded-lg">
						<Link href="/auth/register">Register</Link>
					</button>
				</div>
			</div>
		</div>
	);
}
