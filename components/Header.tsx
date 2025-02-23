'use client'

import Image from "next/image";
import {Navigator} from "@/components/Navigator";
import * as React from "react";
import {useEffect, useState} from "react";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import {NavData} from "@/types/interfaces";

export default function Header({data} : {data: NavData[]}) {
	const [open, setOpen] = useState(false);
	const { width } = useWindowDimensions();

	useEffect(() => {
		const handleScroll = (e: Event): void => {
			if (open) {
				e.preventDefault();
				e.stopPropagation();
			}
		};
		if (open && width < 768) {
			// Add event listeners when sidebar is open
			document.addEventListener('wheel', handleScroll, { passive: false });
			document.addEventListener('touchmove', handleScroll, { passive: false });
			document.body.classList.add('hide-scrollbar-thumb');
		}
		return () => {
			document.removeEventListener('wheel', handleScroll);
			document.removeEventListener('touchmove', handleScroll);
			document.body.classList.remove('hide-scrollbar-thumb');
		};
	}, [open, width]);

	return (
		<header className="fixed top-0 left-0 right-0 z-10 w-full select-none">
			<div className="relative bg-header shadow-header flex flex-row justify-between px-2 py-0 h-20">
				<div className="flex flex-row">
					<a className="flex flex-row" href="https://NATroutter.fi">
						<Image
							className="p-2 w-[4.1rem]"
							src="/images/logo.png"
							alt="Logo"
							sizes="100vw"
							width={0}
							height={0}
						/>
						<h1 className="m-auto text-theme font-bold text-2xl">NATroutter.fi</h1>
					</a>
				</div>
			</div>
			<Navigator data={data} open={open} onStateChangeAction={(s=>setOpen(s))}/>
			<div className={`${open ? "block md:hidden" : "hidden"} relative h-[100vh] inset-0 bg-black bg-opacity-50 z-20`}></div>
		</header>
	)
}