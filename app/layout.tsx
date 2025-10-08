import type { Metadata, Viewport } from "next";
import "@/styles/markdown.css"; //TODO Fix enabling this breaks the tailwind auto complete system
import "@/styles/globals.css";

import getConfig from "next/config";
import { Montserrat } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ServerError from "@/components/ServerError";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getFooterData } from "@/lib/database";
import {config} from "@/lib/config";

const { serverRuntimeConfig } = getConfig();

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
			<Script async src={config.UMAMI.SCRIPT} data-website-id={config.UMAMI.TOKEN} />
		</html>
	);
}
