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
	const [tab, setTab] = useState<"Editor" | "Input" | "Output">("Editor");
	const [submissionDetails, setSubmissionDetails] = useState<Submission | null>(
		null,
	);
	const assignmentId = useParams().assignmentId;
	const contestId = useParams().contestId;
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
		}
		const token = res.token;
		await checkStatus(token);
	};

	const checkStatus = async (token: string, isSubmission: boolean = false) => {
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
				checkStatus(token, isSubmission);
			}, 2000);
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
		const tokens = res.data as Array<string>;
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
		);
		console.log("submissionResp...", submissionResp);
		if (submissionResp.statusCode !== 200) {
			setSubmitProcessing(false);
			showErrorToast(submissionResp.errors);
			return;
		}
		const submissionDetails = submissionResp.data as Submission;
		setSubmissionDetails(submissionDetails);
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
					<div className="flex flex-col">
						<div className="flex flex-row justify-center items-center text-center m-2 w-full">
							<div className="w-1/2 px-4 mb-2">
								<LanguagesDropdown onSelectChange={onSelectChange} />
							</div>
							<div className="w-1/2 px-4 mb-2">
								<ThemeDropdown handleThemeChange={handleThemeChange} />
							</div>
						</div>
						<div
							className={`w-full border-4 bg-basecolor ${
								theme.label === "Light" ? "bg-gray-50" : "bg-editorbg"
							} border-secondary p-2 rounded-xl`}>
							<div className="flex flex-col w-full h-full justify-start items-end mt-2">
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
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default CodeEditor;
