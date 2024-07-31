// src/components/Problems/TagsInput.tsx

import React, { useState } from "react";

interface TagsInputProps {
	tags: string[];
	setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, setTags }) => {
	const [inputValue, setInputValue] = useState("");

	const handleAddTag = () => {
		if (inputValue && !tags.includes(inputValue)) {
			setTags([...tags, inputValue]);
			setInputValue("");
		}
	};

	const handleDeleteTag = (tag: string) => {
		setTags(tags.filter((t) => t !== tag));
	};

	return (
		<div className="flex flex-col">
			<label className="font-semibold text-lg mb-2">Problem Tags</label>
			<div className="flex flex-wrap gap-2 mb-2">
				{tags.map((tag) => (
					<div
						key={tag}
						className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded-full flex items-center space-x-1">
						<span>{tag}</span>
						<button
							type="button"
							className="hover:text-red-500"
							onClick={() => handleDeleteTag(tag)}>
							&times;
						</button>
					</div>
				))}
			</div>
			<div className="flex items-center space-x-2">
				<input
					type="text"
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className="border rounded-md p-2 w-full bg-gray-50 dark:bg-editorbg"
					placeholder="Enter a tag and press enter"
				/>
				<button
					type="button"
					onClick={handleAddTag}
					className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md">
					Add Tag
				</button>
			</div>
		</div>
	);
};

export default TagsInput;
