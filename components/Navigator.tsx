// import { Logo } from "@/components/logo";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import * as React from "react";
import {IconType} from "react-icons";
import {FaHome, FaLink, FaProjectDiagram, FaTv, FaUser} from "react-icons/fa";
import {FooterData} from "@/types/interfaces";
import {ReactNode} from "react";


export interface DropdownData {
	name: string;
	description: string;
	url: string;
	icon: IconType;
}

export interface LinkData {
	name: string;
	url: string;
	icon: IconType;
	quick: boolean;
	dropdown?: DropdownData[];
}

export const navigatorLinks : LinkData[] = [
	{
		name: "Home",
		url: "/",
		icon: FaHome,
		quick: false
	},
	{
		name: "About",
		url: "/about",
		icon: FaUser,
		quick: true
	},
	{
		name: "Links",
		url: "/links",
		icon: FaLink,
		quick: true
	},
	{
		name: "Projects",
		url: "/projects",
		icon: FaProjectDiagram,
		quick: true
	},
	{
		name: "Anime",
		url: "/anime",
		icon: FaTv,
		quick: true,
		dropdown: [
			{
				name: "Anime Statistics",
				description: "Anime List desc",
				url: "/anime",
				icon: FaTv
			},
			{
				name: "Anime List",
				description: "Anime List desc",
				url: "/anime/list",
				icon: FaTv
			},
			{
				name: "Favourites",
				description: "Favourites desc",
				url: "/anime/favourites",
				icon: FaTv
			}
		]
	}
]

function NavText({data, children}: {data:LinkData, children?: ReactNode}) {
	return (
		<div className="flex flex-row gap-2 justify-center">
			<data.icon className="my-auto"/>
			<span className="font-semibold">{children}</span>
		</div>
	);
}

export default function Navigator() {
	return (
		<div className="flex justify-center bg-background shadow-nav">
			<NavigationMenu>
				<NavigationMenuList className="gap-0">

					{navigatorLinks.map((item,index)=>item.dropdown ? (
						<NavigationMenuItem key={index} className="border-r-2 border-header first:border-l-2">
							<NavigationMenuTrigger onClick={(e)=>e.preventDefault()}>
								<NavText data={item}>{item.name}</NavText>
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid gap-3 p-1 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
									{item.dropdown!.map((entry,i)=>
										<ListItem key={i} href={entry.url} title={entry.name}>
											{entry.description}
										</ListItem>
									)}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
					) : (
						<NavigationMenuItem key={index} className="border-r-2 border-header first:border-l-2">
							<Link href={item.url}>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									<NavText data={item}>{item.name}</NavText>
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					))}

				</NavigationMenuList>
			</NavigationMenu>
		</div>
	);
}
const ListItem = React.forwardRef<
	React.ElementRef<"a">,
	React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<a
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-secondary hover:text-foreground focus:bg-secondary focus:text-foreground",
						className
					)}
					{...props}
				>
					<div className="text-sm font-medium leading-none">{title}</div>
					<p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
						{children}
					</p>
				</a>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";