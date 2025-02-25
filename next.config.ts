import type { NextConfig } from "next";
import {getHostname, getProtocol} from "@/lib/utils";

const nextConfig: NextConfig = {
	output: "standalone",
	env: {
		POCKETBASE_ADDRESS: process.env.POCKETBASE_ADDRESS
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.myanimelist.net',
				port: '',
				pathname: '**',
			},
			{
				protocol: getProtocol(process.env.POCKETBASE_ADDRESS),
				hostname: getHostname(process.env.POCKETBASE_ADDRESS),
				port: '',
				pathname: '**',
			},
		],
	}
};

export default nextConfig;
