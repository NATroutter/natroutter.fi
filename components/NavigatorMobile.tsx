"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { type DropdownData, type NavigationData, navigatorConfig } from "@/components/Navigator";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

export default function NavigatorMobile({ className }: { className?: string }) {
	const [navData, setNavData] = useState<NavigationData[] | DropdownData[]>(navigatorConfig);
	const [navHistory, setNavHistory] = useState<(NavigationData[] | DropdownData[])[]>([]);
	const [open, setOpen] = useState<string>("");
	const navRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent | TouchEvent) => {
			if (navRef.current && !navRef.current.contains(event.target as Node) && open !== "") {
				setOpen("");
				setNavData(navigatorConfig);
				setNavHistory([]);
			}
		};

		const handleScroll = () => {
			if (open !== "") {
				setOpen("");
				setNavData(navigatorConfig);
				setNavHistory([]);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		window.addEventListener("scroll", handleScroll, true);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
			window.removeEventListener("scroll", handleScroll, true);
		};
	}, [open]);

	const handleMobileNavClick = (entry: NavigationData | DropdownData) => {
		if ("dropdown" in entry && entry.dropdown) {
			setNavHistory([...navHistory, navData]);
			setNavData(entry.dropdown);
		}
	};

	const handleMobileNavBack = () => {
		if (navHistory.length > 0) {
			const previousNav = navHistory[navHistory.length - 1];
			setNavData(previousNav);
			setNavHistory(navHistory.slice(0, -1));
		}
	};

	return (
		<div className={cn("flex justify-end md:justify-center relative overflow-visible", className)}>
			{/* Mobile Navigation */}
			<NavigationMenu className="flex md:hidden" value={open} onValueChange={setOpen} ref={navRef}>
				<NavigationMenuList className="gap-0">
					<NavigationMenuItem className="relative">
						<NavigationMenuTrigger hideChevron={true} className="bg-transparent p-0 pr-5">
							<div className="w-5 h-full relative">
								<div className="block w-5 absolute left-1/2 top-1/2   transform  -translate-x-1/2 -translate-y-1/2">
									<span
										className={`block absolute h-0.5 w-5 bg-current transform transition duration-300 ease-in-out ${open !== "" ? "rotate-45" : "-translate-y-1.5"}`}
									></span>
									<span
										className={`block absolute  h-0.5 w-5 bg-current   transform transition duration-300 ease-in-out ${open !== "" ? "opacity-0" : ""}`}
									></span>
									<span
										className={`block absolute  h-0.5 w-5 bg-current transform  transition duration-500 ease-in-out ${open !== "" ? "-rotate-45" : "translate-y-1.5"}`}
									></span>
								</div>
							</div>
						</NavigationMenuTrigger>
						<NavigationMenuContent className="w-screen -z-10">
							{navHistory.length > 0 && (
								<Button
									variant={"ghost"}
									onClick={handleMobileNavBack}
									className="flex items-center gap-1 p-4 pb-0 hover:bg-transparent text-foreground hover:text-muted transition-colors"
								>
									<MdOutlineKeyboardArrowLeft className="" size={20} />
									<span className="font-semibold">Back</span>
								</Button>
							)}
							<ul className="grid p-4 grid-cols-1">
								{navData.map((entry) => {
									const hasDropdown = "dropdown" in entry && entry.dropdown;
									const href = "url" in entry ? entry.url : entry.data.url;
									const name = "name" in entry ? entry.name : entry.data.name;
									const Icon = "icon" in entry ? entry.icon : entry.data.icon;
									const description = "description" in entry ? entry.description : undefined;

									return (
										<li
											key={name}
											className="hover:translate-x-2 transition-transform duration-300 ease-in-out select-none drag"
										>
											<NavigationMenuLink asChild>
												{hasDropdown ? (
													<button
														type="button"
														data-umami-event={`[NAV(mobile)] Open (${name})`}
														onClick={() => handleMobileNavClick(entry)}
														className="flex flex-row gap-3 p-3 select-none rounded-md leading-none no-underline outline-hidden w-full text-left"
													>
														<div className="flex">
															<Icon className="flex text-primary" size={24} />
														</div>
														<div className="flex flex-col gap-2 justify-between">
															<div className="text-base font-medium leading-none">{name}</div>
															{description && (
																<p className="line-clamp-2 text-xs leading-snug text-muted">{description}</p>
															)}
														</div>
													</button>
												) : (
													<Link
														href={href}
														data-umami-event={`[NAV(mobile)] Open (${name})`}
														className="flex flex-row gap-3 p-3 select-none rounded-md leading-none no-underline outline-hidden"
													>
														<div className="flex">
															<Icon className="flex text-primary" size={24} />
														</div>
														<div className="flex flex-col gap-2 justify-between">
															<div className="text-base font-medium leading-none">{name}</div>
															{description && (
																<p className="line-clamp-2 text-xs leading-snug text-muted">{description}</p>
															)}
														</div>
													</Link>
												)}
											</NavigationMenuLink>
										</li>
									);
								})}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>
				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
