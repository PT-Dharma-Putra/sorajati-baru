/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,ts,tsx,vue,svelte}"],
	theme: {
		extend: {
			colors: {
				primary: "#173B21", // Deep Forest Green
				secondary: "#C59B27", // Champagne Gold
				"background-light": "#FAF8F5", // Soft Warm Ivory
				"background-dark": "#0E2013", // Deep Spruce/Forest Black
				"accent-tan": "#BC8F5F",
				"accent-gold": "#D4AF37", // Bright Gold Accent
			},
			fontFamily: {
				display: ["Playfair Display", "Arsenal", "serif"],
				sans: ["Inter", "sans-serif"],
				script: ["Great Vibes", "cursive"],
			},
			borderRadius: {
				DEFAULT: "0.5rem",
				xl: "1rem",
				"2xl": "1.5rem",
			},
		},
	},
	plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
	darkMode: "class",
};
