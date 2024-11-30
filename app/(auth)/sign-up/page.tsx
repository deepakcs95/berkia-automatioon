import { signIn } from "@/lib/auth";
import React from "react";

export default function page() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">Login</h1>
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button type="submit">Sign up with GitHub</button>
        </form>
      </div>
    </div>
  );
}
