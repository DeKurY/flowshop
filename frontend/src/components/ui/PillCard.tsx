"use client";

import clsx from "clsx";

interface PillCardProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function PillCard({
  children,
  isActive = false,
  onClick,
  className,
}: PillCardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        "flex-none px-6 py-4 rounded-pill cursor-pointer transition-all duration-200 border",
        isActive
          ? "bg-text-main text-white border-text-main"
          : "bg-surface text-text-main border-transparent hover:border-accent hover:bg-bg",
        className
      )}
    >
      {children}
    </div>
  );
}
