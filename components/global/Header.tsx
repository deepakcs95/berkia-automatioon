import React from "react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { User } from "next-auth";
import Image from "next/image";
import { Button } from "../ui/button";
import { signOut } from "@/lib/auth";

const Header: React.FC<{ user: User }> = ({ user }) => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="text-2xl font-bold text-gray-800">
          <Link href="/" className="hover:text-gray-600" aria-label="Home">
            MyWebsite
          </Link>
        </div>
        <nav className="space-x-4">
          <ModeToggle />
          <Link href="/about" className="text-gray-800 hover:text-gray-600" aria-label="About">
            About
          </Link>
          <Link
            href="/services"
            className="text-gray-800 hover:text-gray-600"
            aria-label="Services"
          >
            Services
          </Link>
          <Link href="/contact" className="text-gray-800 hover:text-gray-600" aria-label="Contact">
            Contact
          </Link>
          {user ? (
            <Button
              variant="outline"
              onClick={async () => {
                "use server";
                await signOut();
              }}
            >
              Sign Out
            </Button>
          ) : (
            <Link
              href="/sign-up"
              className="text-gray-800 hover:text-gray-600"
              aria-label="Sign Up"
            >
              Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
