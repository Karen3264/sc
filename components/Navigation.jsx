"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "../context/authContext";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {/* Mobile menu button - only visible on mobile */}
      <div className="fixed top-0 right-0 sm:hidden z-50">
        <button
          onClick={toggleMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span className="sr-only">Open main menu</span>
          {/* Hamburger icon */}
          <svg
            className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          {/* Close icon */}
          <svg
            className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="fixed left-0 top-0 h-screen w-16 bg-white shadow-md hidden sm:block overflow-y-auto scrollbar-hide">
        <div className="flex flex-col h-full">
          {/* Desktop Menu */}
          <div className="flex-1 flex flex-col py-4">
            <Link
              href="/"
              className={`p-2 text-gray-900 hover:text-gray-500 hover:bg-gray-50 flex items-center justify-center relative ${
                pathname === "/" ? "text-white" : ""
              }`}
              title="Home"
            >
              {pathname === "/" && (
                <div className="absolute inset-0 mx-1 my-0.5 bg-red-500 rounded-full"></div>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
            </Link>
            <Link
              href="/drafts"
              className={`p-2 text-gray-900 hover:text-gray-500 hover:bg-gray-50 flex items-center justify-center relative ${
                pathname === "/drafts" ? "text-white" : ""
              }`}
              title="Drafts"
            >
              {pathname === "/drafts" && (
                <div className="absolute inset-0 mx-1 my-0.5 bg-red-500 rounded-full"></div>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </Link>
            <Link
              href="/profile"
              className={`p-2 text-gray-900 hover:text-gray-500 hover:bg-gray-50 flex items-center justify-center relative ${
                pathname === "/profile" ? "text-white" : ""
              }`}
              title="Profile"
            >
              {pathname === "/profile" && (
                <div className="absolute inset-0 mx-1 my-0.5 bg-red-500 rounded-full"></div>
              )}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 relative z-10">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu header */}
      <div className="sm:hidden fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center px-4 h-full">
          <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
        </div>
      </div>

      {/* Mobile menu content */}
      <div className={`${isMenuOpen ? "translate-x-0" : "translate-x-full"} sm:hidden fixed top-16 right-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 overflow-y-auto scrollbar-hide`}>
        <div className="py-3 space-y-1">
          <Link
            href="/"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              pathname === "/" ? "text-red-500 bg-red-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/drafts"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              pathname === "/drafts" ? "text-red-500 bg-red-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Drafts
          </Link>
          <Link
            href="/profile"
            className={`block pl-3 pr-4 py-2 text-base font-medium ${
              pathname === "/profile" ? "text-red-500 bg-red-50" : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            onClick={() => setIsMenuOpen(false)}
          >
            Profile
          </Link>
        </div>
      </div>
    </>
  );
} 