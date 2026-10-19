import type { NextConfig } from "next";

// 静的書き出し。GitHub Pages のようにサブパスで公開するときは NEXT_PUBLIC_BASE_PATH=/リポジトリ名 を付けてビルドする
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
