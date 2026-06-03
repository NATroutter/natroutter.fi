import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		unoptimized: true,
	},
	allowedDevOrigins: ['172.29.53.70']
};

export default nextConfig;
