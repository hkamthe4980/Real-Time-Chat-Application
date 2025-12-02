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
// import { NotificationProvider } from "../context/NotificationContext";
// import { SnackbarProvider } from "notistack";
import { Providers } from "./provider";

export const metadata = {
  title: "Collaborator",
  description: "AI Chat Assistant with Token Tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-r from-indigo-50 via-white to-indigo-100 font-sans">
        {/* <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}> */}
        {/*? context provider */}
        {/* <NotificationProvider> */}
        {/* <main>{children}</main> */}
        {/* </NotificationProvider> */}
        {/* </SnackbarProvider> */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
