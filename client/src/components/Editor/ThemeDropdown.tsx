import Select from "react-select";
import { monacoThemes } from "../../lib/defineThemes";
import { customStyles } from "../../constants/customStyles";

export type themeOption = {
	label: string;
	value: string;
	key: string;
};
type themeDropdownProps = {
	handleThemeChange: (selectedOption: any) => void;
	theme: { label: string; value: string; key: string };
};

const ThemeDropdown = ({ handleThemeChange, theme }: themeDropdownProps) => {
	return (
		<Select
			placeholder={`Select Theme`}
			// options={languageOptions}
			options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
				label: themeName,
				value: themeId,
				key: themeId,
			}))}
			value={theme}
			styles={customStyles}
			onChange={handleThemeChange}
		/>
	);
};

export default ThemeDropdown;
