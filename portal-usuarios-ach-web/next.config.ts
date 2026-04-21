import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repository = process.env.GITHUB_REPOSITORY ?? "";
const repoName = repository.split("/")[1] ?? "";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: isGitHubActions && repoName ? `/${repoName}` : "",
  assetPrefix: isGitHubActions && repoName ? `/${repoName}/` : undefined,
};

export default nextConfig;
