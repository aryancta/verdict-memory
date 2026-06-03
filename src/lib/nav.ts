import {
  LayoutDashboard,
  MessageSquareWarning,
  PlaySquare,
  Search,
  Settings,
  CalendarClock,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Decision memory",
    icon: LayoutDashboard,
    description: "Every logged decision with provenance",
  },
  {
    href: "/simulator",
    label: "Live channel",
    icon: PlaySquare,
    description: "Watch the agent catch a contradiction",
  },
  {
    href: "/ask",
    label: "Ask memory",
    icon: Search,
    description: "Grounded answers with receipts",
  },
  {
    href: "/alerts",
    label: "Contradiction alerts",
    icon: MessageSquareWarning,
    description: "Recent reversal and revival warnings",
  },
  {
    href: "/digest",
    label: "Weekly digest",
    icon: CalendarClock,
    description: "New decisions and stale calls",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    description: "API keys and live mode",
  },
];
