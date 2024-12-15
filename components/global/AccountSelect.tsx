import { cn } from "@/lib/utils/utils";
import { SocialConnectionStatus } from "@prisma/client";
import Image from "next/image";
import React from "react";

interface Props {
  username: string;
  profilePictureUrl: string | null;
  status: string;
}

export default function AccountSelect({
  username,
  profilePictureUrl,
  status,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Image
        src={profilePictureUrl || ""}
        alt="Account"
        className="rounded-full"
        unoptimized
        loading="lazy"
        quality={20}
        width={15}
        height={15}
      />
      <p>@{username}</p>

      <span
        className={cn(
          "text-sm",
          status === SocialConnectionStatus.CONNECTED
            ? "text-green-500"
            : "text-red-500"
        )}
      >
        ●
      </span>
    </div>
  );
}
