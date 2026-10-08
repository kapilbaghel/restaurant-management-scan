import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-[#2D2823] bg-[#171411] text-white"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

        {/* Top Footer */}
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-semibold tracking-tight"
            >
              Restaurant
              <span className="text-[#D5A960]">OS</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-6 text-[#9F978E]">
              A modern restaurant management platform built
              to simplify operations and bring your entire
              restaurant business together.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D5A960] px-5 py-3 text-sm font-semibold text-[#171411] transition hover:bg-[#E2BA76]"
            >
              Login to Dashboard
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Product
            </h3>

            <ul className="mt-5 space-y-3">
              <FooterLink href="#features">
                Features
              </FooterLink>

              <FooterLink href="#how-it-works">
                How It Works
              </FooterLink>

              <FooterLink href="#owners">
                For Owners
              </FooterLink>

              <FooterLink href="#features">
                For Managers
              </FooterLink>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              <FooterLink href="/login">
                Admin Login
              </FooterLink>

              <FooterLink href="/login">
                Owner Login
              </FooterLink>

              <FooterLink href="#features">
                QR Ordering
              </FooterLink>

              <FooterLink href="#features">
                Order Management
              </FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">
              Contact
            </h3>

            <div className="mt-5 space-y-4">

              <div className="flex items-start gap-3">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-[#D5A960]"
                />

                <span className="text-sm text-[#9F978E]">
                  support@restaurantos.com
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#D5A960]"
                />

                <span className="text-sm leading-6 text-[#9F978E]">
                  Gurugram, Haryana
                  <br />
                  India
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-4 border-t border-[#2D2823] pt-7 text-xs text-[#817970] sm:flex-row sm:items-center sm:justify-between">

          <p>
            © {new Date().getFullYear()} RestaurantOS. All
            rights reserved.
          </p>

          <div className="flex gap-6">
            <a
              href="#"
              className="transition hover:text-white"
            >
              Privacy Policy
            </a>

            <a
              href="#"
              className="transition hover:text-white"
            >
              Terms of Service
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}


/* Footer Link */

function FooterLink({ href, children }) {
  return (
    <li>
      <a
        href={href}
        className="text-sm text-[#9F978E] transition hover:text-white"
      >
        {children}
      </a>
    </li>
  );
}