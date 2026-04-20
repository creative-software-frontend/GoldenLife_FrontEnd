import React, { useState } from "react";
import Logo from "./Logo";
import AuthButtons from "./AuthButtons";
import { Link } from 'react-router-dom';
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-white bg-opacity-90 backdrop-blur-sm">
      <div className="container mx-auto px-5 md:px-0 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="md:hidden flex-1">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        <div className="hidden md:block">
          <Link to="/">
            <Logo />
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:block">
          <AuthButtons />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-black focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-5 flex justify-center">
            <AuthButtons />
          </div>
        </div>
      )}
    </header>
  );
}
