'use client'

import * as React from "react"
import Link from "next/link";
import {usePathname} from "next/navigation";
import {NavData} from "@/types/interfaces";
import DynamicIcon from "@/lib/dynamicIcon";


interface NavigatorProps {
	open: boolean;
	onStateChangeAction: (open: boolean) => void;
	data: NavData[];
}

export function Navigator({ open, onStateChangeAction, data }: NavigatorProps) {
	const pathname = usePathname()

	if (!data.length) {
		return
	}

	return (
		<nav className="bg-header md:bg-navbar py-0">
			<button onClick={()=>onStateChangeAction(!open)} className="md:hidden outline-hidden w-full px-5 py-2 m-0 hover:bg-theme-hover border-header border-b-theme-hover border-solid border-b-4 bg-theme">
				<div className={`text-white no-underline font-bold hover:cursor-pointer`}>
					<div className="flex m-auto justify-center text-center">
						<p>Navigator</p>
					</div>
				</div>
			</button>
			<ul className={`
			shadow-nav justify-center m-0 p-0 flex flex-col md:flex-row
			${open ? "max-h-screen" : "max-h-0 md:max-h-screen"}
			transition-[max-height] duration-200 ease-in-out overflow-hidden
			`}>
				{data.map((item, index) => (
					<li key={index} className={
						`list-none md:hover:bg-header border-header
						md:border-x
						md:first:border-l-2 md:first:border-r
						md:last:border-r-2 md:last:border-l
						${pathname===item.url ? "bg-theme" : ""}`
					}>
						<Link href={item.url} className="flex px-5 py-2 justify-center" data-umami-event={`[NAV] Open (${item.name})`}>
							<div onClick={()=>onStateChangeAction(false)} className={`text-text no-underline font-bold hover:text-white hover:cursor-pointer ${pathname===item.url ? "text-white" : ""}`}>
								<div className="flex m-auto justify-center text-center">
									<DynamicIcon iconName={item.icon} className="hidden md:flex m-auto mr-1"/>
									<p>{item.name}</p>
								</div>
							</div>
						</Link>
					</li>
				))}
			</ul>

		</nav>
	)
}
