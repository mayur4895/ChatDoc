import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
 
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Providers from "@/components/provider";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/Navbar";
const font = Poppins({ weight:['200','400','700','900'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatWithPdf",
  description: "Developed by Mayur",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <Providers> 
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>ChatWithPdf</title>
      </head>
      <body className={font.className}>
      <Navbar/>
 <div className=" mt-20">
 {children}
 </div>
        <Toaster />
      </body>
    </html>
    </Providers>
    </ClerkProvider>
  );
}
