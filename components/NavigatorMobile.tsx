"use client";

// import { Logo } from "@/components/logo";
import {NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import * as React from "react";
import {useState} from "react";
import {MdOutlineKeyboardArrowLeft} from "react-icons/md";
import {GiHamburgerMenu} from "react-icons/gi";
import {DropdownData, NavigationData, navigatorData} from "@/components/Navigator";


export default function NavigatorMobile({ className }: { className?: string }) {
	const [mobileNavData, setMobileNavData] = useState<NavigationData[]|DropdownData[]>(navigatorData);
	const [mobileNavHistory, setMobileNavHistory] = useState<(NavigationData[]|DropdownData[])[]>([]);

	const handleMobileNavClick = (entry: NavigationData | DropdownData) => {
		if ('dropdown' in entry && entry.dropdown) {
			setMobileNavHistory([...mobileNavHistory, mobileNavData]);
			setMobileNavData(entry.dropdown);
		}
	};

	const handleMobileNavBack = () => {
		if (mobileNavHistory.length > 0) {
			const previousNav = mobileNavHistory[mobileNavHistory.length - 1];
			setMobileNavData(previousNav);
			setMobileNavHistory(mobileNavHistory.slice(0, -1));
		}
	};

	return (
		<div className={cn("flex justify-end md:justify-center relative z-10 overflow-visible", className)}>

			{/* Mobile Navigation */}
			<NavigationMenu className="flex md:hidden ">
				<NavigationMenuList className="gap-0">

					<NavigationMenuItem className="relative">
						<NavigationMenuTrigger hideChevron={true} className="bg-transparent">
							<GiHamburgerMenu size={20}/>
						</NavigationMenuTrigger>
						<NavigationMenuContent
							className="w-screen"
						>
							{mobileNavHistory.length > 0 && (
								<button
									onClick={handleMobileNavBack}
									className="flex items-center gap-1 p-4 pb-0 hover:bg-transparent text-foreground hover:text-muted transition-colors"
								>
									<MdOutlineKeyboardArrowLeft className="" size={20} />
									<span className="font-semibold">Back</span>
								</button>
							)}
							<ul className="grid p-4 grid-cols-1">
								{mobileNavData.map((entry, i)=>
									<li key={i} className="hover:translate-x-2 transition-transform duration-300 ease-in-out select-none drag">
										<NavigationMenuLink
											href={'url' in entry ? entry.url : entry.data.url}
											onClick={e=> {
												if ('dropdown' in entry && entry.dropdown){
													e.preventDefault();
													handleMobileNavClick(entry);
												}
											}}
											className="flex flex-row gap-3 p-3 select-none rounded-md leading-none no-underline outline-hidden"
										>

											<div className="flex">
												{'icon' in entry ? <entry.icon className="flex text-primary" size={24}/> : <entry.data.icon className="flex text-primary" size={24}/>}
											</div>
											<div className="flex flex-col gap-2 justify-between">
												<div className="text-base font-medium leading-none">{'name' in entry ? entry.name : entry.data.name}</div>
												{'description' in entry && <p className="line-clamp-2 text-xs leading-snug text-muted">{entry.description}</p>}
											</div>

										</NavigationMenuLink>
									</li>
								)}
							</ul>
						</NavigationMenuContent>
					</NavigationMenuItem>

				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}