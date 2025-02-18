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
			background: '#31383f',
			nav: '#1e2226',
			card: '#20252a',
			card2: '#272d33',
  			text: '#abadae',
			textHover: '#ffffff',
  			theme: '#bb2e3a',
			themeHover: '#a12832',


  			foreground: 'hsl(0 0% 98%)',
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
  			nav: 'rgba(13, 16, 19, 0.7) 0px 3px 10px'
  		},
  		fontFamily: {
  			montserrat: [
  				'Montserrat"',
  				'Helvetica',
  				'Arial',
  				'sans-serif'
  			],
			AGRevueCyr: [
				'AGRevueCyr',
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