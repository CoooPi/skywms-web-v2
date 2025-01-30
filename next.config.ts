import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // other config options here

    // This will expose BACKEND_API_URL at build-time.
    // (Note that by default next.config env are not secret – they end up in client side code!)
    env: {
        BACKEND_API_URL: "http://localhost:8080/api/v1",
    },
};

export default nextConfig;