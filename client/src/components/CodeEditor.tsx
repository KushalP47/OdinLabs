import { useEffect, useState } from "react";
import CodeEditorWindow from "./Editor/CodeEditorWindow";
import { languageOptions } from "../constants/languageOptions";
import { themeOptions } from "../constants/themeOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { codeExecutionService } from "../api/codeExecutionService";
import { defineTheme } from "../lib/defineThemes";
import OutputWindow from "./Editor/OutputWindow";
import CustomInput from "./Editor/CustomInput";
import OutputDetails from "./Editor/OutputDetails";
import LanguagesDropdown from "./Editor/LanguageDropdown";
import ThemeDropdown from "./Editor/ThemeDropdown";
import { LanguageOption } from "../constants/languageOptions";
import { themeOption } from "../constants/themeOptions";
import { Submission } from "../types/submissions";
import SubmissionDetails from "./SubmissionDetails";

type CodeEditorProps = {
	problemId: number;
};

const CodeEditor = ({ problemId }: CodeEditorProps) => {
	const [code, setCode] = useState("");
	const [customInput, setCustomInput] = useState("");
	const [outputDetails, setOutputDetails] = useState(null);
	const [runProcessing, setRunProcessing] = useState(false);
	const [submitProcessing, setSubmitProcessing] = useState(false);
	const [theme, setTheme] = useState<themeOption>(themeOptions[0]);
	const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [submissionDetails, setSubmissionDetails] = useState<Submission | null>(
		null,
	);
	const onSelectChange = (sl: LanguageOption | null) => {
		if (!sl) return;
		console.log("selected Option...", sl);
		setLanguage(sl);
	};

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
		setRunProcessing(true);
		const res = await codeExecutionService.executeCode(
			code,
			language.id,
			customInput,
			language.value,
		);
		console.log("res...", res);
		if (res.errors) {
			setRunProcessing(false);
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
			setRunProcessing(false);
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
			setRunProcessing(false);
			setOutputDetails(res);
			showSuccessToast(`Compiled Successfully!`);
			console.log("response.data", res);
			return;
		}
	};

	const handleSubmit = async () => {
		setSubmitProcessing(true);
		console.log("submitting code...", code);
		const res = await codeExecutionService.submitCode(
			code,
			language.id,
			problemId,
		);
		console.log("res...", res);
		if (res.statusCode !== 200) {
			setSubmitProcessing(false);
			showErrorToast(res.errors);
			return;
		}
		const submissionDetails = res.data;
		setSubmissionDetails(submissionDetails);
		const dummySubmissionDetails: Submission = {
			id: 1,
			source_code: code,
			language_id: language.id, // Assuming 101 represents a specific programming language, e.g., Python
			problem_id: problemId, // Example problem ID
			user_id: 123, // Example user ID
			status: "Accepted",
			testcasesVerdict: [
				{
					status: "Accepted",
					time: 0.1,
					memory: 256,
				},
				{
					status: "Accepted",
					time: 0.2,
					memory: 512,
				},
			],
			created_at: "2023-04-01T12:00:00Z",
			updated_at: "2023-04-01T12:00:00Z",
		};
		console.log("dummySubmissionDetails...", dummySubmissionDetails);
		setSubmissionDetails(dummySubmissionDetails);
		setIsModalVisible(true);
		console.log("Modal visibility should be true now: ", isModalVisible);
		setSubmitProcessing(false);
	};

	const closeModal = () => {
		setIsModalVisible(false);
		console.log("Modal visibility should be false now: ", isModalVisible);
	};

	function handleThemeChange(th: themeOption | null) {
		if (!th) return;
		const theme = th;
		console.log("theme...", theme);
		defineTheme(theme.value).then((_) => setTheme(theme));
	}

	useEffect(() => {
		defineTheme("dark").then((_) => setTheme(themeOptions[1]));
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

			<div className="flex flex-col">
				<div className="flex flex-row justify-center items-center">
					<div className="px-4 mb-2">
						<LanguagesDropdown onSelectChange={onSelectChange} />
					</div>
					<div className="px-4 mb-2">
						<ThemeDropdown handleThemeChange={handleThemeChange} />
					</div>
				</div>
				<div
					className={`w-full border-4 ${
						theme.label === "Light" ? "bg-gray-50" : "bg-basecolor"
					} border-secondary p-2 rounded-xl`}>
					<div className="flex flex-col w-full h-full justify-start items-end">
						<CodeEditorWindow
							code={code}
							onChange={onChange}
							language={language?.value}
							theme={theme.value}
						/>
					</div>
					<div className="flex flex-row justify-end items-center m-2 px-4">
						<button
							onClick={handleCompile}
							disabled={!code}
							className="btn btn-sm btn-primary text-white text-lg">
							{runProcessing ? "Processing..." : "Compile"}
						</button>
						<div className="divider divider-horizontal"></div>
						<button
							disabled={!code}
							onClick={handleSubmit}
							className="btn btn-sm btn-success text-white text-lg">
							{submitProcessing ? "Submitting..." : "Submit"}
						</button>
					</div>
				</div>
				{isModalVisible && (
					<SubmissionDetails
						submissionDetails={submissionDetails}
						closeModal={closeModal}
					/>
				)}
				<div className="flex flex-shrink-0 w-full flex-col">
					<div className="flex flex-col items-end"></div>
					{outputDetails && <OutputDetails outputDetails={outputDetails} />}
				</div>
				<div
					role="tablist"
					className="tabs tabs-lifted w-full rounded-xl bg-white mt-2">
					<input
						type="radio"
						name="my_tabs_2"
						role="tab"
						className="tab [--tab-bg:white] text-secondary font-semibold text-xl"
						aria-label="Input"
					/>
					<div
						role="tabpanel"
						className="tab-content bg-white border-basecolor rounded-box p-2">
						<CustomInput
							customInput={customInput}
							setCustomInput={setCustomInput}
						/>
					</div>

					<input
						type="radio"
						name="my_tabs_2"
						role="tab"
						className="tab [--tab-bg:white] text-secondary font-semibold text-xl"
						aria-label="Output"
						defaultChecked
					/>
					<div
						role="tabpanel"
						className="w-full tab-content bg-white border-basecolor rounded-box p-6">
						<OutputWindow
							outputDetails={outputDetails}
							language_id={language.id}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default CodeEditor;
