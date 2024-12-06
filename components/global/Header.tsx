import React from "react";
import Link from "next/link";
import { ModeToggle } from "../ui/mode-toggle";
import { Button } from "../ui/button";
import { signOut } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { Instagram } from "lucide-react";

const Header: React.FC = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <header className=" px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-center justify-center" href="/">
        <Instagram className="h-6 w-6 mr-2" />
        <span className="font-bold">InstaAutomate</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#features">
          Features
        </Link>
        <Link
          className="text-sm font-medium hover:underline underline-offset-4"
          href="/#how-it-works"
        >
          How It Works
        </Link>
        <Link className="text-sm font-medium hover:underline underline-offset-4" href="/#pricing">
          Pricing
        </Link>
        {user ? (
          <Button
            className="bg-primary text-white hover:text-gray-600"
            onClick={async () => {
              "use server";
              await signOut();
            }}
          >
            Sign Out
          </Button>
        ) : (
          <Link href="/sign-up" aria-label="Sign Up">
            <Button className="bg-primary text-white hover:text-gray-300">Get Started</Button>
          </Link>
        )}
        <ModeToggle />
      </nav>
    </header>
  );
};

export default Header;
