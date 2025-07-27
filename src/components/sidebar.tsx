"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { Home, Package, ShoppingCart, BarChart2, CreditCard, Settings, HelpCircle } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    label: "Store Management",
    href: "/products",
    icon: Package,
  },
  {
    label: "Order Management",
    href: "/orders",
    icon: ShoppingCart,
  },
  {
    label: "Analytics",
    href: "/analytics",
    icon: BarChart2,
  },
  {
    label: "Payment History",
    href: "/payments",
    icon: CreditCard,
  },
  {
    label: "Setting",
    href: "/settings",
    icon: Settings,
  },
  {
    label: "Help & Centre",
    href: "/help",
    icon: HelpCircle,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block h-full w-56 overflow-y-auto border-r bg-background py-6 px-4">
      <div className="mb-8 text-xl font-bold">Quarbona</div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                isActive && "bg-muted font-medium",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme toggle at bottom */}
      <div className="mt-8 border-t pt-4">
        <ModeToggle />
      </div>
    </aside>
  );
} 