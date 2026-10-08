import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTASection() {
  return (
    <section className="bg-[#171411] px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">

        {/* Small Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#5A5148] bg-[#211D19] px-4 py-2 text-xs font-medium text-[#E6C98F]">
          <Sparkles size={14} />
          Built for modern restaurants
        </div>

        {/* Heading */}
        <h2 className="mt-7 text-3xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          Ready to Simplify
          <span className="block text-[#D5A960]">
            Your Restaurant?
          </span>
        </h2>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[#B9B1A8] md:text-lg">
          Manage restaurants, managers, menus, tables and
          orders from one powerful platform designed for
          modern restaurant businesses.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-[#D5A960] px-7 py-3.5 text-sm font-semibold text-[#171411] transition hover:bg-[#E2BA76]"
          >
            Login to Dashboard
            <ArrowRight size={17} />
          </Link>

          <a
            href="#features"
            className="inline-flex items-center rounded-full border border-[#5A5148] px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-[#2A2520]"
          >
            Explore Features
          </a>

        </div>

        {/* Bottom Text */}
        <p className="mt-7 text-xs text-[#817970]">
          One platform. Multiple restaurants. Complete control.
        </p>

      </div>
    </section>
  );
}