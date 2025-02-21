import * as faIcons from "react-icons/fa";
import * as fa6Icons from "react-icons/fa6";

import {IconBaseProps, IconType} from "react-icons";

interface IconProps extends IconBaseProps {
	iconName: string;
}

export default function DynamicIcon({ iconName, ...props } : IconProps) {
	if (!iconName) return;

	const getGroup = (groupName: string) => {
		const iconsMap = new Map();
		iconsMap.set("fa", faIcons);
		iconsMap.set("fa6", fa6Icons);
		return iconsMap.get(groupName.toLowerCase());
	};

	const group = iconName.split(" ")[0]
	const ico = iconName.split(" ")[1]

	if (!group || !ico) return;

	const iconGroup = getGroup(group);

	if (!iconGroup) return;

	const Icon : IconType = iconGroup[ico];
	if (!Icon) return;

	return <Icon {...props}/>;
};
