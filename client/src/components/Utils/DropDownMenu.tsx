import { useState } from "react";

type DropdownItem = {
	id: number;
	name: string;
	label: string;
	value: string;
};

type DropdownMenuProps = {
	options: DropdownItem[];
	onSelect: (selectedOption: DropdownItem | null) => void;
	placeholder: string;
	defaultOption?: DropdownItem;
};

const DropdownMenu = ({
	options,
	onSelect,
	placeholder,
	defaultOption,
}: DropdownMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState<DropdownItem | null>(
		defaultOption || null,
	);

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleOptionClick = (option: DropdownItem) => {
		setSelectedOption(option);
		onSelect(option);
		setIsOpen(false);
	};

	return (
		<div className="relative w-full">
			<button
				onClick={toggleDropdown}
				className="w-full px-2 text-center bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-2">
				{selectedOption ? selectedOption.label : placeholder}
			</button>
			{isOpen && (
				<ul className="absolute z-10 mt-2 bg-white text-gray-700 border border-gray-300 rounded-md shadow-lg w-full">
					{options.map((option) => (
						<li
							key={option.id}
							onClick={() => handleOptionClick(option)}
							className="cursor-pointer hover:bg-gray-200 p-2 text-center">
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DropdownMenu;
