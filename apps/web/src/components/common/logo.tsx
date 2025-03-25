import { Link } from "@tanstack/react-router";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <Link to="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <span className="text-lg text-zinc-900 dark:text-white font-semibold">
        ShopCore Tasks
      </span>
    </Link>
  );
}
