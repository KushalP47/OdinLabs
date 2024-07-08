import Select from "react-select";
import { customStyles } from "../../constants/customStyles";
import { languageOptions } from "../../constants/languageOptions";
import { LanguageOption } from "../../constants/languageOptions";

type LanguagesDropdownProps = {
	onSelectChange: (selectedOption: LanguageOption | null) => void;
};

const LanguagesDropdown = ({ onSelectChange }: LanguagesDropdownProps) => {
	return (
		<Select
			placeholder={`Filter By Category`}
			options={languageOptions}
			styles={customStyles}
			defaultValue={languageOptions[0]}
			onChange={(selectedOption) => onSelectChange(selectedOption)}
		/>
	);
};

export default LanguagesDropdown;
