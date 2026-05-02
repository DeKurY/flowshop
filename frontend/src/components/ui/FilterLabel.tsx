"use client";

import { ReactNode } from "react";

interface FilterLabelProps {
  children: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function FilterLabel({
  children,
  checked,
  onChange,
  className = "",
}: FilterLabelProps) {
  return (
    <label
      className={`flex items-center gap-sm text-[0.9rem] text-text-muted cursor-pointer hover:text-text-main transition-colors ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-auto m-0 accent-accent cursor-pointer"
      />
      {children}
    </label>
  );
}
