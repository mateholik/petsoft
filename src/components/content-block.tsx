import { cn } from "@/lib/utils";
import React from "react";

type ContentBlockProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ContentBlock({
  children,
  className,
}: ContentBlockProps) {
  return (
    <div
      className={cn(
        "shodow-sm h-full w-full overflow-hidden rounded-md bg-[#f7f8fa]",
        className,
      )}
    >
      {children}
    </div>
  );
}
