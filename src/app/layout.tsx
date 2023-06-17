import Providers from "@/components/context/Providers";
import NavBar from "@/components/layouts/NavBar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Broadcast",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        " text-slate-900 bg-white antialiased light",
        inter.className
      )}
    >
      <Providers>
        <body className="min-h-screen antialiased bg-slate-50 pt-12 ">
          <Toaster
            toastOptions={{
              duration: 2000,
            }}
          />
          {/* @ts-expect-error server component */}
          <NavBar />
          {authModal}
          <div className="container max-w-7xl mx-auto h-full pt-12 ">
            {children}
          </div>
        </body>
      </Providers>
    </html>
  );
}
