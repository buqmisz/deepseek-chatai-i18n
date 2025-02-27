import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/app/components/Navbar";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
  const isArabic = locale === "ar";
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  return (
    <html lang={locale} dir={isArabic ? "rtl" : "ltr"}>
      <body className={`${tajawal.className} ${tajawal.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {/* add lang selector */}
          <Navbar />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
