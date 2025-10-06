import type { Metadata, Viewport } from "next";
import "@/styles/markdown.css"; //TODO Fix enabling this breaks the tailwind auto complete system
import "@/styles/globals.css";

import { Montserrat } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServerError from "@/components/ServerError";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getFooterData } from "@/lib/database";

const montserrat = Montserrat({
	variable: "--font-montserrat",
	subsets: ["latin"],
	style: ["normal", "italic"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const description =
	"Welcome to NATroutter.fi, a personal website showcasing my work as a fullstack developer, my passion for technology, and my creative projects. Explore my skills, connect with me, and learn more about what I do.";

export const metadata: Metadata = {
	title: {
		template: "NATroutter.fi // %s",
		default: "NATroutter.fi",
	},
	description: description,
	keywords: description,
	authors: [{ name: "NATroutter", url: "https://NATroutter.fi" }],
	manifest: "/manifest.json",
	appleWebApp: {
		title: "NATroutter.fi",
		statusBarStyle: "black-translucent",
		startupImage: [
			"/images/favicon/apple-touch-icon.png",
			{
				url: "/images/favicon/apple-touch-icon.png",
				media: "(device-width: 768px) and (device-height: 1024px)",
			},
		],
	},
	icons: {
		apple: [{ url: "/images/favicon/apple-touch-icon.png", sizes: "180x180" }],
		icon: [
			{
				url: "/images/favicon/favicon-96x96.png",
				sizes: "96x96",
				type: "image/png",
			},
			{ url: "/images/favicon/favicon.svg", type: "image/svg+xml" },
		],
		shortcut: [{ url: "/images/favicon/favicon.ico" }],
	},
	other: {
		"msapplication-TileColor": "#615f5f",
		"msapplication-config": "/manifest.json",
	},
	openGraph: {
		type: "website",
		url: "https://natroutter.fi",
		title: "NATroutter.fi",
		description: description,
		images: "https://NATroutter.fi/logo.png",
	},
	twitter: {
		card: "summary_large_image",
		title: "NATroutter.fi",
		siteId: "3684164656",
		creatorId: "3684164656",
		description: description,
		images: "https://NATroutter.fi/logo.png",
	},
};

export const viewport: Viewport = {
	themeColor: "#bb2e3a",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
	const footerData = await getFooterData();

	return (
		<html lang="en">
			<body
				className={`${montserrat.variable} ${montserrat.className} bg-background bg-cover text-foreground font-normal flex flex-col h-screen m-0 p-0 overflow-hidden overscroll-y-none`}
			>
				{/*/!* Debug Breakpoint Indicator *!/*/}
				{/*<div className="fixed bottom-4 right-4 bg-card border border-card-border rounded-lg p-3 text-xs font-mono z-50 shadow-lg">*/}
				{/*	<div className="font-bold mb-2 text-primary">Active Breakpoint:</div>*/}
				{/*	<div className="space-y-1">*/}
				{/*		<div className="block xxxs:hidden text-red-500">• &lt; xxxs (240px)</div>*/}
				{/*		<div className="hidden xxxs:block xxs:hidden text-orange-500">• xxxs (240px+)</div>*/}
				{/*		<div className="hidden xxs:block xs:hidden text-yellow-500">• xxs (320px+)</div>*/}
				{/*		<div className="hidden xs:block sm:hidden text-lime-500">• xs (448px+)</div>*/}
				{/*		<div className="hidden sm:block md:hidden text-green-500">• sm (640px+)</div>*/}
				{/*		<div className="hidden md:block lg:hidden text-cyan-500">• md (768px+)</div>*/}
				{/*		<div className="hidden lg:block 2lg:hidden text-blue-500">• lg (1024px+)</div>*/}
				{/*		<div className="hidden 2lg:block xxl:hidden text-indigo-500">• 2lg (1152px+)</div>*/}
				{/*		<div className="hidden xxl:block 2xl:hidden text-purple-500">• xxl (1472px+)</div>*/}
				{/*		<div className="hidden 2xl:block 2xxl:hidden text-pink-500">• 2xl (1536px+)</div>*/}
				{/*		<div className="hidden 2xxl:block 3xl:hidden text-rose-500">• 2xxl (1840px+)</div>*/}
				{/*		<div className="hidden 3xl:block 4xl:hidden text-violet-500">• 3xl (2000px+)</div>*/}
				{/*		<div className="hidden 4xl:block 5xl:hidden text-fuchsia-500">• 4xl (2400px+)</div>*/}
				{/*		<div className="hidden 5xl:block 6xl:hidden text-amber-500">• 5xl (2800px+)</div>*/}
				{/*		<div className="hidden 6xl:block 7xl:hidden text-emerald-500">• 6xl (3840px+)</div>*/}
				{/*		<div className="hidden 7xl:block text-teal-500">• 7xl (5120px+)</div>*/}
				{/*	</div>*/}
				{/*</div>*/}

				<TooltipProvider>
					{footerData ? (
						<>
							<Header />
							<main
								className="relative overflow-y-auto mt-header"
								style={{ height: "calc(100vh - var(--header-height))" }}
							>
								<div className="flex flex-col min-h-full">
									<div className="flex-1">{children}</div>
									<Footer data={footerData} />
								</div>
							</main>
							<Toaster />
						</>
					) : (
						<main className="flex flex-col grow justify-center m-auto text-center">
							<ServerError type="content" location="footer" />
							<Toaster />
						</main>
					)}
				</TooltipProvider>
			</body>
			<Script async src={process.env.UMAMI_SCRIPT} data-website-id={process.env.UMAMI_TOKEN} />
		</html>
	);
}
