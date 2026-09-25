import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	allowedDevOrigins: ['172.*.*.*']
};

export default nextConfig;
