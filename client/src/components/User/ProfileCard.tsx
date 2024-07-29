import { User } from "../types/user";

interface ProfileCardProps {
	user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
	return (
		<div className="bg-gradient-to-r from-secondary  to-basecolor text-white py-10 px-8 rounded-lg shadow-xl w-full mt-6">
			<div className="flex items-center justify-between">
				{/* Avatar Section */}
				<div className="flex items-center space-x-4">
					<div className="bg-white rounded-full w-28 h-28 flex items-center justify-center text-4xl font-bold text-blue-600">
						{user.userName.charAt(0)}
					</div>
					<div>
						{/* Greeting Message */}
						<h1 className="text-4xl font-bold mb-2">Hello, {user.userName}!</h1>
						{/* User Details */}
						<div className="text-lg space-y-1">
							<p>
								<span className="font-semibold">Roll Number:</span>{" "}
								{user.userRollNumber}
							</p>
							<p>
								<span className="font-semibold">Email:</span> {user.userEmail}
							</p>
							<p>
								<span className="font-semibold">Section:</span>{" "}
								{user.userSection}
							</p>
							<p>
								<span className="font-semibold">Team Name:</span>{" "}
								<span className="bg-yellow-500 text-gray-800 px-2 py-1 rounded-full">
									{user.userTeamName}
								</span>
							</p>
						</div>
					</div>
				</div>

				{/* Role Badge */}
				<div>
					{user.userIsAdmin ? (
						<span className="bg-green-500 px-6 py-3 rounded-full text-white font-semibold text-xl shadow-md">
							Admin
						</span>
					) : (
						<span className="bg-pink-500 px-6 py-3 rounded-full text-white font-semibold text-xl shadow-md">
							Student
						</span>
					)}
				</div>
			</div>

			{/* Decorative Line */}
			<div className="mt-6 border-t-2 border-white opacity-50"></div>

			{/* Additional Information */}
			<div className="mt-6 flex justify-between items-center text-lg w-full">
				<div>
					<p>
						Welcome to the platform! Here, you can explore practice problems,
						track your assignments, and give contest.
					</p>
				</div>
				{/* <div className="flex">
					
					<button className="bg-white text-secondary px-4 py-2 rounded-full font-semibold shadow-md">
						View Profile
					</button>
					<button className="bg-white text-secondary px-4 py-2 rounded-full font-semibold shadow-md">
						Settings
					</button>
				</div> */}
			</div>
		</div>
	);
};

export default ProfileCard;
