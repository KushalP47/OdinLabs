import { themeOption, themeOptions } from "../../constants/themeOptions";
import DropdownMenu from "../Utils/DropDownMenu";

type ThemeDropdownProps = {
	handleThemeChange: (selectedOption: themeOption | null) => void;
};

const ThemeDropdown = ({ handleThemeChange }: ThemeDropdownProps) => {
	return (
		<DropdownMenu
			options={themeOptions}
			onSelect={handleThemeChange}
			placeholder="Select Theme"
			defaultOption={themeOptions[1]}
		/>
	);
};

export default ThemeDropdown;
