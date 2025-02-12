import {FaBluesky} from "react-icons/fa6";
import {IconType} from "react-icons";
import {FaDiscord, FaGithub, FaSteam} from "react-icons/fa";

// **********************************************
// *                Main config                 *
// **********************************************
export const config = {
	siteName: "natroutter.fi",
	baseAddress: "https://NATroutter.fi", 			//IMPORTANT NO TRAILING SLASHES!!!
	copyRight: "Copyright © NATroutter.fi 2025"
};

export function NavLinks(): NavLink[] {
	return [
		{
			name: "Home",
			link: "/"
		},
		{
			name: "About",
			link: "/about"
		},
		{
			name: "Projects",
			link: "/projects"
		},
		{
			name: "Anime",
			link: "/anime"
		},
	]
}

export function FooterSocialLinks(): FooterLink[] {
	return [
		{
			name: "Discord",
			icon: FaDiscord,
			link: "https://discordapp.com/users/162669508866211841"
		},
		{
			name: "Steam",
			icon: FaSteam,
			link: "https://steamcommunity.com/id/batroutter"
		},
		{
			name: "Github",
			icon: FaGithub,
			link: "https://github.com/natroutter"
		},
		{
			name: "BlueSky",
			icon: FaBluesky,
			link: "https://bsky.app/profile/natroutter.fi"
		},
	]
}
export interface NavLink {
	name: string;
	link: string;
}
export interface FooterLink {
	name: string;
	link: string;
	icon: IconType;
}