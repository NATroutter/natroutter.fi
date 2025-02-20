import type {Metadata, Viewport} from "next";
import "@/styles/globals.css";
import "@/styles/markdown.css";

import {Montserrat} from "next/font/google";

import * as React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {getFooterData, getNavigatorData} from "@/lib/database";
import {config} from "@/config/config";
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
        template: config.SITE_NAME + ' // %s',
        default: config.SITE_NAME as string,
    },
    description: description,
    keywords: description,
    authors: [{name: "NATroutter", url: config.BASE_ADDRESS},],
    manifest: "/manifest.json",
    appleWebApp: {
        title: config.SITE_NAME as string,
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
        url: config.BASE_ADDRESS,
        title: config.SITE_NAME,
        description: description,
        images: config.BASE_ADDRESS + "/logo.png",
    },
    twitter: {
        card: "summary_large_image",
        title: config.SITE_NAME,
        siteId: "3684164656",
        creatorId: "3684164656",
        description: description,
        images: config.BASE_ADDRESS + "/logo.png",
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
                    <main className="flex flex-col flex-grow mt-[7.5rem]">
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
            src="https://analytics.nat.gg/script.js"
            data-website-id="c16f0048-21a0-4403-a35b-65785a956e6f"
        />
        </html>
    );
}
