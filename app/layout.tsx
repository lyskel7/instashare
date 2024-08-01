import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import UserSessionProvider from "./lib/contexts/sessionproviders";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserSessionProvider>
          <div className="flex flex-col justify-center min-h-screen">
            <Navbar />
            <div className="grow flex flex-col justify-center">
              {children}
            </div>
            <Footer />
          </div>
        </UserSessionProvider>
      </body>
    </html>
  );
}
