// import "./globals.css";
// import Navbar from "../components/Navbar";

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className="bg-gray-50">
//         <Navbar />
//         <main className="p-6">{children}</main>
//       </body>
//     </html>
//   );
// }


import "./globals.css";
// import Navbar from "../components/Navbar";

export const metadata = {
  title: "Collaborator",
  description: "AI Chat Assistant with Token Tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-indigo-50 via-white to-indigo-100 font-sans">
        {/* <Navbar /> */}
        {/* <main className="px-4 sm:px-6 lg:px-8">{children}</main> */}
        <main>{children}</main>
      </body>
    </html>
  );
}
