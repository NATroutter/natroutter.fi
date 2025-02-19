'use client'

import * as React from "react"
import Link from "next/link";
import {NavLinks} from "@/config/shared";
import {usePathname} from "next/navigation";
import {NavData} from "@/types/interfaces";
import DynamicIcon from "@/utilities/dynamicIcon";


interface NavigatorProps {
	open: boolean; // External state for controlling the menu
	onStateChangeAction: (open: boolean) => void; // Callback to notify state changes
	data: NavData[];
}

export function Navigator({ open, onStateChangeAction, data }: NavigatorProps) {
	const pathname = usePathname()

	if (!data.length) {
		return
	}

	data = data.sort((a,b)=>a.priority-b.priority);

	return (
		<nav className="bg-header md:bg-navbar py-0">
			<button onClick={()=>onStateChangeAction(!open)} className="md:hidden outline-none w-full px-5 py-2 m-0 hover:bg-themeHover border-header border-b-themeHover border-solid border-b-4 bg-theme">
				<div className={`text-white no-underline font-bold hover:cursor-pointer`}>
					<div className="flex m-auto justify-center text-center">
						<p>Navigator</p>
					</div>
				</div>
			</button>
			<ul className={`shadow-nav justify-center m-0 p-0 flex flex-col md:flex-row ${open ? "max-h-[100vh]" : "max-h-0 md:max-h-[100vh]"} transition-[max-height] duration-200 ease-in-out overflow-hidden`}>
				{data.map((item, index) => (
					<li key={index} className={`px-5 py-2 list-none md:hover:bg-header border-header ${index == 0 ? "md:border-l-2 md:border-r" : (index == data.length-1) ? "md:border-r-2 md:border-l" : "md:border-x"} ${pathname===item.link ? "bg-theme" : ""}`}>
						<Link href={item.link} onClick={()=>onStateChangeAction(false)} className={`text-text no-underline font-bold hover:text-white hover:cursor-pointer ${pathname===item.link ? "text-white" : ""}`}>
							<div className="flex m-auto justify-center text-center">
								<DynamicIcon dynamicName={item.icon} className="hidden md:flex m-auto mr-1"/>
								<p>{item.name}</p>
							</div>
						</Link>
					</li>
				))}
			</ul>

		</nav>
	)
}
