import type {Metadata, Viewport} from "next";
import "@/styles/globals.css";
import "@/styles/markdown.css";

import {Montserrat} from "next/font/google";

import * as React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {getFooterData, getNavigatorData} from "@/lib/database";
import Script from 'next/script'
import ServerError from "@/components/errors/ServerError";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
    style: ["normal", "italic"],
    display: "swap",
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

const description = "Welcome to NATroutter.fi, a personal website showcasing my work as a fullstack developer, my passion for technology, and my creative projects. Explore my skills, connect with me, and learn more about what I do.";

export const metadata: Metadata = {
    title: {
        template: 'NATroutter.fi // %s',
        default: "NATroutter.fi",
    },
    description: description,
    keywords: description,
    authors: [{name: "NATroutter", url: "https://NATroutter.fi"},],
    manifest: "/manifest.json",
    appleWebApp: {
        title: "NATroutter.fi",
        statusBarStyle: 'black-translucent',
        startupImage: [
            '/images/favicon/apple-touch-icon.png',
            {
                url: '/images/favicon/apple-touch-icon.png',
                media: '(device-width: 768px) and (device-height: 1024px)',
            },
        ],
    },
    icons: {
        apple: [{url: "/images/favicon/apple-touch-icon.png", sizes: "180x180"}],
        icon: [
            {url: "/images/favicon/favicon-96x96.png", sizes: "96x96", type: "image/png"},
            {url: "/images/favicon/favicon.svg", type: "image/svg+xml"}
        ],
        shortcut: [{url: "/images/favicon/favicon.ico"}],
    },
    other: {
        'msapplication-TileColor': '#615f5f',
        'msapplication-config': '/manifest.json',
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
    }
}

export const viewport: Viewport = {
    themeColor: '#bb2e3a',
}

export default async function RootLayout({children}: Readonly<{ children: React.ReactNode; }>) {
    const NavData = await getNavigatorData();
    const footerData = await getFooterData();

    return (
        <html lang="en">
        <body className={`${montserrat.variable} ${montserrat.className} bg-background bg-cover text-text font-normal flex flex-col min-h-screen m-0 p-0 overflow-y-auto`}>

            {(NavData && (NavData.length > 0) && footerData) ? (
                <>
                    <Header data={NavData}/>
                    <main className="relative flex flex-col flex-grow min-h-screen pb-[7.5rem]">
                        {/*mt-[7.5rem]*/}
                        {children}
                    </main>
                    <Footer data={footerData}/>
                </>
            ) : (
                <main className="flex flex-col flex-grow justify-center m-auto text-center">
                    <ServerError/>
                </main>
            )}

        </body>
        <Script
            async
            src={process.env.UMAMI_SCRIPT}
            data-website-id={process.env.UMAMI_TOKEN}
        />
        </html>
    );
}
