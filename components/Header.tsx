'use client'

import Image from "next/image";
import Navigator from "@/components/Navigator";
import * as React from "react";
import NavigatorMobile from "@/components/NavigatorMobile";
import Link from "next/link";

export default function Header() {
	return (
		<header className="w-full select-none fixed z-40">
			<div>
				<div className="bg-header shadow-header flex flex-row justify-between px-2 py-0 h-20">
					<Link className="flex flex-row" href="https://NATroutter.fi">
						<Image
							className="p-2 w-[4.1rem]"
							src="/images/logo.png"
							alt="Logo"
							sizes="100vw"
							width={0}
							height={0}
						/>
						<h1 className="m-auto text-secondary font-bold text-2xl">NATroutter.fi</h1>
					</Link>
					<NavigatorMobile/>
				</div>
				<Navigator/>
			</div>
		</header>
	)
}