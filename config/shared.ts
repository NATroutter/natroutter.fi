import {FaBluesky} from "react-icons/fa6";
import {IconType} from "react-icons";
import {FaDiscord, FaGithub, FaHome, FaLink, FaProjectDiagram, FaSteam, FaTv, FaUser} from "react-icons/fa";

// **********************************************
// *                Main config                 *
// **********************************************
export const config = {
	siteName: "natroutter.fi",
	baseAddress: "https://NATroutter.fi", 			//IMPORTANT NO TRAILING SLASHES!!!
	copyRight: "Copyright © NATroutter.fi " + (new Date().getFullYear())
};

export function NavLinks(): Link[] {
	return [
		{
			name: "Home",
			link: "/",
			icon: FaHome
		},
		{
			name: "About",
			link: "/about",
			icon: FaUser
		},
		{
			name: "Links",
			link: "/links",
			icon: FaLink
		},
		{
			name: "Projects",
			link: "/projects",
			icon: FaProjectDiagram
		},
		{
			name: "Anime",
			link: "/anime",
			icon: FaTv
		},
	]
}

export function FooterSocialLinks(): Link[] {
	return [
		{
			name: "Discord",
			link: "https://discordapp.com/users/162669508866211841",
			icon: FaDiscord
		},
		{
			name: "Steam",
			link: "https://steamcommunity.com/id/batroutter",
			icon: FaSteam
		},
		{
			name: "Github",
			link: "https://github.com/natroutter",
			icon: FaGithub
		},
		{
			name: "Bluesky",
			link: "https://bsky.app/profile/natroutter.fi",
			icon: FaBluesky
		},
	]
}
export interface Link {
	name: string;
	link: string;
	icon: IconType;
}