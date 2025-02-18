'use client'

import * as React from "react"
import Image from "next/image";
import Link from "next/link";
import {NavLinks} from "@/config/shared";
import {usePathname} from "next/navigation";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {useState} from "react";

export function Navigator() {
	const [open, setOpen] = useState(false);

	const toggleDropdown = () => {
		setOpen((prev) => !prev);
	};


	const pathname = usePathname()

	return (
		<div className="w-full select-none">
			<div className="bg-nav shadow-nav flex flex-row justify-between px-2 py-0 h-20">
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

			<nav className="bg-background py-0">
				<ul className="flex-row shadow-nav justify-center m-0 p-0; hidden md:flex">
					{NavLinks().map((item, index) => (
						<li key={index} className={`px-5 py-2 list-none hover:bg-nav border-nav ${index == 0 ? "border-l-2 border-r" : (index == NavLinks().length-1) ? "border-r-2 border-l" : "border-x"} ${pathname===item.link ? "bg-theme" : ""}`}>
							<Link href={item.link} className={`text-text no-underline font-bold hover:text-white hover:cursor-pointer ${pathname===item.link ? "text-white" : ""}`}>
								<div className="flex m-auto justify-center text-center">
									<item.icon className="m-auto mr-1"/>
									<p>{item.name}</p>
								</div>
							</Link>
						</li>
					))}
				</ul>
				<DropdownMenu open={open} onOpenChange={setOpen}>
					<button onClick={()=>setOpen(!open)} className="md:hidden outline-none w-full px-5 py-2 m-0 hover:bg-themeHover border-nav border-b-themeHover border-solid border-b-4 bg-theme">
						<div className={`text-white no-underline font-bold hover:cursor-pointer`}>
							<div className="flex m-auto justify-center text-center">
								<p>Navigator</p>
							</div>
						</div>
					</button>
					<DropdownMenuContent className='w-screen border-none bg-nav p-0 translate-y-[7.5rem] flex md:hidden flex-col'>
						{NavLinks().map((item, index) => (
							<DropdownMenuItem key={index} className={`group flex justify-center m-0 ${pathname===item.link ? "bg-theme" : ""}`}>
								<Link href={item.link} className={`text-text no-underline text-lg text-center font-bold group-hover:text-white hover:text-white hover:cursor-pointer ${pathname===item.link ? "text-white" : ""}`}>
									<div className="flex m-auto justify-center text-center">
										<p>{item.name}</p>
									</div>
								</Link>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</nav>
		</div>
	)
}
