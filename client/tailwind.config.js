/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
module.exports = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				primary: "#dbeafe",
				secondary: "#767FFE",
				accent: "#5b21b6",
				neutral: "#311c04",
				basecolor: "#1f2937",
				info: "#00c4f2",
				success: "#00a35c",
				warning: "#ff8d00",
				error: "#fc002d",
				editorbg: "#24292e",
			},
		},
	},

	plugins: [daisyui],
};
// export default {
// 	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
// 	daisyui: {
// 		themes: [
// 			{
// 				mytheme: {
// 					primary: "#0034ff",

// 					secondary: "#0067ff",

// 					accent: "#5b21b6",

// 					neutral: "#311c04",

// 					"base-100": "#1f2937",

// 					info: "#00c4f2",

// 					success: "#00a35c",

// 					warning: "#ff8d00",

// 					error: "#fc002d",
// 				},
// 			},
// 		],
// 	},
// 	plugins: [daisyui],
// 	//...
// };
