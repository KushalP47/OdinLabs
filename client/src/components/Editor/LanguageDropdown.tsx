import { LanguageOption } from "../../constants/languageOptions";
import DropdownMenu from "../Utils/DropDownMenu";

type LanguagesDropdownProps = {
	onSelectChange: (selectedOption: LanguageOption | null) => void;
	languageDefaultOption?: LanguageOption;
};

const LanguagesDropdown = ({
	onSelectChange,
	languageDefaultOption,
}: LanguagesDropdownProps) => {
	const languageOptions = [
		{ id: 54, name: "C++ (GCC 9.2.0)", label: "C++", value: "cpp" },
		{ id: 62, name: "Java (OpenJDK 13.0.1)", label: "Java", value: "java" },
		{ id: 71, name: "Python (3.8.1)", label: "Python", value: "python" },
	];

	return (
		<DropdownMenu
			options={languageOptions}
			onSelect={onSelectChange}
			placeholder="Select Language"
			defaultOption={languageDefaultOption}
		/>
	);
};

export default LanguagesDropdown;
