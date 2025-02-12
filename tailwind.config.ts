import type { Config } from "tailwindcss";

import animate from "tailwindcss-animate";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
			background: 'rgb(47, 51, 53)',
  			'nav-top': 'rgb(30,35,39)',
  			'nav-bottom': 'rgb(39,43,44)',
  			text: 'rgb(207, 199, 189)',
  			theme: 'rgb(120, 0, 0)',


  			foreground: 'hsl(0 0% 98%)',
  			card: {
  				DEFAULT: 'hsl(0 0% 3.9%)',
  				foreground: 'hsl(0 0% 98%)'
  			},
  			popover: {
  				DEFAULT: 'hsl(0 0% 3.9%)',
  				foreground: 'hsl(0 0% 98%)'
  			},
  			primary: {
  				DEFAULT: 'hsl(0 0% 98%)',
  				foreground: 'hsl(0 0% 9%)'
  			},
  			secondary: {
  				DEFAULT: 'hsl(0 0% 14.9%)',
  				foreground: 'hsl(0 0% 98%)'
  			},
  			muted: {
  				DEFAULT: 'hsl(0 0% 14.9%)',
  				foreground: 'hsl(0 0% 63.9%)'
  			},
  			accent: {
  				DEFAULT: 'hsl(0 0% 14.9%)',
  				foreground: 'hsl(0 0% 98%)'
  			},
  			destructive: {
  				DEFAULT: 'hsl(0 62.8% 30.6%)',
  				foreground: 'hsl(0 0% 98%)'
  			},
  			border: 'hsl(0 0% 14.9%)',
  			input: 'hsl(0 0% 14.9%)',
  			ring: 'hsl(0 0% 83.1%)',
  			chart: {
  				'1': 'hsl(220 70% 50%)',
  				'2': 'hsl(160 60% 45%)',
  				'3': 'hsl(30 80% 55%)',
  				'4': 'hsl(280 65% 60%)',
  				'5': 'hsl(340 75% 55%)'
  			}
  		},
  		boxShadow: {
  			nav: 'rgb(15 18 22 / 30%) 0px 0px 5px;'
  		},
  		fontFamily: {
  			montserrat: [
  				'Montserrat"',
  				'Helvetica',
  				'Arial',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
	plugins: [animate],
} satisfies Config;