/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		// extends: {
		colors: {
			transparent: "transparent",
			current: "currentColor",
			white: "#fafaff",
			black: "#011627",
			blue: "#2081c3",
			yellow: "#ffee31",
			green: "#e9fffe",
			"green-dark": "#2d6a4f",
			gray: "#f5f6f9",
			red: "#eb9f9f",
			"red-dark": "#e74c3c",
			indigo: "#3b5998",
		},
		fontFamily: {
			sans: ["Poppins", "sans-serif"],
		},
		// },
	},
	plugins: [],
};