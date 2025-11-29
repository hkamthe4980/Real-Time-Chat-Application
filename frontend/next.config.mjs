// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path((?!chat/stream).*)',
//         destination: 'http://localhost:5000/api/:path*',
//       },
//     ];
//   },
// };

// export default nextConfig;



/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path((?!chat/stream).*)",
        destination: "http://localhost:5001/api/:path*",
      },
    ];
  },
};
export default nextConfig;
