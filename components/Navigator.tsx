"use client";

// import { Logo } from "@/components/logo";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle,} from "@/components/ui/navigation-menu";
import * as React from "react";
import {ReactNode, useEffect, useRef, useState} from "react";
import {IconType} from "react-icons";
import {FaHome, FaLink, FaProjectDiagram, FaUser} from "react-icons/fa";
import {IoIosListBox, IoMdAnalytics} from "react-icons/io";
import {MdFavorite} from "react-icons/md";
import {PiVideoFill} from "react-icons/pi";


export interface LinkData {
	name: string;
	url: string;
	icon: IconType;
}

export interface DropdownData extends LinkData{
	description: string;
}

export interface NavigationData {
	data: LinkData;
	quick: boolean;
	dropdown?: DropdownData[];
}

export const navigatorData : NavigationData[] = [
	{
		data: {
			name: "Home",
			url: "/",
			icon: FaHome,
		},
		quick: false
	},
	{
		data: {
			name: "About",
			url: "/about",
			icon: FaUser,
		},
		quick: true
	},
	{
		data: {
			name: "Links",
			url: "/links",
			icon: FaLink,
		},
		quick: true
	},
	{
		data: {
			name: "Projects",
			url: "/projects",
			icon: FaProjectDiagram,
		},
		quick: true
	},
	{
		data: {
			name: "Anime",
			url: "/anime",
			icon: PiVideoFill,
		},
		quick: true,
		dropdown: [
			{
				name: "Statistics",
				description: "View detailed insights into my anime watching habits and history",
				url: "/anime",
				icon: IoMdAnalytics
			},
			{
				name: "List",
				description: "Everything I've watched, what I'm watching now, and my watchlist",
				url: "/anime/list",
				icon: IoIosListBox
			},
			{
				name: "Favourites",
				description: "My favorite anime series, movies, and characters",
				url: "/anime/favourites",
				icon: MdFavorite
			}
		]
	}
]

function NavText({entity, children}: {entity:NavigationData, children?: ReactNode}) {
	return (
		<div className="flex flex-row gap-2 justify-center">
			<entity.data.icon className="my-auto" size={20}/>
			<span className="font-semibold">{children}</span>
		</div>
	);
}

export default function Navigator() {
	const [open, setOpen] = useState<string>('');
	const navRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (navRef.current && !navRef.current.contains(event.target as Node) && open !== '') {
				setOpen('');
			}
		};

		const handleScroll = () => {
			if (open !== '') {
				setOpen('');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('touchstart', handleClickOutside);
		window.addEventListener('scroll', handleScroll, true);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('touchstart', handleClickOutside);
			window.removeEventListener('scroll', handleScroll, true);
		};
	}, [open]);

	return (
		<div className={"flex justify-end md:justify-center bg-background shadow-nav relative"}>

			{/* Desktop Navigation */}
			<NavigationMenu
				className="hidden md:flex"
				value={open}
				onValueChange={setOpen}
				ref={navRef}
			>
				<NavigationMenuList className="gap-0">
					{navigatorData.map((item)=>item.dropdown ? (
						<NavigationMenuItem key={item.data.name} className="relative border-r-2 border-header first:border-l-2">
							<NavigationMenuTrigger className="z-20">
								<NavText entity={item}>{item.data.name}</NavText>
							</NavigationMenuTrigger>
							<NavigationMenuContent className="-z-10">
								<ul className="grid p-4 grid-cols-1">
									{item.dropdown!.map((entry,i)=>
										<li key={i} className="hover:translate-x-2 transition-transform duration-300 ease-in-out">
											<NavigationMenuLink href={entry.url}>
												<div className="flex flex-row gap-3 p-3 select-none rounded-md leading-none no-underline outline-hidden transition-colors hover:bg-popover-focus/60 focus:bg-popover-focus/60">
													<div className="flex">
														<entry.icon className="flex text-primary" size={24}/>
													</div>
													<div className="flex flex-col gap-2 justify-between">
														<div className="text-base font-medium leading-none">{entry.name}</div>
														<p className="line-clamp-2 text-xs leading-snug text-muted">
															{entry.description}
														</p>
													</div>
												</div>
											</NavigationMenuLink>
										</li>
									)}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : (
						<NavigationMenuItem key={item.data.name} className="border-r-2 border-header first:border-l-2 z-40">
							<NavigationMenuLink href={item.data.url} className={navigationMenuTriggerStyle({useHover: true})}>
								<NavText entity={item}>{item.data.name}</NavText>
							</NavigationMenuLink>
						</NavigationMenuItem>
					))}
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}