import React from "react";
import Link from "next/link";
import { hackerMedium } from "@/fonts/font";
export const Footer = () => {
  const footerLinks = [
    { text: "Terms of Service", href: "/terms" },
    { text: "Privacy Policy", href: "/privacy" },
    { text: "Cookie Policy", href: "/cookies" },
    { text: "Accessibility", href: "/accessibility" },
    { text: "Ads info", href: "/ads" },
    { text: "Support", href: "/support" },
    { text: "More...", href: "#" },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="px-6 py-3 text-xs" style={hackerMedium.style}>
      <nav className="flex flex-wrap justify-center items-center justify-items-center gap-2 text-text_secondary">
        {footerLinks.map((link, index) => (
          <React.Fragment key={link.text}>
            <Link href={link.href} className="hover:underline">
              {link.text}
            </Link>
            {index < footerLinks.length - 1 && <span>·</span>}
          </React.Fragment>
        ))}
      </nav>
      <div className="flex w-full justify-center items-center">
        <p className="mt-2 text-[#70777B]">© {currentYear} Kampus</p>
      </div>
    </footer>
  );
};
