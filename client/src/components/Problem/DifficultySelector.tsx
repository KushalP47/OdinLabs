import React from "react";

type DifficultyLevel = "easy" | "medium" | "hard";

interface DifficultySelectorProps {
	selectedDifficulty: string;
	setSelectedDifficulty: (difficulty: string) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
	selectedDifficulty,
	setSelectedDifficulty,
}) => {
	const customClassNames: Record<DifficultyLevel, string> = {
		easy: "text-success",
		medium: "text-warning",
		hard: "text-error",
	};

	const lowerCaseDifficulty =
		selectedDifficulty.toLowerCase() as DifficultyLevel;

	return (
		<div className="flex flex-col">
			<label className="font-semibold text-lg mb-2">
				Problem Difficulty <span className="text-red-500">*</span>
			</label>
			<select
				value={selectedDifficulty}
				onChange={(e) => setSelectedDifficulty(e.target.value)}
				className={`border rounded-md p-2 bg-gray-50 dark:bg-editorbg text-lg ${customClassNames[lowerCaseDifficulty]}`}
				required>
				<option value="">Select Difficulty</option>
				<option value="Easy" className={`${customClassNames.easy}`}>
					Easy
				</option>
				<option value="Medium" className={`${customClassNames.medium}`}>
					Medium
				</option>
				<option value="Hard" className={`${customClassNames.hard}`}>
					Hard
				</option>
			</select>
		</div>
	);
};

export default DifficultySelector;
