"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Package,
  Users,
  Store,
  Flag,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Overview", icon: LayoutGrid },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Sellers", icon: Store },
  { href: "/admin/reports", label: "Reports", icon: Flag },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-md border border-line bg-paper p-3">
      <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-2">
        Admin
      </p>
      <nav className="space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "#f7f3ec" : "transparent",
                color: active ? "#15110e" : "#7d7266",
              }}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}