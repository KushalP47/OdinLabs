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
		<div className="relative">
			<button
				onClick={toggleDropdown}
				className="btn btn-sm text-white text-xl font-semibold btn-primary w-3/4">
				{selectedOption ? selectedOption.label : placeholder}
			</button>
			{isOpen && (
				<ul className="absolute z-10 mt-2 bg-gray-50 font-semibold text-secondary border border-gray-300 rounded-lg shadow-lg w-3/4">
					{options.map((option) => (
						<li
							key={option.id}
							onClick={() => handleOptionClick(option)}
							className="cursor-pointer hover:bg-gray-200 p-2">
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default DropdownMenu;
