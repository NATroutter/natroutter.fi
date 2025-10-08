"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Navigator from "@/components/Navigator";
import NavigatorMobile from "@/components/NavigatorMobile";

export default function Header() {
	const headerRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const updateHeaderHeight = () => {
			if (headerRef.current) {
				const height = headerRef.current.offsetHeight;
				document.documentElement.style.setProperty("--header-height", `${height}px`);
			}
		};

		updateHeaderHeight();
		window.addEventListener("resize", updateHeaderHeight);
		return () => window.removeEventListener("resize", updateHeaderHeight);
	}, []);

	return (
		<header ref={headerRef} className="w-full select-none fixed z-30">
			<div className="bg-header shadow-header flex flex-row justify-between px-2 py-0 h-20 z-20">
				<Link className="flex flex-row" href="https://NATroutter.fi">
					<Image className="p-2 w-[4.1rem]" src="/images/logo.png" alt="Logo" sizes="100vw" width={0} height={0} />
					<h1 className="m-auto text-primary font-bold text-2xl">NATroutter.fi</h1>
				</Link>
				<NavigatorMobile />
			</div>
			<Navigator />
		</header>
	);
}
