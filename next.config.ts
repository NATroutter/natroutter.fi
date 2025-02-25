import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	env: {
		POCKETBASE_ADDRESS: process.env.POCKETBASE_ADDRESS
	},
	output: "standalone",
	images: {
		unoptimized: true
	}
};

export default nextConfig;
