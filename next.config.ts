import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "standalone",
	env: {
		POCKETBASE_ADDRESS: process.env.POCKETBASE_ADDRESS
	},
	images: {
		unoptimized: true
	}
};

export default nextConfig;
