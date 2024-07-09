import Select from "react-select";
import { customStyles } from "../../constants/customStyles";
import { themeOptions } from "../../constants/themeOptions";
import { themeOption } from "../../constants/themeOptions";

type ThemeDropdownProps = {
	handleThemeChange: (selectedOption: themeOption | null) => void;
};

const ThemeDropdown = ({ handleThemeChange }: ThemeDropdownProps) => {
	return (
		<Select
			placeholder={`Filter By Category`}
			options={themeOptions}
			styles={customStyles}
			defaultValue={themeOptions[1]}
			onChange={(selectedOption) => handleThemeChange(selectedOption)}
		/>
	);
};

export default ThemeDropdown;
