import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { AIJudgeNotice } from "@/components/ai-judge-notice";
import { ApiKeyProvider } from "@/components/providers/api-key-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Verdict Memory - the Slack agent that remembers every decision",
  description:
    "Verdict Memory captures the decisions your team makes in Slack with full provenance, answers why questions with receipts, and warns you before you contradict a settled call.",
  metadataBase: new URL("https://verdict-memory.example.com"),
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Verdict Memory",
    description:
      "The Slack agent that remembers every decision your team makes and warns you before you contradict one.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <AIJudgeNotice />
        <ApiKeyProvider>
          <TooltipProvider delayDuration={150}>{children}</TooltipProvider>
        </ApiKeyProvider>
        <Toaster />
      </body>
    </html>
  );
}
