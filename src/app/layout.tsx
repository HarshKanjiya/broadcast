import NavBar from "@/components/layouts/NavBar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Catamaran } from "next/font/google";

export const metadata = {
  title: "Broadcast",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

const catamaran = Catamaran({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        " text-slate-900 bg-white antialiased light",
        catamaran.className
      )}
    >
      <body className="min-h-screen antialiased bg-slate-50 pt-12 ">
        <NavBar />
        <div className="container max-w-7xl mx-auto h-full pt-12 ">
          {children}
        </div>
      </body>
    </html>
  );
}
