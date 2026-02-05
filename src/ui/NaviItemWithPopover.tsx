"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/lib/utils";

interface NaviItemWithPopoverProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function NaviItemWithPopover(props: NaviItemWithPopoverProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={props.className}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Link
            href={props.href}
            className={cn(
              "flex p-3 items-center justify-center rounded-md transition-colors hover:bg-green-100 hover:text-primary"
            )}
          >
            {props.icon}
          </Link>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={8}
          align="center"
          className="w-auto px-3 py-2 text-xs font-medium text-gray-800"
        >
          {props.label}
        </PopoverContent>
      </Popover>
    </div>
  );
}
