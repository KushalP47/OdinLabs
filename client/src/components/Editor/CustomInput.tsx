type CustomInputProps = {
	customInput: string;
	setCustomInput: React.Dispatch<React.SetStateAction<string>>;
};
const CustomInput = ({ customInput, setCustomInput }: CustomInputProps) => {
	return (
		<>
			{" "}
			<textarea
				rows={5}
				value={customInput}
				onChange={(e) => setCustomInput(e.target.value)}
				placeholder={`Custom input`}
				className={`focus:outline-none w-full border-2 border-black z-10 rounded-md  px-4 py-2 hover:shadow transition duration-200 bg-white mt-2`}></textarea>
		</>
	);
};

export default CustomInput;
