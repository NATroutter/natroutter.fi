import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'cdn.myanimelist.net',
				port: '',
				pathname: '**',
			},
			{
				protocol: 'https',
				hostname: 'api.natroutter.fi',
				port: '',
				pathname: '**',
			},
		],
	}
};

export default nextConfig;
