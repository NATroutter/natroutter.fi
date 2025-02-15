'use client'

import * as React from "react"
import Image from "next/image";
import Link from "next/link";
import {NavLinks} from "@/config/shared";
import {usePathname} from "next/navigation";

export function Navigator() {
	const pathname = usePathname()

	return (
		<div className="sticky top-0 left-0 right-0">
			<div className="bg-nav-top shadow-nav flex flex-row justify-between px-2 py-0 h-20">
				<div className="flex flex-row">
					<a className="flex flex-row" href="https://NATroutter.fi">
						<Image
							className="w-full p-2"
							src="/images/head.png"
							alt="Logo"
							sizes="100vw"
							width={0}
							height={0}
						/>
						<h1 className="m-auto text-theme font-bold text-2xl">NATroutter.fi</h1>
					</a>
				</div>
			</div>
			<nav className="bg-nav-bottom shadow-nav py-0;">
				<ul className="flex flex-row justify-center m-0 p-0;">
					{NavLinks().map((item, index) => (
						<li key={index} className={`px-5 py-1.5 list-none ${pathname===item.link ? "bg-theme" : ""}`}>
							<Link href={item.link} className={`text-text no-underline font-bold hover:text-white hover:cursor-pointer ${pathname===item.link ? "text-white" : ""}`}>&lt;/{item.name}&gt;</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	)
}
