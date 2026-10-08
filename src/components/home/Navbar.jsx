"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E7E0D6]/80 bg-[#F7F4EE]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-tight"
        >
          Restaurant
          <span className="text-[#C99A52]">OS</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">

          <a
            href="#features"
            className="text-sm text-[#625C55] transition hover:text-[#171411]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-[#625C55] transition hover:text-[#171411]"
          >
            How It Works
          </a>

          <a
            href="#owners"
            className="text-sm text-[#625C55] transition hover:text-[#171411]"
          >
            For Owners
          </a>

          <a
            href="#features"
            className="text-sm text-[#625C55] transition hover:text-[#171411]"
          >
            For Managers
          </a>

          <a
            href="#footer"
            className="text-sm text-[#625C55] transition hover:text-[#171411]"
          >
            Contact
          </a>

        </nav>

        {/* Login Button */}
        <Link
          href="/login"
          className="hidden items-center gap-2 rounded-full bg-[#D5A960] px-5 py-3 text-sm font-semibold text-[#171411] shadow-sm transition hover:bg-[#C99A52] md:flex"
        >
          Login to Dashboard
          <ArrowRight size={16} />
        </Link>

      </div>
    </header>
  );
}