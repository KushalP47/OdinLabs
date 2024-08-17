import { useEffect, useState } from "react";
import CodeEditorWindow from "../Editor/CodeEditorWindow";
import { languageOptions } from "../../constants/languageOptions";
import { themeOptions } from "../../constants/themeOptions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { codeExecutionService } from "../../api/codeExecutionService";
import { defineTheme } from "../../lib/defineThemes";
import OutputWindow from "../Editor/OutputWindow";
import CustomInput from "../Editor/CustomInput";
import OutputDetails from "../Editor/OutputDetails";
import LanguagesDropdown from "../Editor/LanguageDropdown";
import ThemeDropdown from "../Editor/ThemeDropdown";
import { LanguageOption } from "../../constants/languageOptions";
import { themeOption } from "../../constants/themeOptions";
import { Submission } from "../../types/submissions";
import SubmissionDetails from "../Submission/SubmissionDetails";
import { testcaseVerdict } from "../../types/submissions";
import { useParams } from "react-router-dom";

type CodeEditorProps = {
	problemId: number;
	problemDifficulty: string;
	problemCppTemplate: string;
	problemCppDriverCode?: string;
	problemJavaTemplate: string;
	problemJavaDriverCode?: string;
	problemPythonTemplate: string;
	problemPythonDriverCode?: string;
};

const CodeEditor = ({
	problemId,
	problemDifficulty,
	problemCppTemplate,
	problemCppDriverCode,
	problemJavaTemplate,
	problemJavaDriverCode,
	problemPythonTemplate,
	problemPythonDriverCode,
}: CodeEditorProps) => {
	const [code, setCode] = useState(problemCppTemplate);
	const [customInput, setCustomInput] = useState("");
	const [outputDetails, setOutputDetails] = useState(null);
	const [runProcessing, setRunProcessing] = useState(false);
	const [submitProcessing, setSubmitProcessing] = useState(false);
	const [theme, setTheme] = useState<themeOption>(themeOptions[0]);
	const [language, setLanguage] = useState<LanguageOption>(languageOptions[0]);
	const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
	const [tab, setTab] = useState<"Editor" | "Input" | "Output">("Editor");
	const [submissionDetails, setSubmissionDetails] = useState<Submission | null>(
		null,
	);
	const templates = {
		cpp: problemCppTemplate,
		java: problemJavaTemplate,
		python: problemPythonTemplate,
	};

	const assignmentId = useParams().assignmentId;
	const contestId = useParams().contestId;

	const handleLanguageChange = (sl: LanguageOption | null) => {
		if (!sl) return;
		setLanguage(sl);

		// Update the template based on the selected language
		let selectedTemplate = "";
		switch (sl.value) {
			case "cpp":
				selectedTemplate = templates.cpp;
				break;
			case "java":
				selectedTemplate = templates.java;
				break;
			case "python":
				selectedTemplate = templates.python;
				break;
			default:
				selectedTemplate = "";
		}
		handleEditorChange(selectedTemplate);
	};

	const onChange = (action: string, data: string) => {
		if (action === "code") {
			setCode(data);
		} else {
			console.warn("case not handled!", action, data);
		}
	};

	const handleCompile = async () => {
		setRunProcessing(true);
		let finalCode = code;
		if (language.value === "python") {
			finalCode = problemPythonDriverCode + code;
		} else if (language.value === "java") {
			finalCode = problemJavaDriverCode + code;
		} else {
			finalCode = problemCppDriverCode + code;
		}
		const res = await codeExecutionService.executeCode(
			finalCode,
			language.id,
			customInput,
			language.value,
		);
		console.log("res...", res);
		if (res.ok === false) {
			setRunProcessing(false);
			showErrorToast(res.message);
		}
		const token = res.token;
		await checkStatus(token);
		setTab("Output");
	};

	const sleep = (delay: number) =>
		new Promise((resolve) => setTimeout(resolve, delay));

	const checkStatus = async (token: string, isSubmission: boolean = false) => {
		// We will come to the implementation later in the code
		const res = await codeExecutionService.checkStatus(token);
		if (res.errors) {
			setRunProcessing(false);
			showErrorToast(res.errors || res.message || "Something went wrong!");
		}
		const statusId = res.status?.id;
		console.log("statusId...", statusId);
		if (statusId === 1 || statusId === 2) {
			// still processing
			await sleep(1000);
			checkStatus(token, isSubmission);
			return;
		} else {
			if (isSubmission) {
				const TestCaseVeridict: testcaseVerdict = {
					status: res.status?.description || "",
					time: res.time || 0,
					memory: res.memory || 0,
				};
				console.log("TestCaseVeridict...", TestCaseVeridict);
				return TestCaseVeridict;
			} else {
				setRunProcessing(false);
				setOutputDetails(res);
				showSuccessToast(`Compiled Successfully!`);
				console.log("response.data", res);
				return;
			}
		}
	};

	const handleSubmit = async () => {
		setSubmitProcessing(true);
		let finalCode = code;
		if (language.value === "python") {
			finalCode = code + problemPythonDriverCode;
		} else if (language.value === "java") {
			finalCode = code + problemJavaDriverCode;
		} else {
			finalCode = code + problemCppDriverCode;
		}
		console.log("submitting code...", code);
		const res = await codeExecutionService.submitCode(
			finalCode,
			language.id,
			problemId,
		);
		console.log("res...", res);
		if (res.statusCode !== 200) {
			setSubmitProcessing(false);
			showErrorToast(res.errors);
			return;
		}
		const tokens: string[] = res.data.data;
		console.log("tokens...", tokens);
		let i = 0;
		const testcasesVerdict: Array<testcaseVerdict> = [];
		while (testcasesVerdict.length < tokens.length) {
			const currentTestcaseVerdict = await checkStatus(tokens[i], true);

			console.log("for token...", tokens[i]);
			console.log("currentTestcaseVerdict...", currentTestcaseVerdict);
			if (currentTestcaseVerdict !== undefined) {
				testcasesVerdict.push(currentTestcaseVerdict);
			}
			i = (i + 1) % tokens.length;
		}
		console.log("Testcases Verdict...", testcasesVerdict);
		const submissionResp = await codeExecutionService.storeSubmission(
			{
				submissionSourceCode: code,
				submissionLanguageId: language.id,
				submissionProblemId: problemId,
				submissionTestcasesVerdict: testcasesVerdict,
			},
			assignmentId,
			contestId,
			problemDifficulty,
		);
		console.log("submissionResp...", submissionResp);
		if (!submissionResp.data.ok) {
			setSubmitProcessing(false);
			showErrorToast(submissionResp.message);
			return;
		}
		const submissionDetails = submissionResp.data.data as Submission;
		setSubmissionDetails(submissionDetails);
		setIsModalVisible(true);
		console.log("Modal visibility should be true now: ", isModalVisible);
		setSubmitProcessing(false);
	};

	const closeModal = () => {
		setIsModalVisible(false);
	};

	const handleThemeChange = (th: themeOption | null) => {
		if (!th) return;
		defineTheme(th.value).then(() => setTheme(th));
	};

	const handleEditorChange = (value: string | undefined) => {
		if (value === undefined) return;
		setCode(value);
		onChange("code", value);
	};

	useEffect(() => {
		defineTheme("dark").then(() => setTheme(themeOptions[1]));
		handleLanguageChange(languageOptions[0]);
		handleThemeChange(themeOptions[1]);
		setCode(problemCppTemplate);
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
			{isModalVisible && (
				<SubmissionDetails
					submissionDetails={submissionDetails}
					closeModal={closeModal}
				/>
			)}
			<div>
				<div className="tabs tabs-boxed mb-4 bg-gray-100 font-bold text-lg">
					<a
						className={`tab ${
							tab === "Editor" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("Editor")}>
						Editor
					</a>
					<a
						className={`tab ${
							tab === "Input" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("Input")}>
						Input
					</a>
					<a
						className={`tab ${
							tab === "Output" ? "bg-white text-secondary text-xl" : "text-xl"
						}`}
						onClick={() => setTab("Output")}>
						Output
					</a>
				</div>
				{/* Code Editor Component */}
				{tab === "Editor" && (
					<div
						className={`flex flex-col border-4 border-secondary rounded-xl ${
							theme.label === "Light" ? "bg-gray-50" : "bg-editorbg"
						}`}>
						<div className="flex flex-row justify-center items-center w-full space-x-8 p-4">
							<div className="w-1/2 flex flex-row items-center justify-center space-y-2">
								<label className="text-xl font-semibold text-secondary mr-2">
									Language:{" "}
								</label>
								<LanguagesDropdown
									onSelectChange={handleLanguageChange}
									languageDefaultOption={language}
								/>
							</div>
							<div className="w-1/2 flex flex-row items-center justify-center space-y-2">
								<label className="text-xl font-semibold text-secondary mr-2">
									Theme:
								</label>
								<ThemeDropdown handleThemeChange={handleThemeChange} />
							</div>
						</div>
						<div
							className={`w-full bg-basecolor ${
								theme.label === "Light" ? "bg-gray-50" : "bg-editorbg"
							} p-2 rounded-xl`}>
							<div className="flex flex-col w-full h-full justify-start items-end p-2 mb-2">
								<CodeEditorWindow
									code={code}
									onChange={onChange}
									language={language?.value}
									theme={theme.value}
									readOnly={false} // Pass readOnly prop
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
					</div>
				)}
				{/* Output Window Component */}
				{tab === "Output" && (
					<div className="flex flex-col">
						<div className="flex flex-shrink-0 w-full flex-col">
							<div className="flex flex-col items-end"></div>
							{outputDetails && <OutputDetails outputDetails={outputDetails} />}
						</div>
						<div className="w-full bg-white border-basecolor rounded-box p-6">
							<OutputWindow
								outputDetails={outputDetails}
								language_id={language.id}
							/>
						</div>
					</div>
				)}
				{/* Custom Input Component */}
				{tab === "Input" && (
					<div className="flex flex-col">
						<div className="bg-white border-basecolor rounded-box p-2">
							<CustomInput
								customInput={customInput}
								setCustomInput={setCustomInput}
							/>
							<div className="divider divider-horizontal"></div>
							<div className="flex flex-row justify-end items-center m-2 px-4">
								<button
									onClick={handleCompile}
									disabled={!code}
									className="btn btn-sm btn-primary text-white text-lg">
									{runProcessing ? "Processing..." : "Compile"}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default CodeEditor;
