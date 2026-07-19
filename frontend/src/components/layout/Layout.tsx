import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div>

    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
      <Footer />
    </div>
  );
}
