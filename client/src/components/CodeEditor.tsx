import { useEffect, useState } from "react";
import CodeEditorWindow from "./Editor/CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { codeExecutionService } from "../api/codeExecutionService";
import { defineTheme } from "../lib/defineThemes";
import useKeyPress from "../hooks/useKeyPress";
import OutputWindow from "./Editor/OutputWindow";
import CustomInput from "./Editor/CustomInput";
import OutputDetails from "./Editor/OutputDetails";
import ThemeDropdown from "./Editor/ThemeDropdown";
import LanguagesDropdown from "./Editor/LanguageDropdown";
import { LanguageOption } from "../constants/languageOptions";
import { themeOption } from "./Editor/ThemeDropdown";
const javascriptDefault = `// some comment`;

const CodeEditor = () => {
	const [code, setCode] = useState(javascriptDefault);
	const [customInput, setCustomInput] = useState("");
	const [outputDetails, setOutputDetails] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [theme, setTheme] = useState<themeOption>({
		value: "oceanic-next",
		label: "Oceanic Next",
		key: "oceanic-next",
	});
	const [language, setLanguage] = useState(languageOptions[0]);

	const enterPress = useKeyPress("Enter");
	const ctrlPress = useKeyPress("Control");

	const onSelectChange = (sl: LanguageOption | null) => {
		if (!sl) return;
		console.log("selected Option...", sl);
		setLanguage(sl);
	};

	useEffect(() => {
		if (enterPress && ctrlPress) {
			console.log("enterPress", enterPress);
			console.log("ctrlPress", ctrlPress);
			handleCompile();
		}
	}, [ctrlPress, enterPress]);
	const onChange = (action: string, data: string) => {
		switch (action) {
			case "code": {
				setCode(data);
				break;
			}
			default: {
				console.warn("case not handled!", action, data);
			}
		}
	};
	const handleCompile = async () => {
		setProcessing(true);
		const res = await codeExecutionService.executeCode(
			btoa(code),
			language.id,
			btoa(customInput),
		);
		console.log("res...", res);
		if (res.errors) {
			setProcessing(false);
			showErrorToast(res.errors);
		} else {
			showSuccessToast("Compiled Successfully!");
		}
		const token = res.token;
		await checkStatus(token);
	};

	const checkStatus = async (token: string) => {
		// We will come to the implementation later in the code
		const res = await codeExecutionService.checkStatus(token);
		if (res.errors) {
			setProcessing(false);
			showErrorToast(res.errors);
		}
		const statusId = res.status?.id;
		if (statusId === 1 || statusId === 2) {
			// still processing
			setTimeout(() => {
				checkStatus(token);
			}, 2000);
			return;
		} else {
			setProcessing(false);
			setOutputDetails(res);
			showSuccessToast(`Compiled Successfully!`);
			console.log("response.data", res);
			return;
		}
	};

	function handleThemeChange(th: themeOption) {
		const theme = th;
		console.log("theme...", theme);

		if (["light", "vs-dark"].includes(theme.value)) {
			setTheme(theme);
		} else {
			defineTheme(theme.value).then((_) => setTheme(theme));
		}
	}
	useEffect(() => {
		defineTheme("oceanic-next").then((_) =>
			setTheme({
				value: "oceanic-next",
				label: "Oceanic Next",
				key: "oceanic-next",
			}),
		);
	}, []);

	const showSuccessToast = (msg: string) => {
		toast.success(msg || `Compiled Successfully!`, {
			position: "top-right",
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};
	const showErrorToast = (msg: string) => {
		toast.error(msg || `Something went wrong! Please try again.`, {
			position: "top-right",
			autoClose: 1000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	};

	return (
		<>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<div className="flex flex-row">
				<div className="px-4 py-2">
					<LanguagesDropdown onSelectChange={onSelectChange} />
				</div>
				<div className="px-4 py-2">
					<ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
				</div>
			</div>
			<div className="flex flex-row space-x-4 items-start px-4 py-4">
				<div className="flex flex-col w-full h-full justify-start items-end">
					<CodeEditorWindow
						code={code}
						onChange={onChange}
						language={language?.value}
						theme={theme.value}
					/>
				</div>

				<div className="right-container flex flex-shrink-0 w-[30%] flex-col">
					<OutputWindow outputDetails={outputDetails} />
					<div className="flex flex-col items-end">
						<CustomInput
							customInput={customInput}
							setCustomInput={setCustomInput}
						/>
						<button
							onClick={handleCompile}
							disabled={!code}
							className={`mt-4 border-2 border-black z-10 rounded-md px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0
								${!code ? "opacity-50" : ""}`}>
							{processing ? "Processing..." : "Compile and Execute"}
						</button>
					</div>
					{outputDetails && <OutputDetails outputDetails={outputDetails} />}
				</div>
			</div>
		</>
	);
};
export default CodeEditor;
